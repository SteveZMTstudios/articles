'use strict';

const fs = require('hexo-fs');
const FEED_STYLESHEET_HREF = '/feed.xsl';
const FEED_STYLESHEET_PI = `<?xml-stylesheet type="text/xsl" href="${FEED_STYLESHEET_HREF}"?>`;
const FEED_POLYFILL_HREF = '/js/xslt-polyfill.min.js?v=1.0.22';
const FEED_POLYFILL_BOOTSTRAP = [
  '<script xmlns="http://www.w3.org/1999/xhtml">window.xsltUsePolyfillAlways = true;</script>',
  `<script src="${FEED_POLYFILL_HREF}" xmlns="http://www.w3.org/1999/xhtml"></script>`,
  '<notice:noscript xmlns:notice="http://www.stevezmt.top/ns/notice">⚠ 𝗘𝗥𝗥𝗢𝗥 🅹🅰🆅🅰🆂🅲🆁🅸🅿🆃 ​ 🅳🅸🆂🅰🅱🅻🅴🅳 !! 𝗫𝗦𝗟𝗧 / 𝗝𝗮𝘃𝗮𝗦𝗰𝗿𝗶𝗽𝘁 𝗮𝗿𝗲 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱. 𝗧𝗵𝗶𝘀 𝗳𝗲𝗲𝗱 𝗰𝗮𝗻 𝗼𝗻𝗹𝘆 𝗯𝗲 𝗿𝗲𝗻𝗱𝗲𝗿𝗲𝗱 𝗮𝘀 𝗫𝗠𝗟 𝘀𝗼𝘂𝗿𝗰𝗲, 𝘀𝗼 𝘁𝗵𝗲 𝗳𝘂𝗹𝗹𝘆 𝗳𝗼𝗿𝗺𝗮𝘁𝘁𝗲𝗱 𝗽𝗿𝗲𝘃𝗶𝗲𝘄 𝗶𝘀 𝘂𝗻𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲. Please enable XSLT or JavaScript, or open this feed in a compatible reader. </notice:noscript>'
].join('\n  ');
const FEED_BROWSER_NS = 'https://blog.stevezmt.top/ns/feed-browser';

let parseHtmlDocument = null;
let renderHtmlDom = null;
let decodeXml = null;

try {
  parseHtmlDocument = require('htmlparser2').parseDocument;
  const serializer = require('dom-serializer');
  renderHtmlDom = serializer.default || serializer;
  decodeXml = require('entities').decodeXML;
} catch (err) {
  parseHtmlDocument = null;
  renderHtmlDom = null;
  decodeXml = null;
}

hexo.extend.generator.register('custom', function() {
  return ['custom.css', 'custom.js'].map(item => ({
    path: item,
    data: function() {
      return fs.existsSync(`source/${item}`) ? fs.createReadStream(`source/${item}`) : '';
    }
  }));
});

function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}



function new_post(post) {
  let lines = post.content.split('\n');
  let index = lines.findIndex(item => item === 'uuid:');
  if (index > -1) {
    lines[index] += ' ' + uuid();
  } else {
    lines.splice(1, 0, 'uuid: ' + uuid());
  }
  post.content = lines.join('\n');
  if (post.path !== false) {
    fs.writeFile(post.path, post.content, () => {});
  }
}

function before_render(post) {
  if (post.layout == 'post' && !post.uuid) {
    let lines = post.raw.split('\n');
    let index = lines.findIndex(item => item === 'uuid:');
    post.uuid = uuid();
    if (index > -1) {
      lines[index] += ' ' + post.uuid;
    } else {
      lines.splice(1, 0, 'uuid: ' + post.uuid);
    }
    post.raw = lines.join('\n');
    fs.writeFile(post.full_source, post.raw, () => {});
  }
}

function getFeedPaths() {
  const feed = hexo.config.feed || {};
  const paths = feed.path || 'atom.xml';

  if (Array.isArray(paths)) {
    return paths.filter(item => typeof item === 'string');
  }

  return typeof paths === 'string' ? [paths] : ['atom.xml'];
}

function readRoute(path) {
  return new Promise((resolve, reject) => {
    const stream = hexo.route.get(path);
    if (!stream) {
      resolve(null);
      return;
    }

    const chunks = [];
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

function addFeedStylesheet(xml) {
  if (!xml) {
    return xml;
  }

  if (!/<(?:feed|rss)(?:\s|>)/.test(xml)) {
    return xml;
  }

  if (xml.includes('<?xml-stylesheet')) {
    return xml.replace(/<\?xml-stylesheet\b[^?]*\?>/, FEED_STYLESHEET_PI);
  }

  const declaration = /^(\uFEFF?<\?xml\b[^?]*\?>)/;
  if (declaration.test(xml)) {
    return xml.replace(declaration, `$1\n${FEED_STYLESHEET_PI}`);
  }

  return `${FEED_STYLESHEET_PI}\n${xml}`;
}

function addFeedPolyfill(xml) {
  if (!xml || xml.includes('xsltUsePolyfillAlways') || xml.includes('xslt-polyfill.min.js')) {
    return xml;
  }

  if (!/<(?:feed|rss)(?:\s|>)/.test(xml)) {
    return xml;
  }

  return xml.replace(/<(feed|rss)\b([^>]*)>/, `<$1$2>\n  ${FEED_POLYFILL_BOOTSTRAP}`);
}

function decodeFeedText(value) {
  if (!value) {
    return '';
  }

  const cdata = [];
  value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, text) => {
    cdata.push(text);
    return '';
  });

  if (cdata.length) {
    return cdata.join('');
  }

  return decodeXml ? decodeXml(value) : value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function getEntryElementText(entry, tagName) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i');
  const match = entry.match(pattern);
  return match ? decodeFeedText(match[1]) : '';
}

function getEntryHtml(entry) {
  return getEntryElementText(entry, 'content') ||
    getEntryElementText(entry, 'content:encoded') ||
    getEntryElementText(entry, 'description') ||
    getEntryElementText(entry, 'summary');
}

function sanitizeHtmlNodes(nodes) {
  if (!nodes) {
    return [];
  }

  const safe = [];
  nodes.forEach(node => {
    const name = (node.name || '').toLowerCase();
    if (name === 'script' || name === 'style' || name === 'noscript') {
      return;
    }

    if (node.attribs) {
      Object.keys(node.attribs).forEach(key => {
        const lower = key.toLowerCase();
        const value = String(node.attribs[key] || '').trim();
        if (/^on/.test(lower) || lower === 'srcdoc') {
          delete node.attribs[key];
          return;
        }
        if ((lower === 'href' || lower === 'src' || lower === 'xlink:href') && /^javascript:/i.test(value)) {
          delete node.attribs[key];
        }
      });
    }

    if (node.children) {
      node.children = sanitizeHtmlNodes(node.children);
    }

    safe.push(node);
  });

  return safe;
}

function htmlToXhtml(html) {
  if (!html || !parseHtmlDocument || !renderHtmlDom) {
    return '';
  }

  const doc = parseHtmlDocument(html, {
    decodeEntities: true,
    recognizeSelfClosing: true
  });
  const nodes = sanitizeHtmlNodes(doc.children || []);
  return renderHtmlDom(nodes, {
    xmlMode: true,
    encodeEntities: 'utf8'
  }).trim();
}

function ensureFeedBrowserNamespace(xml) {
  if (!xml || xml.includes('xmlns:browser=')) {
    return xml;
  }

  return xml.replace(/<(feed|rss)\b([^>]*)>/, `<$1$2 xmlns:browser="${FEED_BROWSER_NS}">`);
}

function addFeedBrowserHtml(xml) {
  if (!xml || xml.includes('<browser:html')) {
    return xml;
  }

  let changed = false;
  const enriched = xml.replace(/<(entry|item)\b[^>]*>[\s\S]*?<\/\1>/g, entry => {
    const tagMatch = entry.match(/^<([A-Za-z_:][\w:.-]*)\b/);
    const tag = tagMatch && tagMatch[1];
    const html = getEntryHtml(entry);
    const xhtml = htmlToXhtml(html);

    if (!tag || !xhtml) {
      return entry;
    }

    changed = true;
    return entry.replace(new RegExp(`</${tag}>\\s*$`), `<browser:html type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml">${xhtml}</div></browser:html>\n  </${tag}>`);
  });

  return changed ? ensureFeedBrowserNamespace(enriched) : xml;
}

async function after_generate() {
  const paths = getFeedPaths();

  await Promise.all(paths.map(async path => {
    const xml = await readRoute(path);
    const browserXml = addFeedBrowserHtml(xml);
    const styledXml = addFeedStylesheet(browserXml);
    const polyfilledXml = addFeedPolyfill(styledXml);

    if (polyfilledXml && polyfilledXml !== xml) {
      hexo.route.set(path, polyfilledXml);
    }
  }));
}

hexo.on('new', new_post);
hexo.extend.filter.register('before_post_render', before_render);
hexo.extend.filter.register('after_generate', after_generate);
