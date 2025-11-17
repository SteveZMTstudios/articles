---
uuid: a12c1656-7dfa-ed30-d704-82386baf9639
title: 主题复刻指南
donate: true
toc: true
comments: true
date: 2024-12-21 17:54:54
tags:
    - 开源
    - hexo
    - 博客
categories:
    - 折腾
---

这里提供了一种方式，可以让你快速复刻这个主题，这样你就能够把它做成你的博客了。

<!--more-->

## 1. 准备工作

建议你先看看[复刻模板效果](https://blog-preview.stevezmt.top)，看看是否符合你的需求和喜好。

首先，你要有一个[Github账户](https://cloud.tencent.com/developer/article/1487508)，并且电脑已经配置了[Git环境](https://git-scm.com/)和[npm包管理器](https://nodejs.org/en/download/)。

### Git环境配置
1、访问git官方地址，下载对应的安装包，进行安装（简单的点击下一步）。

2、安装好之后，鼠标右键可以看到：Git Bash Here，点击后打开了。

3、输入：git --version

4、如果出现版本号，说明安装成功。

### npm包管理器配置
1、访问nodejs官方地址，下载对应的安装包，进行安装（简单的点击下一步）。

2、安装好之后，配置环境变量，并在终端里面输入：node -v 和 npm -v

3、如果出现版本号，说明安装成功。

### Github账户
1、访问Github官网，注册一个账户。

2、创建一个仓库，名字格式为：`<你的用户名>.github.io`。
比如我的github账户叫史蒂夫ZMT工作室，首页地址是`github.com/stevezmtstudios`，那么我创建的仓库名字就是`stevezmtstudios.github.io`。

#### SSH配置

## 2. 复刻主题

先介绍一下hexo的基本操作：
```bash
hexo new "postName" #新建文章
hexo new page "pageName" #新建页面
hexo generate #生成静态页面至public目录
hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
hexo deploy #部署到GitHub
hexo help  # 查看帮助
hexo version  #查看Hexo的版本
```

对应的缩写，比如：
hexo n == hexo new
hexo g == hexo generate


1. 打开终端，输入：`git clone https://github.com/SteveZMTstudios/article-preview.git`，将我的博客框架下载到本地。
2. 把source文件夹里面除CNAME文件以外的的内容全部一并删掉。
   当然如果你选择不删也可以，只是要在页面内注明： 
   ```markdown
   本页面继承自[SteveZMTstudios](https://blog.stevezmt.com)的博客页面。
   基于CC BY-NC-SA 4.0协议转载。
   ```
3. 修改CNAME文件中的链接到你的域名，或者删掉这个文件，用`<你的用户名>.github.io`作为主页。
4. 把你的仓库克隆到本地，输入：`git clone <你的仓库地址>`。
5. 把article-preview文件夹里面的内容全部复制到你的仓库里面。
6. 检查_config.yml和_config.default.yml文件，修改里面的内容，比如网站名字、作者、头像等。
7. 打开终端，输入：`npm install && npm install -S hexo-helper-qrcode hexo-generator-search`，安装依赖。
8. 输入：`hexo clean`，清除缓存。
9. 输入：`hexo g`，生成静态文件，检查是否有报错。如果有的话，根据报错信息进行修改，或者[提issue](https://github.com/SteveZMTstudios/article-preview/issues)让我知道咋回事。
10. 输入：`hexo s`，启动本地服务，访问查看效果。
    > 你也可以输入`npm run look`,直接完成部署和预览。
    访问http://[localhost:4000](http://localhost:4000)查看效果。

## 3. 部署到Github
1. 上载仓库文件，输入：`git add .`，添加所有文件，输入：`git commit && git push`，提交文件。
2. 打开终端，输入：`hexo d`，部署到Github。
<!-- 3. 访问`<你的用户名>.github.io`，查看效果。一般需要一会,但是如果你的页面一直提示`There isn't a GitHub Pages site here`,那么你需要检查一下你的仓库设置，确保你的仓库名字是`<你的用户名>.github.io`，以及是否在仓库的`Settings`里面开启了`GitHub Pages`，deploy分支是否设为了gh-pages。 -->
3. 使用vercel或者netlify等服务部署你的博客。
4. 勤用搜索，遇到问题先自己解决，解决不了再[提issue](https://github.com/SteveZMTstudios/article-preview/issues)。

## 鸣谢和引用
- [niemingzhao](https://github.com/niemingzhao)以及他的博客框架。
- [李运辰](https://zhuanlan.zhihu.com/p/392994381)的知乎专栏。
- [hexo](https://hexo.io/zh-cn/)的官方文档。



