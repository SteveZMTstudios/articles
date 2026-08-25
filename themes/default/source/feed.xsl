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
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
        <title><xsl:value-of select="/*[local-name()='feed']/*[local-name()='title'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='title']"/></title>
        <link rel="stylesheet" type="text/css" href="/feed.css"/>
      </head>
      <body>
        <header class="holo-actionBar">
          <button class="holo-title holo-up" onclick="location.href='/'">
            <img src="/k/rss.png" alt="RSS"/>
            <xsl:choose>
              <xsl:when test="/*[local-name()='rss']">RSS 预览</xsl:when>
              <xsl:otherwise>源 预览</xsl:otherwise>
            </xsl:choose>
          </button>
          <button style="float:right;" onclick="location.href='/atom.xml'">RSS XML</button>
          <button style="float:right;" onclick="location.href='/'">首页</button>
          <button style="float:right;" onclick="location.href='/k/'">兼容模式</button>
        </header>

        <div class="k-container">
          <h1 class="feed-header-title">
            <xsl:value-of select="/*[local-name()='feed']/*[local-name()='title'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='title']"/>
          </h1>

          <p class="subtitle" style="margin: 4px 0 8px;">
            <xsl:value-of select="/*[local-name()='feed']/*[local-name()='subtitle'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='description']"/>
          </p>

          <p class="meta" style="margin: 4px 0 12px;">
            最后更新:
            <xsl:value-of select="/*[local-name()='feed']/*[local-name()='updated'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='lastBuildDate']"/>
            <xsl:text> | 条目: </xsl:text>
            <xsl:value-of select="count(/*[local-name()='feed']/*[local-name()='entry'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='item'])"/>
            <xsl:if test="/*[local-name()='feed']/*[local-name()='author']/*[local-name()='name'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='managingEditor']">
              <xsl:text> | 发布者: </xsl:text>
              <xsl:value-of select="/*[local-name()='feed']/*[local-name()='author']/*[local-name()='name'] | /*[local-name()='rss']/*[local-name()='channel']/*[local-name()='managingEditor']"/>
            </xsl:if>
          </p>

          <p class="meta" style="margin: 4px 0 12px;">
            <span>您正在查看的源包含频繁更新的内容。订阅源后，该源会添加到您的阅读器源列表中。该源的更新信息会自动下载到计算机，通过阅读器及其他程序可以查看这些信息。</span>
            <a href="https://support.microsoft.com/zh-CN/Outlook/what-are-rss-feeds" target="_blank" rel="noopener">进一步了解源。</a>
          </p>

          <p style="margin: 10px 0 16px;">
            <button onclick="location.href='/atom.xml'">订阅源 XML</button>
            <button id="copy-url-btn" style="display:none">复制链接</button>
            <button onclick="location.href='/'">返回站点首页</button>
            <button onclick="location.href='/k/'">进入兼容模式</button>
          </p>

          <ul class="holo-list" role="list">
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
          </ul>

          <footer>
            <p>您正在以可视化的方式直接查看源。<a href="#">返回顶部</a><br/>© 框架设计和元素 由 <a href="https://stevezmt.top">Steve ZMT</a> 基于 Holo Design 设计。</p>
          </footer>
        </div>

        <script>
        <![CDATA[
        (function(){
          /* Touch active event helper for high compatibility */
          function addTouchListeners() {
            var inputElems = Array.prototype.slice.call(document.getElementsByTagName("button")).concat(
              Array.prototype.slice.call(document.getElementsByTagName("select"))).concat(
              Array.prototype.slice.call(document.getElementsByTagName("input")));
            if(document.querySelectorAll) {
              inputElems = inputElems.concat(
                Array.prototype.slice.call(document.querySelectorAll("*[role=\"button\"]")));
            }
            var elemTypes = ["button", "select"];
            var inputTypes = ["button", "checkbox", "radio", "range", "reset", "submit"];
            for(var i = 0; i < inputElems.length; i++) {
              if(elemTypes.indexOf(inputElems[i].tagName.toLowerCase()) !== -1 ||
                inputTypes.indexOf(inputElems[i].type.toLowerCase()) !== -1 ||
                (inputElems[i].getAttribute("role") && inputElems[i].getAttribute("role").toLowerCase() === "button")) {
                inputElems[i].addEventListener("touchstart", function(e){
                  if(this.classList) this.classList.add("active"); else this.className += " active";
                }, false);
                inputElems[i].addEventListener("touchend", function(e){
                  if(this.classList) this.classList.remove("active"); else this.className = this.className.replace(/\s*active/g, "");
                }, false);
                inputElems[i].addEventListener("touchcancel", function(e){
                  if(this.classList) this.classList.remove("active"); else this.className = this.className.replace(/\s*active/g, "");
                }, false);
              }
            }
          }

          if (window.addEventListener) {
            window.addEventListener("load", addTouchListeners, false);
          } else if (window.attachEvent) {
            window.attachEvent("onload", addTouchListeners);
          }

          /* Expand / Collapse change event listener for 99% browser compatibility fallback */
          function handleCheckboxChange(cb) {
            if (!cb) return;
            var li = cb.parentNode;
            while (li && li.tagName && li.tagName.toLowerCase() !== 'li') {
              li = li.parentNode;
            }
            if (li) {
              if (cb.checked) {
                if (li.classList) li.classList.add('is-expanded');
                else if (li.className.indexOf('is-expanded') === -1) li.className += ' is-expanded';
              } else {
                if (li.classList) li.classList.remove('is-expanded');
                else li.className = li.className.replace(/\s*is-expanded/g, '');
              }
            }
          }

          if (document.addEventListener) {
            document.addEventListener('change', function(e){
              if (e.target && (e.target.className || '').indexOf('entry-toggle') !== -1) {
                handleCheckboxChange(e.target);
              }
            }, false);

            document.addEventListener('keydown', function(e) {
              if ((e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) && e.target && e.target.getAttribute && e.target.getAttribute('role') === 'button') {
                var forId = e.target.getAttribute('for') || e.target.htmlFor;
                if (forId) {
                  e.preventDefault();
                  var cb = document.getElementById(forId);
                  if (cb) {
                    cb.checked = !cb.checked;
                    handleCheckboxChange(cb);
                  }
                }
              }
            }, false);
          }

          /* Copy URL Button */
          var copyBtn = document.getElementById('copy-url-btn');
          if (copyBtn) {
            copyBtn.style.display = 'inline-block';
            var origText = copyBtn.textContent || copyBtn.innerText;
            copyBtn.onclick = function(e){
              if (e && e.preventDefault) e.preventDefault();
              var url = window.location.href;
              var done = function(){
                if (copyBtn.textContent) copyBtn.textContent = '复制成功';
                else copyBtn.innerText = '复制成功';
                setTimeout(function(){
                  if (copyBtn.textContent) copyBtn.textContent = origText;
                  else copyBtn.innerText = origText;
                }, 3000);
              };
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done).catch(function(){
                  fallbackCopy(url, done);
                });
              } else {
                fallbackCopy(url, done);
              }
            };
          }

          function fallbackCopy(text, cb) {
            var t = document.createElement('textarea');
            t.value = text;
            t.style.cssText = 'position:fixed;left:-9999px';
            document.body.appendChild(t);
            t.select();
            try { document.execCommand('copy'); } catch(err){}
            document.body.removeChild(t);
            if (cb) cb();
          }
        })();
        ]]>
        </script>
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

    <li>
      <input class="entry-toggle" type="checkbox" id="{$toggle-id}"/>
      <label class="entry-button" for="{$toggle-id}" role="button" tabindex="0">
        <div class="item">
          <xsl:value-of select="*[local-name()='title']"/>
        </div>
        <div class="meta">
          <xsl:value-of select="*[local-name()='published'] | *[local-name()='pubDate']"/>
          <xsl:if test="*[local-name()='updated']">
            <xsl:text> | 更新: </xsl:text>
            <xsl:value-of select="*[local-name()='updated']"/>
          </xsl:if>
        </div>
        <xsl:if test="*[local-name()='category']">
          <div class="categories">
            <xsl:text>分类：</xsl:text>
            <xsl:for-each select="*[local-name()='category']">
              <xsl:choose>
                <xsl:when test="@term"><xsl:value-of select="@term"/></xsl:when>
                <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
              </xsl:choose>
              <xsl:if test="position() != last()">, </xsl:if>
            </xsl:for-each>
          </div>
        </xsl:if>
        <xsl:if test="*[local-name()='summary'] or *[local-name()='description']">
          <div class="summary">
            <xsl:call-template name="clean-text">
              <xsl:with-param name="text">
                <xsl:call-template name="strip-html">
                  <xsl:with-param name="text" select="*[local-name()='summary'] | *[local-name()='description']"/>
                </xsl:call-template>
              </xsl:with-param>
            </xsl:call-template>
          </div>
        </xsl:if>
      </label>
      <div class="entry-body">
        <a class="entry-read-original" role="button" href="{normalize-space($entry-url)}">
          阅读原文
        </a>
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
      </div>
    </li>
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
