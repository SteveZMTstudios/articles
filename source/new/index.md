---
uuid: 7660f962-25f3-59fc-b72a-4f895eec1cbd
title: 创建页面
comments: false
count: false
donate: false
license: false
---

构建状态：不可用
部署状态：不可用

构建检查：不可用

<div style="align: center;">
<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-r-2" onclick="window.location.href='/new/editor'">
  新建文章
</button>
</div>

## 页面创建器 使用指南
1. 点击上方的“新建文章”按钮，进入文章编辑器。
2. 在编辑器中撰写您的文章，支持Markdown语法和图片拖拽上传。
3. 撰写完成后，下载文章文件，并推送到仓库中。
> 注意：上传文章后，请选择“ <svg aria-hidden="true" height="1em" viewBox="0 0 16 16" version="1.1" width="1em" data-view-component="true" tyle="color: currentColor;"><path fill="currentColor" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg> **Create a new branch for this commit and start a pull request.** ”,将分支创建到`new-post`，然后点击“Propose changes”。
4. 上传完成后，等待自动审查完成，当所有者合并更改后，刷新页面即可看到新文章。

- 上传图片时，请确认您输入的名字就是post的文件名，以确保格式统一。
    - 例如，如果您的文章标题是`new-post`，那么您上传的图片应当命名为`new-post.jpg`。
    - 上传完成后，您可以在文章中使用`![图片描述](/images/blog/new-post/<您定义的名称>.jpg)`来引用图片。
    - 请确保您上传的图片小于10MB，否则将无法上传。
    - 请勿上传不当内容，否则将被删除；发现涉及未成年滥用、违法犯罪或被我们和 Github 管理人员认为不合适的图像将会被举报，并且提交您的个人信息和图片给您所在地的司法和执法机构。

- 上传附件时，请确认您输入的名字就是post的文件名，以确保格式统一。
    - 例如，如果您的文章标题是`new-post`，那么您上传的附件应当命名为`new-post.zip`。
    - 上传完成后，您可以在文章中使用`[附件描述](https://sharepoint.cf.stevezmt.top/_blog/new-post/<您定义的名称>.zip)`来引用附件。
    - 请确保您上传的附件小于100MB，否则将无法上传。
    - 请勿上传不当内容，否则将被删除；发现涉及未成年滥用、违法犯罪或被我们和 Github 管理人员认为不合适的内容将会被举报，并且提交您的个人信息、资料和相应文件给您所在地的司法和执法机构。


## 模板说明
```markdown
---
uuid: 07f571fb-be00-4ef1-97a7-e2d92e269c5b # 请勿修改
title: NewPost # 文章标题
date: 2024-12-01 00:35:28 # 发布日期
tags:
#    - 标签1
#    - 标签2
categories: 
#    - 分类1
donate: true # 默认启用打赏，[False|True]
# license: # 设为 'false' 关闭版权声明或输入自定义版权声明 [false|<license:string>]
toc: true # 启用目录，[False|True]
comments: true # 启用评论 [False|True]
# license: # 设为 'false' 关闭版权声明或输入自定义版权声明 [false|<license:string>]
# thumbnail: # 设置文章头图,默认为随机 Material 风格图片 [<imgpath:urlstr>|<none>]
excerpt: # 摘要，默认为文章的前120个字符（在archive.ejs:147更改）
# count: false # 默认启用阅读量统计，[False|True]
# lang:  # 默认使用简体中文，[en|zh-cn]
# layout: # 默认使用markdown布局，[custom]
---

文章内容（使用markdown语法）
```
