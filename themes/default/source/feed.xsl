<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:notice="http://www.stevezmt.top/ns/notice"
  xmlns:browser="https://blog.stevezmt.top/ns/feed-browser"
  exclude-result-prefixes="atom content notice browser">

  <xsl:output method="html" encoding="UTF-8" indent="no"/>
  <xsl:template match="notice:noscript" />
  <xsl:template match="/">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/*[local-name()='feed']/*[local-name()='title'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='title']"/></title>
        <link rel="stylesheet" type="text/css" href="/feed.css"/>
      </head>
      <body>
        <div class="feed-actionbar holo-actionBar">
          <div class="feed-actionbar-inner">
            <a href="#" class="feed-actionbar-title-link">
              <span class="feed-actionbar-title">
                <img src="/k/rss.png" alt="Feed Icon" class="feed-actionbar-icon"/>
                <span class="feed-actionbar-title-text">
                  <xsl:choose>
                    <xsl:when test="/*[local-name()='rss']">RSS 预览</xsl:when>
                    <xsl:otherwise>源 预览</xsl:otherwise>
                  </xsl:choose>
                </span>
              </span>
            </a>
            <span class="feed-actionbar-spacer"></span>
            <a href="/atom.xml">RSS XML</a>
            <a href="/">首页</a>
            <a href="/k/">兼容模式</a>
          </div>
        </div>
        <div class="feed-page">
          <div class="feed-panel feed-intro">
            <div class="feed-label">
              <xsl:choose>
                <xsl:when test="/*[local-name()='rss']">RSS Feed</xsl:when>
                <xsl:otherwise>Atom Feed</xsl:otherwise>
              </xsl:choose>
            </div>

            <h1 class="feed-title">
              <xsl:value-of select="/*[local-name()='feed']/*[local-name()='title'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='title']"/>
            </h1>

            <p class="feed-subtitle">
              <xsl:value-of select="/*[local-name()='feed']/*[local-name()='subtitle'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='description']"/>
            </p>

            <p class="feed-meta">
              最后更新:
              <xsl:value-of select="/*[local-name()='feed']/*[local-name()='updated'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='lastBuildDate']"/>
              <xsl:text> | 条目: </xsl:text>
              <xsl:value-of select="count(/*[local-name()='feed']/*[local-name()='entry'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='item'])"/>
              <xsl:if test="/*[local-name()='feed']/*[local-name()='author']/*[local-name()='name'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='managingEditor']">
                | 发布者:
                <xsl:value-of select="/*[local-name()='feed']/*[local-name()='author']/*[local-name()='name'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='managingEditor']"/>
              </xsl:if>
            </p>
            <p class="feed-meta">
              <span style="font-weight: bold;color: #dddddd">您正在查看的源包含频繁更新的内容。</span>订阅源后，该源会添加到您的阅读器源列表中。该源的更新信息会自动下载到计算机，通过 Internet Explorer 及其他程序可以查看这些信息。<a href="https://support.microsoft.com/help/73c6e717-7815-4594-98e5-81fa369e951c">进一步了解源。</a>
            </p>

            <p class="feed-tools">
              <a href="/atom.xml">订阅源 XML</a>
<a id="copy-url-btn" href="#" style="display:none">复制链接</a>
<script>
<![CDATA[
(function(){
  var a = document.getElementById('copy-url-btn');
  if (!a) return;
  a.style.display = 'inline-block';
  var orig = a.textContent;
  a.onclick = function(e){
    e.preventDefault();
    var url = window.location.href;
    var done = function(){
      a.textContent = '复制成功';
      setTimeout(function(){ a.textContent = orig; }, 3000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function(){
        var t = document.createElement('textarea');
        t.value = url;
        t.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        done();
      });
    } else {
      var t = document.createElement('textarea');
      t.value = url;
      t.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
      done();
    }
  };
})();
]]>
</script>
              <a href="/">返回站点首页</a>
            </p>
          </div>
          <xsl:choose>
            <xsl:when test="/*[local-name()='feed']">
              <xsl:for-each select="/*[local-name()='feed']/*[local-name()='entry']">
                <xsl:call-template name="entry"/>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:for-each select="/*[local-name()='rss']/*[local-name()='channel']/*[local-name()='item']">
                <xsl:call-template name="entry"/>
              </xsl:for-each>
            </xsl:otherwise>
          </xsl:choose>

          <p class="feed-note">您正在以可视化的方式直接查看源。<a href="#">返回顶部</a></p>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template name="entry">
    <xsl:variable name="entry-url">
      <xsl:choose>
        <xsl:when test="*[local-name()='link']/@href">
          <xsl:value-of select="*[local-name()='link'][not(@rel) or @rel='alternate'][1]/@href"/>
        </xsl:when>
        <xsl:when test="*[local-name()='link']">
          <xsl:value-of select="*[local-name()='link'][1]"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="*[local-name()='id'] | *[local-name()='guid']"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="toggle-id" select="concat('entry-', generate-id())"/>

    <div class="entry">
      <input class="entry-toggle" type="checkbox" id="{$toggle-id}"/>

      <h2 class="entry-title">
        <a href="{normalize-space($entry-url)}">
          <xsl:value-of select="*[local-name()='title']"/>
        </a>
      </h2>

      <p class="entry-meta">
        发布:
        <xsl:value-of select="*[local-name()='published'] | *[local-name()='pubDate']"/>
        <xsl:if test="*[local-name()='updated']">
          <xsl:text>  更新: </xsl:text>
          <xsl:value-of select="*[local-name()='updated']"/>
        </xsl:if>
      </p>

      <xsl:if test="*[local-name()='category']">
        <p class="entry-tags">
          <xsl:for-each select="*[local-name()='category']">
            <span class="entry-tag">
              <xsl:choose>
                <xsl:when test="@term"><xsl:value-of select="@term"/></xsl:when>
                <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
              </xsl:choose>
            </span>
          </xsl:for-each>
        </p>
      </xsl:if>

      <xsl:if test="*[local-name()='summary'] or *[local-name()='description']">
        <div class="entry-summary">
          <xsl:call-template name="clean-text">
            <xsl:with-param name="text">
              <xsl:call-template name="strip-html">
                <xsl:with-param name="text" select="*[local-name()='summary'] | *[local-name()='description']"/>
              </xsl:call-template>
            </xsl:with-param>
          </xsl:call-template>
        </div>
      </xsl:if>

      <p class="entry-actions">
        <a class="entry-original" href="{normalize-space($entry-url)}">打开原文</a>
        <label class="entry-toggle-label" for="{$toggle-id}">
          <span class="show-text">展开正文</span>
          <span class="hide-text">收起正文</span>
        </label>
      </p>

      <div class="entry-body">
        <xsl:choose>
          <xsl:when test="*[local-name()='html' and namespace-uri()='https://blog.stevezmt.top/ns/feed-browser']/*">
            <xsl:apply-templates select="*[local-name()='html' and namespace-uri()='https://blog.stevezmt.top/ns/feed-browser']/*/*" mode="html"/>
          </xsl:when>
          <xsl:when test="*[local-name()='content']">
            <xsl:call-template name="emit-html-text">
              <xsl:with-param name="text" select="*[local-name()='content']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:when test="*[local-name()='encoded']">
            <xsl:call-template name="emit-html-text">
              <xsl:with-param name="text" select="*[local-name()='encoded']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:when test="*[local-name()='summary']">
            <xsl:call-template name="emit-html-text">
              <xsl:with-param name="text" select="*[local-name()='summary']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="emit-html-text">
              <xsl:with-param name="text" select="*[local-name()='description']"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
        <p class="entry-actions entry-actions-bottom">
          <label class="entry-toggle-label" for="{$toggle-id}">收起正文</label>
        </p>
      </div>
    </div>
  </xsl:template>

  <xsl:template name="emit-html-text">
    <xsl:param name="text"/>
    <div class="entry-body-html">
      <xsl:value-of select="$text" disable-output-escaping="yes"/>
    </div>
  </xsl:template>

  <xsl:template name="strip-html">
    <xsl:param name="text"/>
    <xsl:choose>
      <xsl:when test="contains($text, '&lt;')">
        <xsl:value-of select="substring-before($text, '&lt;')"/>
        <xsl:variable name="after-open" select="substring-after($text, '&lt;')"/>
        <xsl:choose>
          <xsl:when test="contains($after-open, '&gt;')">
            <xsl:text> </xsl:text>
            <xsl:call-template name="strip-html">
              <xsl:with-param name="text" select="substring-after($after-open, '&gt;')"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> </xsl:text>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="*" mode="html">
    <xsl:element name="{local-name()}">
      <xsl:for-each select="@*">
        <xsl:attribute name="{local-name()}">
          <xsl:value-of select="."/>
        </xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates select="node()" mode="html"/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="text()" mode="html">
    <xsl:value-of select="."/>
  </xsl:template>

  <xsl:template match="comment()|processing-instruction()" mode="html"/>

  <xsl:template name="clean-text">
    <xsl:param name="text"/>
    <xsl:variable name="nbsp">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$text"/>
        <xsl:with-param name="search" select="'&amp;nbsp;'"/>
        <xsl:with-param name="replace" select="' '"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="amp">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$nbsp"/>
        <xsl:with-param name="search" select="'&amp;amp;'"/>
        <xsl:with-param name="replace" select="'&amp;'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="lt">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$amp"/>
        <xsl:with-param name="search" select="'&amp;lt;'"/>
        <xsl:with-param name="replace" select="'&lt;'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="gt">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$lt"/>
        <xsl:with-param name="search" select="'&amp;gt;'"/>
        <xsl:with-param name="replace" select="'&gt;'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="quot">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$gt"/>
        <xsl:with-param name="search" select="'&amp;quot;'"/>
        <xsl:with-param name="replace" select="'&quot;'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="apos">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$quot"/>
        <xsl:with-param name="search" select='"&amp;#39;"'/>
        <xsl:with-param name="replace" select='"&apos;"'/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:variable name="slash">
      <xsl:call-template name="replace-string">
        <xsl:with-param name="text" select="$apos"/>
        <xsl:with-param name="search" select="'&amp;#x2F;'"/>
        <xsl:with-param name="replace" select="'/'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:value-of select="normalize-space($slash)"/>
  </xsl:template>

  <xsl:template name="replace-string">
    <xsl:param name="text"/>
    <xsl:param name="search"/>
    <xsl:param name="replace"/>
    <xsl:choose>
      <xsl:when test="$search != '' and contains($text, $search)">
        <xsl:value-of select="substring-before($text, $search)"/>
        <xsl:value-of select="$replace"/>
        <xsl:call-template name="replace-string">
          <xsl:with-param name="text" select="substring-after($text, $search)"/>
          <xsl:with-param name="search" select="$search"/>
          <xsl:with-param name="replace" select="$replace"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
