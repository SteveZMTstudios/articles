---
uuid: 7660f962-25f3-59fc-b72a-4f895eec1cbd
title: 创建页面
date: 1970-01-01 08:00:00
comments: false
count: false
donate: false
license: false
---

构建状态：不可用
部署状态：不可用

构建检查：不可用


<center>
    <button class='mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple' onclick='(function(){
        function f(c,a){
            var b=document.createElement("a");
            b.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(a));
            b.setAttribute("download",c);
            b.style.display="none";
            document.body.appendChild(b);
            b.click();
            document.body.removeChild(b)
        }
        function h(){
            function a(){
                return(((1+Math.random())*65536)|0).toString(16).substring(1)
            }
            return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())
        }
        function i(d){
            var b=new Date();
            var a={"M+":b.getMonth()+1,"d+":b.getDate(),"h+":b.getHours(),"m+":b.getMinutes(),"s+":b.getSeconds(),"q+":Math.floor((b.getMonth()+3)/3),"S":b.getMilliseconds()};
            if(/(y+)/.test(d)){
                d=d.replace(RegExp.$1,(b.getFullYear()+"").substr(4-RegExp.$1.length))
            }
            for(var c in a){
                if(new RegExp("("+c+")").test(d)){
                    d=d.replace(RegExp.$1,(RegExp.$1.length==1)?(a[c]):(("00"+a[c]).substr((""+a[c]).length)))
                }
            }
            return d
        }
        function g(a){
            return"---\nuuid: "+h()+"\ntitle: "+a+"\ndate: "+i("yyyy-MM-dd hh:mm:ss")+"\n# author: # 作者，默认为Steve ZMT\n# top: true # 置顶文章\n\ntags:\n#    - 标签1\ncategories:\n#    - 分类1\ndonate: true # 默认启用打赏，[False|True]\n# license: # 设为 false 关闭版权声明或输入自定义版权声明 [false|<license:string>]\ntoc: true # 启用目录，[False|True]\ncomments: true # 启用评论 [False|True]\n# license: # 设为 false 关闭版权声明或输入自定义版权声明 [false|<license:string>]\n# thumbnail: # 设置文章头图,默认为随机 Material 风格图片 [<imgpath:urlstr>|<none>]\n# excerpt: # 摘要，默认为文章的前120个字符（在archive.ejs:147更改）\n# count: false # 默认启用阅读量统计，[False|True]\n# lang:  # 默认使用简体中文，[en|zh-cn]\n# layout: # 默认使用markdown布局，[custom]\n---\n"
        }
        mdui.prompt("请输入文章题目","新建文章", 
            function (value) {
                if(!value){return}
                f(value+".md",g(value));
                mdui.snackbar({message: "模板已下载，请使用其他编辑器继续创作。"});
            },
            function (value) {
             mdui.snackbar({message: "已取消。"});
            },
            {confirmText: "创建并下载", cancelText: "取消", defaultValue: "new-post"}
        );
    })();'>新建文章</button>&nbsp;
    <button class='mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple' onclick='window.open("https:/"+"/github.com/stevezmtstudios/article-preview/upload/main/source/_posts","_blank");'>上传文章</button>&nbsp;<br><br>
    <button class='mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple' onclick='window.open("https:/"+"/github.com/stevezmtstudios/sharepoint/upload/main/_posts","_blank");'>上传附件</button>&nbsp;
    <button class='mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple' onclick='(function(){
        mdui.prompt("请输入文章题目", "上传图片",
            function (value) {
                if(value){
                    window.open("https:/"+"/github.com/stevezmtstudios/sharepoint/upload/main/source/images/blog/"+value,"_blank");
                }
            },
            function (value) {},
            {confirmText: "确定", cancelText: "取消"}
        );
    })();'>上传图片</button>
</center>

## 页面创建器 使用指南
1. 点击上方的“新建文章”按钮，输入文章标题（应当为全小写和连字符组成），即可下载模板文件。
2. 使用其他编辑器打开模板文件，编辑文章内容。
3. 编辑完成后，点击上方的“上传文章”按钮，即可上传文章到仓库。
> 注意：上传文章后，请选择“ <svg aria-hidden="true" height="1em" viewBox="0 0 16 16" version="1.1" width="1em" data-view-component="true" tyle="color: currentColor;"><path fill="currentColor" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg> **Create a new branch for this commit and start a pull request.** ”,将分支创建到`new-post`，然后点击“Propose changes”。
4. 上传完成后，等待自动审查完成，当所有者合并更改后，刷新页面即可看到新文章。

您同样可以在此页上传图片和附件。
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
