# Copilot instructions for this repo

This repo is a Hexo-based static blog with a customized theme and PWA. Use these facts and workflows to be productive fast.

- Architecture
  - Static site generator: Hexo (CLI and core in `package.json`). Content in `source/`, built output in `public/`, config in `_config.yml` and theme config in `themes/default/_config.yml`.
  - Theme: `themes/default` is modified; prefer minimal changes and follow existing patterns. Custom assets in `public/custom.css` and `public/custom.js`.
  - PWA: `hexo-offline` plus a custom SW update prompt: Workbox config in `hexo-offline.config.cjs`, client helper in `source/js/sw-update.js` (built to `/js/sw-update.js`).
  - Markdown processing: `markdown-it` with anchors, attrs, checkboxes, TeX math (MathJax), and Mermaid enabled in `_config.yml`.

- Local dev and build (Node 22, Windows-friendly)
  - Install: `npm ci` (fallback `npm install`). If `themes/default/package.json` exists, run install there too (CI does this).
  - Dev server: `npm run server` (Hexo at http://localhost:4000). Quick preview: `npm run look`.
  - Build: `npm run clean && npm run build`; output lands in `public/`.
  - Deploy (SSH req’d): `npm run deploy`. Targets `gh-pages` per `_config.yml → deploy` (repo uses SSH `git@github.com:SteveZMTstudios/articles.git`).

- CI/CD overview
  - PR checks: `.github/workflows/check-pages.yml` builds the site and validates HTML (tidy). Direct merges to `gh-pages` are blocked.
  - Deploy: `.github/workflows/hexo-deploy.yml` runs on merged PRs or manual dispatch; it mirrors local `clean/build/deploy`.
  - GitHub Pages: `.github/workflows/static.yml` serves the `gh-pages` branch as the site.

- Content conventions (posts/pages)
  - Posts live in `source/_posts/*.md`. Use scaffold `scaffolds/post.md` or run Hexo: `hexo new post "your-slug"`.
  - Front‑matter example (keep fields used by theme):
    ---
    uuid: <new-guid>
    title: Your Title
    date: YYYY-MM-DD HH:mm:ss
    tags: [标签1, 标签2]
    categories: [分类]
    donate: true
    toc: true
    comments: true
    ---
    Content above `<!-- more -->` is the excerpt.
  - Images per post: `source/images/blog/<post-slug>/...` and reference it at `/images/blog/<post-slug>/img.jpg`.
  - Optional image optimizer: run `transform_img.py` (requires Pillow) to create `_compressed.jpg` images and rewrite Markdown references.
  - Site pages (e.g., `source/new/index.md`) provide a UI to download a post template and link to GitHub upload flows.

- PWA specifics you must keep in sync
  - Workbox configuration: `hexo-offline.config.cjs` defines `globPatterns`, `runtimeCaching`, cache names, and size limits; update here rather than editing generated SW.
  - Update UX: `source/js/sw-update.js` triggers a snackbar (MDUI) or confirm to refresh when SW or precache changes.

- Notable settings/patterns
  - `_config.yml` enables MathJax (`math.enabled=true`) and Mermaid; headings use custom slugify (lowercase and hyphens with `encodeURIComponent`).
  - `skip_render`/`include` rules allow bundling `source/.github/**` into the site; avoid moving these paths without updating config.
  - Search is generated via `hexo-generator-search` (search.xml). `hexo-algolia` is present but not configured in `_config.yml`.

- When in doubt, reference these files first: `package.json`, `_config.yml`, `hexo-offline.config.cjs`, `scaffolds/post.md`, `source/js/sw-update.js`, `themes/default/_config.yml`, and `.github/workflows/*.yml`.
