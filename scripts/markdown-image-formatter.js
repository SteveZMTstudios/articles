'use strict';

const fs = require('fs');
const path = require('path');

const dimensionCache = new Map();

async function fetchRemoteImageBuffer(imageUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(imageUrl, {
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function escapeHtmlAttribute(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decodeHtmlEntities(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function unescapeMarkdownText(value) {
  return String(value ?? '').replace(/\\([\\`*_[\]{}()#+\-.!"'])/g, '$1');
}

function splitUrlParts(rawUrl) {
  const match = String(rawUrl ?? '').match(/^([^?#]*)([?#].*)?$/);
  return {
    pathname: match ? match[1] : '',
    suffix: match && match[2] ? match[2] : '',
  };
}

function parseSiteUrl(rootDir, explicitSiteUrl) {
  if (explicitSiteUrl) {
    return explicitSiteUrl;
  }

  const configPath = path.join(rootDir, '_config.yml');
  const content = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
  const match = content.match(/^url:\s*(.+)\s*$/m);

  if (!match) {
    return 'https://example.com/';
  }

  return String(match[1]).trim().replace(/^['"]|['"]$/g, '');
}

function readPngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readGifDimensions(buffer) {
  if (buffer.length < 10) {
    return null;
  }

  const signature = buffer.toString('ascii', 0, 6);
  if (signature !== 'GIF87a' && signature !== 'GIF89a') {
    return null;
  }

  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function readJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) {
    return null;
  }

  let offset = 2;
  while (offset + 7 < buffer.length) {
    while (offset < buffer.length && buffer[offset] !== 0xff) {
      offset += 1;
    }

    if (offset + 1 >= buffer.length) {
      break;
    }

    let marker = buffer[offset + 1];
    offset += 2;

    while (marker === 0xff && offset < buffer.length) {
      marker = buffer[offset];
      offset += 1;
    }

    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }

    if (offset + 1 >= buffer.length) {
      break;
    }

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2) {
      return null;
    }

    const segmentStart = offset + 2;
    const isSofMarker = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);

    if (isSofMarker && segmentStart + 5 < buffer.length) {
      return {
        height: buffer.readUInt16BE(segmentStart + 1),
        width: buffer.readUInt16BE(segmentStart + 3),
      };
    }

    offset += segmentLength;
  }

  return null;
}

function readWebpDimensions(buffer) {
  if (buffer.length < 30) {
    return null;
  }

  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }

  const chunkType = buffer.toString('ascii', 12, 16);

  if (chunkType === 'VP8X' && buffer.length >= 30) {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunkType === 'VP8 ' && buffer.length >= 30) {
    const start = 20;
    if (buffer.readUInt16LE(start + 3) !== 0x9d01) {
      return null;
    }

    return {
      width: buffer.readUInt16LE(start + 6),
      height: buffer.readUInt16LE(start + 8),
    };
  }

  if (chunkType === 'VP8L' && buffer.length >= 25) {
    const b0 = buffer[21];
    const b1 = buffer[22];
    const b2 = buffer[23];
    const b3 = buffer[24];

    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }

  return null;
}

function readSvgDimensions(buffer) {
  const text = buffer.toString('utf8');
  const widthMatch = text.match(/\bwidth=["']([0-9.]+)(px)?["']/i);
  const heightMatch = text.match(/\bheight=["']([0-9.]+)(px)?["']/i);

  if (widthMatch && heightMatch) {
    return {
      width: Number(widthMatch[1]),
      height: Number(heightMatch[1]),
    };
  }

  const viewBoxMatch = text.match(/\bviewBox=["']([0-9.+-]+)\s+([0-9.+-]+)\s+([0-9.+-]+)\s+([0-9.+-]+)["']/i);
  if (!viewBoxMatch) {
    return null;
  }

  return {
    width: Number(viewBoxMatch[3]),
    height: Number(viewBoxMatch[4]),
  };
}

function readBufferDimensions(buffer, hintPath = '') {
  if (!buffer || !buffer.length) {
    return null;
  }

  const extension = path.extname(hintPath).toLowerCase();
  let dimensions = null;

  if (extension === '.png') {
    dimensions = readPngDimensions(buffer);
  } else if (extension === '.jpg' || extension === '.jpeg' || extension === '.jpe') {
    dimensions = readJpegDimensions(buffer);
  } else if (extension === '.gif') {
    dimensions = readGifDimensions(buffer);
  } else if (extension === '.webp') {
    dimensions = readWebpDimensions(buffer);
  } else if (extension === '.svg') {
    dimensions = readSvgDimensions(buffer);
  }

  if (!dimensions) {
    if (buffer.length >= 4 && buffer.readUInt16BE(0) === 0xffd8) {
      dimensions = readJpegDimensions(buffer);
    } else if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      dimensions = readWebpDimensions(buffer);
    } else if (/<svg\b/i.test(buffer.toString('utf8'))) {
      dimensions = readSvgDimensions(buffer);
    }
  }

  if (!dimensions || !Number.isFinite(dimensions.width) || !Number.isFinite(dimensions.height) || dimensions.width <= 0 || dimensions.height <= 0) {
    return null;
  }

  return dimensions;
}

function readImageDimensions(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
    return null;
  }

  const buffer = fs.readFileSync(imagePath);
  return readBufferDimensions(buffer, imagePath);
}

async function readRemoteImageDimensions(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (dimensionCache.has(imageUrl)) {
    return dimensionCache.get(imageUrl);
  }

  const promise = (async () => {
    const buffer = await fetchRemoteImageBuffer(imageUrl);
    if (!buffer) {
      return null;
    }

    return readBufferDimensions(buffer, imageUrl);
  })();

  dimensionCache.set(imageUrl, promise);
  return promise;
}

function resolveImageReference(rawUrl, options) {
  const ref = String(rawUrl ?? '').trim();
  if (!ref) {
    return null;
  }

  const siteUrl = options.siteUrl;
  const sourceDir = options.sourceDir;
  const markdownFilePath = options.markdownFilePath || '';
  const site = new URL(siteUrl);
  const { pathname, suffix } = splitUrlParts(ref);

  if (/^https?:\/\//i.test(ref)) {
    const parsed = new URL(ref);
    const localPath = parsed.origin === site.origin ? path.join(sourceDir, parsed.pathname.replace(/^\/+/, '')) : null;
    return {
      absoluteUrl: ref,
      localPath,
    };
  }

  if (ref.startsWith('//')) {
    const absoluteUrl = `${site.protocol}${ref}`;
    const parsed = new URL(absoluteUrl);
    const localPath = parsed.origin === site.origin ? path.join(sourceDir, parsed.pathname.replace(/^\/+/, '')) : null;
    return {
      absoluteUrl,
      localPath,
    };
  }

  if (pathname.startsWith('/')) {
    return {
      absoluteUrl: new URL(`${pathname}${suffix}`, siteUrl).href,
      localPath: path.join(sourceDir, pathname.replace(/^\/+/, '')),
    };
  }

  const markdownDir = markdownFilePath ? path.dirname(markdownFilePath) : sourceDir;
  const resolvedPath = path.resolve(markdownDir, pathname);
  const relativePath = path.relative(sourceDir, resolvedPath).replace(/\\/g, '/');

  if (relativePath.startsWith('..')) {
    return null;
  }

  return {
    absoluteUrl: new URL(`/${relativePath}${suffix}`, siteUrl).href,
    localPath: resolvedPath,
  };
}

function parseHtmlImageTag(tag) {
  const match = tag.match(/^<img\b([^>]*)\/?>(?:\s*)$/i);
  if (!match) {
    return null;
  }

  const attrText = match[1] || '';
  const attrs = {};
  const attrRegex = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let attrMatch;

  while ((attrMatch = attrRegex.exec(attrText)) !== null) {
    const name = attrMatch[1].toLowerCase();
    const value = attrMatch[3] ?? attrMatch[4] ?? attrMatch[5] ?? '';
    attrs[name] = value;
  }

  if (!attrs.src) {
    return null;
  }

  return {
    alt: decodeHtmlEntities(attrs.alt || ''),
    hasDimensions: Boolean(attrs.width && attrs.height),
    height: attrs.height || '',
    src: decodeHtmlEntities(attrs.src),
    title: decodeHtmlEntities(attrs.title || ''),
    width: attrs.width || '',
  };
}

async function describeImage(rawUrl, options) {
  const reference = resolveImageReference(decodeHtmlEntities(rawUrl), options);
  if (!reference) {
    return null;
  }

  if (reference.localPath) {
    const dimensions = readImageDimensions(reference.localPath);
    if (dimensions) {
      return {
        absoluteUrl: reference.absoluteUrl,
        dimensions,
      };
    }
  }

  const dimensions = await readRemoteImageDimensions(reference.absoluteUrl);
  if (!dimensions) {
    return null;
  }

  return {
    absoluteUrl: reference.absoluteUrl,
    dimensions,
  };
}

function parseMarkdownImage(text, startIndex) {
  if (text[startIndex] !== '!' || text[startIndex + 1] !== '[') {
    return null;
  }

  let index = startIndex + 2;
  let alt = '';

  while (index < text.length) {
    const char = text[index];
    if (char === '\\' && index + 1 < text.length) {
      alt += text[index + 1];
      index += 2;
      continue;
    }

    if (char === ']') {
      index += 1;
      break;
    }

    alt += char;
    index += 1;
  }

  if (text[index] !== '(') {
    return null;
  }

  index += 1;
  while (index < text.length && /\s/.test(text[index])) {
    index += 1;
  }

  if (index >= text.length) {
    return null;
  }

  let url = '';
  if (text[index] === '<') {
    index += 1;
    while (index < text.length && text[index] !== '>') {
      if (text[index] === '\\' && index + 1 < text.length) {
        url += text[index + 1];
        index += 2;
        continue;
      }

      url += text[index];
      index += 1;
    }

    if (text[index] !== '>') {
      return null;
    }

    index += 1;
  } else {
    let nestedParentheses = 0;
    while (index < text.length) {
      const char = text[index];

      if (char === '\\' && index + 1 < text.length) {
        url += text[index + 1];
        index += 2;
        continue;
      }

      if (char === '(') {
        nestedParentheses += 1;
        url += char;
        index += 1;
        continue;
      }

      if (char === ')') {
        if (nestedParentheses === 0) {
          break;
        }

        nestedParentheses -= 1;
        url += char;
        index += 1;
        continue;
      }

      if (/\s/.test(char) && nestedParentheses === 0) {
        break;
      }

      url += char;
      index += 1;
    }
  }

  while (index < text.length && /\s/.test(text[index])) {
    index += 1;
  }

  let title = '';
  if (index < text.length && (text[index] === '"' || text[index] === '\'' || text[index] === '(')) {
    const delimiter = text[index];
    index += 1;

    while (index < text.length) {
      const char = text[index];

      if (char === '\\' && index + 1 < text.length) {
        title += text[index + 1];
        index += 2;
        continue;
      }

      if ((delimiter === '"' && char === '"') || (delimiter === '\'' && char === '\'') || (delimiter === '(' && char === ')')) {
        index += 1;
        break;
      }

      title += char;
      index += 1;
    }

    while (index < text.length && /\s/.test(text[index])) {
      index += 1;
    }
  }

  if (text[index] !== ')') {
    return null;
  }

  return {
    alt: decodeHtmlEntities(unescapeMarkdownText(alt)),
    endIndex: index + 1,
    title: decodeHtmlEntities(unescapeMarkdownText(title)),
    url: decodeHtmlEntities(url.trim()),
  };
}

async function replaceMarkdownImagesInLine(line, options) {
  if (!line.includes('![')) {
    return line;
  }

  const codeSegments = [];
  const protectedLine = line.replace(/`+[^`]*`+/g, segment => {
    codeSegments.push(segment);
    return `\u0000CODE${codeSegments.length - 1}\u0000`;
  });

  let cursor = 0;
  let output = '';

  while (cursor < protectedLine.length) {
    const startIndex = protectedLine.indexOf('![', cursor);
    if (startIndex === -1) {
      output += protectedLine.slice(cursor);
      break;
    }

    if (startIndex > 0 && protectedLine[startIndex - 1] === '\\') {
      output += protectedLine.slice(cursor, startIndex + 1);
      cursor = startIndex + 1;
      continue;
    }

    output += protectedLine.slice(cursor, startIndex);
    const parsed = parseMarkdownImage(protectedLine, startIndex);

    if (!parsed) {
      output += protectedLine.slice(startIndex, startIndex + 2);
      cursor = startIndex + 2;
      continue;
    }

    const image = await describeImage(parsed.url, options);
    if (!image) {
      output += protectedLine.slice(startIndex, parsed.endIndex);
      cursor = parsed.endIndex;
      continue;
    }

    output += `<img src="${escapeHtmlAttribute(image.absoluteUrl)}" width="${image.dimensions.width}" height="${image.dimensions.height}" alt="${escapeHtmlAttribute(parsed.alt)}" title="${escapeHtmlAttribute(parsed.title)}">`;
    cursor = parsed.endIndex;
  }

  return output.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeSegments[Number(index)]);
}

async function replaceHtmlImagesInLine(line, options) {
  if (!line.includes('<img')) {
    return line;
  }

  const codeSegments = [];
  const protectedLine = line.replace(/`+[^`]*`+/g, segment => {
    codeSegments.push(segment);
    return `\u0000CODE${codeSegments.length - 1}\u0000`;
  });

  const tagRegex = /<img\b[^>]*\/?>/gi;
  let cursor = 0;
  let output = '';
  let match;

  while ((match = tagRegex.exec(protectedLine)) !== null) {
    output += protectedLine.slice(cursor, match.index);
    const imageTag = parseHtmlImageTag(match[0]);

    if (!imageTag) {
      output += match[0];
      cursor = tagRegex.lastIndex;
      continue;
    }

    if (imageTag.hasDimensions) {
      output += match[0];
      cursor = tagRegex.lastIndex;
      continue;
    }

    const image = await describeImage(imageTag.src, options);
    if (!image) {
      output += match[0];
      cursor = tagRegex.lastIndex;
      continue;
    }

    output += `<img src="${escapeHtmlAttribute(image.absoluteUrl)}" width="${image.dimensions.width}" height="${image.dimensions.height}" alt="${escapeHtmlAttribute(imageTag.alt)}" title="${escapeHtmlAttribute(imageTag.title)}">`;
    cursor = tagRegex.lastIndex;
  }

  output += protectedLine.slice(cursor);
  return output.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeSegments[Number(index)]);
}

async function replaceLinkedMarkdownImagesInLine(line, options) {
  if (!line.includes('[![')) {
    return line;
  }

  const codeSegments = [];
  const protectedLine = line.replace(/`+[^`]*`+/g, segment => {
    codeSegments.push(segment);
    return `\u0000CODE${codeSegments.length - 1}\u0000`;
  });

  const linkImageRegex = /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g;
  let cursor = 0;
  let output = '';
  let match;

  while ((match = linkImageRegex.exec(protectedLine)) !== null) {
    output += protectedLine.slice(cursor, match.index);
    const image = await describeImage(match[2], options);

    if (!image) {
      output += match[0];
      cursor = linkImageRegex.lastIndex;
      continue;
    }

    output += `<a href="${escapeHtmlAttribute(decodeHtmlEntities(match[3]))}"><img src="${escapeHtmlAttribute(image.absoluteUrl)}" width="${image.dimensions.width}" height="${image.dimensions.height}" alt="${escapeHtmlAttribute(decodeHtmlEntities(match[1]))}" title=""></a>`;
    cursor = linkImageRegex.lastIndex;
  }

  output += protectedLine.slice(cursor);
  return output.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeSegments[Number(index)]);
}

async function transformMarkdownContent(content, options) {
  const normalizedWrappedLinks = content.replace(/\[(!\[[\s\S]*?\]\([^)]+\))\r?\n\]\(([^)]+)\)/g, '[$1]($2)');
  const normalizedOptions = {
    markdownFilePath: options?.markdownFilePath || '',
    siteUrl: parseSiteUrl(options?.rootDir || process.cwd(), options?.siteUrl),
    sourceDir: options?.sourceDir || path.join(options?.rootDir || process.cwd(), 'source'),
  };

  const newline = normalizedWrappedLinks.includes('\r\n') ? '\r\n' : '\n';
  const lines = normalizedWrappedLinks.replace(/\r\n/g, '\n').split('\n');
  const output = [];

  let inFence = false;
  let fenceMarker = '';

  for (const line of lines) {
    const trimmed = line.trimStart();
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);

    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker[0];
      } else if (marker[0] === fenceMarker) {
        inFence = false;
        fenceMarker = '';
      }

      output.push(line);
      continue;
    }

    if (inFence) {
      output.push(line);
      continue;
    }

    const linkedImageRewritten = await replaceLinkedMarkdownImagesInLine(line, normalizedOptions);
    const markdownRewritten = await replaceMarkdownImagesInLine(linkedImageRewritten, normalizedOptions);
    output.push(await replaceHtmlImagesInLine(markdownRewritten, normalizedOptions));
  }

  return output.join(newline);
}

function splitFrontMatter(content) {
  if (!content) {
    return { body: '', frontMatter: '', hasFrontMatter: false };
  }

  const normalized = content.replace(/^\uFEFF/, '');
  const match = normalized.match(/^(---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$))/);

  if (!match) {
    return { body: normalized, frontMatter: '', hasFrontMatter: false };
  }

  return {
    body: normalized.slice(match[1].length),
    frontMatter: match[1],
    hasFrontMatter: true,
  };
}

async function formatMarkdownFile(filePath, options = {}) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const hasBom = rawContent.startsWith('\uFEFF');
  const content = hasBom ? rawContent.slice(1) : rawContent;
  const { body, frontMatter, hasFrontMatter } = splitFrontMatter(content);

  if (hasFrontMatter && /^\s*img_size\s*:\s*unset\s*$/m.test(frontMatter)) {
    return {
      changed: false,
      content: hasBom ? `\uFEFF${content}` : content,
    };
  }

  const transformedBody = await transformMarkdownContent(body, {
    markdownFilePath: filePath,
    rootDir: options.rootDir,
    siteUrl: options.siteUrl,
    sourceDir: options.sourceDir,
  });

  const nextContent = `${hasFrontMatter ? frontMatter : ''}${transformedBody}`;
  return {
    changed: nextContent !== content,
    content: hasBom ? `\uFEFF${nextContent}` : nextContent,
  };
}

function walkMarkdownFiles(directory, results = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, results);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

async function processMarkdownDirectory(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const sourceDir = options.sourceDir || path.join(rootDir, 'source');
  const siteUrl = parseSiteUrl(rootDir, options.siteUrl);
  const markdownFiles = walkMarkdownFiles(sourceDir);

  const summary = {
    changedFiles: [],
    processedFiles: markdownFiles.length,
    sourceDir,
    siteUrl,
  };

  for (const filePath of markdownFiles) {
    const result = await formatMarkdownFile(filePath, { rootDir, sourceDir, siteUrl });
    if (!result.changed) {
      continue;
    }

    summary.changedFiles.push(filePath);
    if (options.write !== false) {
      fs.writeFileSync(filePath, result.content, 'utf8');
    }
  }

  return summary;
}

function registerHexoFilter(hexoInstance) {
  const rootDir = hexoInstance.base_dir || process.cwd();
  const sourceDir = path.join(rootDir, hexoInstance.config.source_dir || 'source');
  const siteUrl = hexoInstance.config.url;

  hexoInstance.extend.filter.register('before_post_render', async data => {
    if (!data || typeof data.content !== 'string' || !data.content.includes('![')) {
      return data;
    }

    data.content = await transformMarkdownContent(data.content, {
      markdownFilePath: data.full_source || data.source || data.path || '',
      rootDir,
      sourceDir,
      siteUrl,
    });

    return data;
  });
}

module.exports = {
  formatMarkdownFile,
  processMarkdownDirectory,
  registerHexoFilter,
  transformMarkdownContent,
};