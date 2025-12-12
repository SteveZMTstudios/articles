/**
 * GitHub OAuth and Pull Request Worker (Secured)
 * 
 * Environment Variables:
 * - GITHUB_CLIENT_ID: GitHub OAuth App Client ID
 * - GITHUB_CLIENT_SECRET: GitHub OAuth App Client Secret
 * - REPO_OWNER: The owner of the repository (e.g., 'SteveZMTstudios')
 * - REPO_NAME: The name of the repository (e.g., 'articles')
 * - ALLOWED_ORIGIN: Comma-separated list of allowed origins (e.g., 'https://blog.com,http://localhost:4000'). 
 *                   If not set, defaults to '*' (NOT RECOMMENDED for production).
 * - KV: (Optional) KV Namespace binding for Rate Limiting.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // Parse ALLOWED_ORIGIN as comma-separated list
    const allowedOriginsStr = env.ALLOWED_ORIGIN || '*';
    const allowedOrigins = allowedOriginsStr.split(',').map(s => s.trim());

    const isOriginAllowed = (origin) => {
        if (allowedOrigins.includes('*')) return true;
        return origin && allowedOrigins.includes(origin);
    };

    // --- Redirect root and index.html to GitHub ---
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return Response.redirect('https://github.com/stevezmtstudios/articles/blob/main/workers/worker.js', 302);
    }

    // --- CORS Helper ---
    const getCorsHeaders = (req) => {
        const origin = req.headers.get('Origin');
        if (isOriginAllowed(origin)) {
            return {
                'Access-Control-Allow-Origin': origin || '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            };
        }
        return {};
    };

    const corsHeaders = getCorsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- Rate Limiting (Simple IP-based) ---
    // Requires a KV Namespace bound to 'KV'
    if (url.pathname === '/submit' && env.KV) {
        const limit = 10; // Max requests
        const window = 3600; // Window in seconds (1 hour)
        const key = `rate_limit_${clientIP}`;
        
        try {
            const count = await env.KV.get(key);
            if (count && parseInt(count) >= limit) {
                return new Response(JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }), { 
                    status: 429, 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                });
            }
            // Increment count (TTL resets on update, simple sliding window approximation)
            await env.KV.put(key, (parseInt(count || '0') + 1).toString(), { expirationTtl: window });
        } catch (e) {
            console.error('Rate limit error:', e);
            // Fail open if KV fails
        }
    }

    // --- 1. OAuth Redirect ---
    if (url.pathname === '/auth') {
      const state = crypto.randomUUID();
      const clientId = env.GITHUB_CLIENT_ID;
      const redirectUri = `${url.origin}/callback`;
      const scope = 'public_repo'; 
      
      // Determine client origin for postMessage security
      // Try to get from 'origin' query param, fallback to Referer, fallback to first allowed origin
      let clientOrigin = url.searchParams.get('origin');
      if (!clientOrigin) {
          const referer = request.headers.get('Referer');
          if (referer) {
              try {
                  clientOrigin = new URL(referer).origin;
              } catch (e) {}
          }
      }
      
      // Validate client origin
      if (!isOriginAllowed(clientOrigin)) {
          // If invalid or missing, and we have a specific list, fail or default to first safe one?
          // Safer to fail if strict, but for UX maybe default to first if exists
          if (!allowedOrigins.includes('*') && allowedOrigins.length > 0) {
               // If clientOrigin is invalid, we can't safely redirect back with token.
               // But we can default to the first allowed origin as a fallback target.
               clientOrigin = allowedOrigins[0];
          } else {
               clientOrigin = '*';
          }
      }

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      
      // Set state cookie for CSRF protection AND client origin cookie
      const headers = new Headers();
      headers.append('Location', authUrl);
      headers.append('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
      headers.append('Set-Cookie', `oauth_client_origin=${clientOrigin}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
      
      return new Response(null, { status: 302, headers });
    }

    // --- 2. OAuth Callback ---
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookieHeader = request.headers.get('Cookie');
      
      // Parse cookies
      const cookies = {};
      if (cookieHeader) {
          cookieHeader.split(';').forEach(cookie => {
              const parts = cookie.split('=');
              if(parts.length >= 2) cookies[parts[0].trim()] = parts[1];
          });
      }

      // CSRF Check
      if (!state || cookies['oauth_state'] !== state) {
          return new Response('Invalid state parameter (CSRF check failed)', { status: 400 });
      }

      if (!code) return new Response('Missing code', { status: 400 });

      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) return new Response(tokenData.error_description, { status: 400 });

      // Secure postMessage target
      // Retrieve original client origin from cookie
      let targetOrigin = cookies['oauth_client_origin'];
      
      // Validate again to be sure
      if (!isOriginAllowed(targetOrigin)) {
          targetOrigin = allowedOrigins.includes('*') ? '*' : allowedOrigins[0];
      }
      
      const html = `
        <script>
          window.opener.postMessage({ type: 'github-token', token: '${tokenData.access_token}' }, '${targetOrigin}');
          window.close();
        </script>
        <h1>Authentication successful. You can close this window.</h1>
      `;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // --- 3. Submit PR ---
    if (url.pathname === '/submit' && request.method === 'POST') {
      try {
        const { token, files, message, branch } = await request.json();
        
        // Security: Enforce Repo/Owner from Env
        const owner = env.REPO_OWNER;
        const repo = env.REPO_NAME;
        
        if (!owner || !repo) {
             return new Response(JSON.stringify({ success: false, error: 'Server misconfigured: REPO_OWNER/REPO_NAME missing' }), { status: 500, headers: corsHeaders });
        }

        if (!token || !files || !message) {
          return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400, headers: corsHeaders });
        }

        // Security: Validate Token & User
        const userResp = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'User-Agent': 'Cloudflare-Worker-Editor'
            }
        });
        
        if (!userResp.ok) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid GitHub Token' }), { status: 401, headers: corsHeaders });
        }

        // Security: Validate Files
        if (files.length > 20) throw new Error('Too many files (max 20)');
        
        for (const file of files) {
            // Path Traversal Check
            if (file.path.includes('..') || file.path.startsWith('/') || file.path.includes('\\')) {
                throw new Error(`Invalid file path: ${file.path}`);
            }
            // Whitelist Check
            const isPost = file.path.startsWith('source/_posts/') && file.path.endsWith('.md');
            const isImage = file.path.startsWith('source/images/blog/');
            if (!isPost && !isImage) {
                throw new Error(`File path not allowed: ${file.path}`);
            }
            // Size Check (approx 5MB)
            if (file.content.length > 5 * 1024 * 1024 * 1.4) { // Base64 expansion factor approx 1.33
                 throw new Error(`File too large: ${file.path}`);
            }
        }

        const headers = {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Cloudflare-Worker-Editor'
        };

        // Helper for GitHub API
        const ghFetch = async (path, opts = {}) => {
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
            headers,
            ...opts
          });
          if (!res.ok) {
            // Log full error internally if possible, return generic to user
            console.error(`GitHub API Error ${path}: ${res.status} ${await res.text()}`);
            throw new Error(`GitHub API Error: ${res.status}`);
          }
          return res.json();
        };

        // 1. Get reference to base branch
        const baseBranch = 'main'; 
        const refData = await ghFetch(`/git/ref/heads/${baseBranch}`);
        const latestCommitSha = refData.object.sha;

        // 2. Get the tree of the latest commit
        const commitData = await ghFetch(`/git/commits/${latestCommitSha}`);
        const baseTreeSha = commitData.tree.sha;

        // 3. Create blobs for files and build tree array
        const treeItems = [];
        for (const file of files) {
          const blobBody = {
            content: file.content,
            encoding: file.encoding || 'utf-8'
          };
          
          const blobRes = await ghFetch(`/git/blobs`, {
            method: 'POST',
            body: JSON.stringify(blobBody)
          });
          
          treeItems.push({
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobRes.sha
          });
        }

        // 4. Create a new tree
        const newTreeRes = await ghFetch(`/git/trees`, {
          method: 'POST',
          body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: treeItems
          })
        });
        const newTreeSha = newTreeRes.sha;

        // 5. Create a new commit
        const newCommitRes = await ghFetch(`/git/commits`, {
          method: 'POST',
          body: JSON.stringify({
            message: message,
            tree: newTreeSha,
            parents: [latestCommitSha]
          })
        });
        const newCommitSha = newCommitRes.sha;

        // 6. Create a new branch
        const newBranchName = branch || `new-post-${Date.now()}`;
        await ghFetch(`/git/refs`, {
          method: 'POST',
          body: JSON.stringify({
            ref: `refs/heads/${newBranchName}`,
            sha: newCommitSha
          })
        });

        // 7. Create Pull Request
        const prRes = await ghFetch(`/pulls`, {
          method: 'POST',
          body: JSON.stringify({
            title: message,
            body: `Automated submission from editor.\n\nFiles:\n${files.map(f => `- ${f.path}`).join('\n')}`,
            head: newBranchName,
            base: baseBranch
          })
        });

        return new Response(JSON.stringify({ 
          success: true, 
          pr_url: prRes.html_url,
          pr_number: prRes.number
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
