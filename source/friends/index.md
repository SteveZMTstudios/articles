---
uuid: 13b15467-8985-edbb-c6b1-f7eb4e3f86ba
title: 我的朋友
comments: false
toc: false
count: false
date: 1970-01-01 08:00:00

layout: 
share_menu:
donate:
license:
qrcode: 
---


<style>
.friends-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}
.friend-card {
  border-radius: 4px !important; /* Material Design 2 default corner */
  background: var(--mdui-theme-surface, #fff);
  overflow: hidden;
}
.friend-card .mdui-card-media {
  aspect-ratio: 4 / 3;
}
.friend-card .mdui-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.friend-card .mdui-card-primary {
  padding: 16px 16px 12px 16px;
}
.friend-card .mdui-card-primary-title {
  font-size: 1.15em;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.friend-card .mdui-card-primary-subtitle {
  font-size: 0.9em;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.friend-card .mdui-card-actions {
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 8px;
  line-height: 1;
}
/* 修复主题自带 a 标签下划线和基线对齐导致按钮视觉偏差 */
.friend-card .mdui-card-actions .mdui-btn::before {
  display: none !important;
}
.friend-card .mdui-card-actions .mdui-btn {
  margin: 0;
  vertical-align: middle !important;
  border-radius: 4px;
  font-weight: 500;
  letter-spacing: .0892857143em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, .87) !important;
}
.mdui-theme-layout-dark .friend-card .mdui-card-actions .mdui-btn {
  color: rgba(255, 255, 255, .88) !important;
}

@media (max-width: 600px) {
  .friends-container {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  .friend-card .mdui-card-media {
  aspect-ratio: 16 / 9;
  }

}
</style>

<div class="friends-container">
  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://blog.canyie.top/data/image/avatar_new.jpg" alt="残页的小博客" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">残页的小博客</div>
            <div class="mdui-card-primary-subtitle">#Android天才 巨佬</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://blog.canyie.top/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>
  
  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="/friends/listder.jpg" alt="listder's blog" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">listder's blog</div>
            <div class="mdui-card-primary-subtitle">I'm lolicon!</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://blog.listder.xyz/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>

  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://bu.dusays.com/2024/10/25/671b2438203a6.gif" alt="Elykia" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">Elykia</div>
            <div class="mdui-card-primary-subtitle">致以无暇之人</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://blog.elykia.cn/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>

  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://s3.ax1x.com/2021/01/31/yEfCCR.png" alt="西行妖" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">西行妖</div>
            <div class="mdui-card-primary-subtitle">人生五十年，如梦亦如幻</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://my.toho.red" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>

  <!-- <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://cdn.lar.moe/static/avatar/me.webp" alt="花と詩" style="object-fit: cover;" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">花と詩</div>
            <div class="mdui-card-primary-subtitle">Hana to Uta</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://lar.moe/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div> -->
  <!-- Address Unreachable at 2025-09-20! Please Contact with us. -->

  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="/friends/piowonsler.jpg" alt="TuskedEvening0" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">TuskedEvening0</div>
            <div class="mdui-card-primary-subtitle">Not too freedom nor too correct.</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://tuskede0.top/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>

  <!-- <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://zhmoegirl.com/favicon.ico" alt="InternetBugs的个人小站" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">InternetBugs的个人小站</div>
            <div class="mdui-card-primary-subtitle">一个什么都没有的小博客</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://zhmoegirl.com/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div> -->

  <!-- <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://sin.moe/api/v2/objects/avatar/kf9ppqa68kkdxf4rnr.jpeg" alt="🍋小T" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">🍋小T</div>
            <div class="mdui-card-primary-subtitle">あなたと居たいままで</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://sin.moe/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div> -->

  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://cos.zyglq.cn/static/web-logo.jpg" alt="资源管理器博客" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">资源管理器博客</div>
            <div class="mdui-card-primary-subtitle">心中有光，对立重伤</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://www.zyglq.cn/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>

  <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="https://lfs.libmbr.com/assets/pics/LG4v5Savatar180px.webp" alt="MBRjun-Blog" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">MBRjun-Blog</div>
            <div class="mdui-card-primary-subtitle">我们生活在大地上，但我们的梦想超越天空</div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="https://www.libmbr.com/" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div>

</div>
  <!-- 可以继续添加更多友链卡片 -->
  <!-- SAMPLE --

  <!-- <div class="mdui-card friend-card mdui-hoverable">
    <div class="mdui-card-media">
        <img src="<link:图片链接>" alt="<name:博客名称>" loading="lazy">
        <div class="mdui-card-media-covered">
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title"><name:博客名称></div>
            <div class="mdui-card-primary-subtitle"><description:不超过15字的简介></div>
          </div>
        </div>
    </div>
    <div class="mdui-card-actions">
      <a href="<link:站点链接>" target="_blank" class="mdui-btn mdui-ripple mdui-text-color-theme-accent">访问网站</a>
    </div>
  </div> --> 


### 如何找我玩
各位大佬想交换友链的话可以在 [issue 区](https://github.com/SteveZMTstudios/articles/issues/new/choose) 留言～
本站信息：
```
标题：`老史尬侃`
简介：`这家伙叽里咕噜说什么呢`
头像：`https://blog.stevezmt.top/images/avatar.jpg`
地址：`https://blog.stevezmt.top/`
```

友链提交格式：
```
"网站名称：" <name:string>
"网站地址：" <link:urlstr>
[ "网站图标:" <link:urlstr>:(留空我将优先选择您页面的头像，若无我将选择您的网页图标或Github头像) ]
[ "一句话简介：" <description:string>:(留空我将自行提取) ]
[ "背景颜色：" <color:hex>:#fff ]
[ "其他页面脚本："
    <text:html>   // 您可定义希望的样式，参见/friends/index.md
]
```


