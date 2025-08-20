---
uuid: 34f320bc-0216-6e14-a2e8-d73275a25534
title: 近期关于海外站点https无法访问的情况
date: 2025-08-20 19:14:44
# author: # 作者，默认为Steve ZMT
# top: true # 置顶文章

tags:
#    - 标签1
    - 故障
categories:
    - 瞎聊
donate: true # 默认启用打赏，[False|True]
# license: # 设为 false 关闭版权声明或输入自定义版权声明 [false|<license:string>]
toc: true # 启用目录，[False|True]
comments: true # 启用评论 [False|True]
# license: # 设为 false 关闭版权声明或输入自定义版权声明 [false|<license:string>]
thumbnail: https://mirror.blog.stevezmt.top/images/blog/https-port-443-blocked/thunbnail_compressed.jpg
# excerpt: # 摘要，默认为文章的前120个字符（在archive.ejs:147更改）
# count: false # 默认启用阅读量统计，[False|True]
# lang:  # 默认使用简体中文，[en|zh-cn]
# layout: # 默认使用markdown布局，[custom]
---

大约在2025年8月20日，所有用户反馈无法访问海外站点，经过排查发现是由于https端口被阻塞所致。

<!-- more -->

这次阻塞经过排查发现所有连接到海外站点的IPv4地址到443端口均无法访问，包括微软Microsoft、苹果Apple、Cloudflare等在国内有备案或本来应该能访问的海外企业站点均被阻断。  
目前没有通报发现有金融，商业等关键服务因为这将近一个小时的阻断受到干扰。  
所有的阻断均为TCP RST包阻断，常规GFW防火墙套路。  

有海外网友表示连接到国内的流量也发生了异常。  

阻断发生的确切时间尚不可知，不过网络故障检测系统downdetector 在 UTC+8 12:15 AM时就回报开始出现连接失败的问题。  
本站大约在1:50 AM后恢复正常连接。  

![downdetector的截图](https://mirror.blog.stevezmt.top/images/blog/https-port-443-blocked/1_compressed.jpg)  

毫不意外的，本站的ipv4流量也理所当然的沦陷了（itdog在部分地区有v6连接，故通）  

![itdog全红截图](https://mirror.blog.stevezmt.top/images/blog/https-port-443-blocked/2_compressed.jpg)  

关于流传的阴谋论说法，个人以为不大可能。所谓“拔线测试”不会只针对HTTPS连接，更不会放过已经比较普及的IPv6，个人猜测只是因为规则错误配置或者新找了个临时工乱搞导致的。  
尚未看到有官方通报这一情况，虽然要说也算是P0级别的故障，但因为发生在深夜，倒也没有造成很大的影响，不过相关微博和b站视频在发布此类内容后均已被下架（稿件失效）。~~不让提吗？~~  

> HSTS 受害者（bushi
> ~~被服务警报吵醒什么的~~

最惨的也不过是在半夜重装系统的网友。。。
![聊天记录](https://mirror.blog.stevezmt.top/images/blog/https-port-443-blocked/3_compressed.jpg)

如果该文章侵犯了任何人的权益或者需要移除，请通过电子邮件联络：[me@stevezmt.top](mailto:me@stevezmt.top)，我将尽快处理。






