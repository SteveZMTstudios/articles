'use strict';

/**
 * Hexo filter: add aspect-ratio inline style to lazyload images with width/height.
 * Runs at after_render:html stage (after lazyload plugin has injected data-original).
 * Zero runtime JS — pure CSS fix applied at build time. Naturally compatible with PJAX.
 */

hexo.extend.filter.register('after_render:html', function (html, data) {
  var path = (data && data.path) || 'unknown';
  console.log('[aspect-ratio] filter running for:', path, 'html length:', (html||'').length);
  if (!html) return html;

  // Match <img> tags that have both data-original AND width AND height attributes
  html = html.replace(
    /<img\b([^>]*\bdata-original\b[^>]*)>/gi,
    function (match, attrs) {
      // Extract width and height
      var wMatch = attrs.match(/\bwidth\s*=\s*["'](\d+)["']/i);
      var hMatch = attrs.match(/\bheight\s*=\s*["'](\d+)["']/i);

      if (!wMatch || !hMatch) return match;

      // Check if aspect-ratio already present
      if (/aspect-ratio\s*:/.test(attrs)) return match;

      var w = wMatch[1];
      var h = hMatch[1];

      // Append aspect-ratio to existing style or add new style attribute
      if (/\bstyle\s*=\s*["']/i.test(attrs)) {
        attrs = attrs.replace(
          /(\bstyle\s*=\s*["'])([^"']*)(["'])/i,
          '$1$2;aspect-ratio:' + w + '/' + h + '$3'
        );
      } else {
        attrs += ' style="aspect-ratio:' + w + '/' + h + '"';
      }

      return '<img ' + attrs + '>';
    }
  );

  return html;
});
