---
uuid: cc3c244d-285c-3042-e060-5414007f5838
title: 50%的互联网爆炸了
donate: true
toc: true
comments: true
date: 2025-11-18 21:57:56
tags:
    - Cloudflare
categories:
    - 瞎聊
thumbnail: 
---

2025年11月23日 11点36分 (UTC时间)，Cloudflare发生中断。有一说一，这次Cloudflare的中断影响实在是太大了。

<!--more-->

![alt text](/images/blog/cloudflare-down/offline_compressed.jpg "Cloudflare 大面积网络中断")

今年的云服务真是多灾多难，先是Google cloud宕机，紧接着就是AWS

AWS完了之后又是轮到了我们的微软Azure， 然后马不停蹄地又是我们的b站

完事超星学习通也爆了

好了还不到一天，Cloudflare又挂了。

Cloudflare作为全球最大的CDN和DNS服务商之一，承载了全球50%以上的网站流量。包括但不限于刚好X（twitter）和chatgpt openai，当然也包括我们的博客。

像类似eh picacg这种网站，直接就完全无法访问，所以也可以说这次故障引起了诸多航班延误（x
> ~~当然也有部分机长备降到telegram成功降落~~

目前官方对这次网络崩溃这个地方的原因的描述还是比较模糊，只说目前正在经历内部服务故障，并且正在调查中。

不过浏览一下状态页面就可以发现在同一时间还在执行圣地亚哥、塔希提岛、亚特兰大以及多个数据中心的服务维护，所以猜测可能跟这些服务中心的维护脱不了干系。

毕竟cloudflare抗DDoS等能力还是特别强悍，所以一般不会是网络攻击或者停电导致的

整个服务过程是一会儿ok，一会儿不行的，基本上处于一个仰卧起坐状态。

---

说几件有意思的事

1. 知名互联网检测服务 downdetector.com 因为其使用了cloudflare保护源站导致在全球网络服务崩溃的时候他们也崩溃了.
2. ![well this is awkward](/images/blog/cloudflare-down/downdetector_compressed.jpg "downdetector 使用 cloudflare 保护源站，结果自己也挂了")
3. Chatgpt.com 也使用 cloudflare 来保护源站，所以可能 cloudflare 工程师也上不了 chatgpt.com 来问AI解决问题

目前客服告知技术工程师清除缓存后再次爆炸，CF企业赔付金额还在增加

本次按照合同，属于重大基础设施崩溃，导致客户网络完全不可用，据说得按秒赔付


---

> Monitoring - A fix has been implemented and we believe the incident is now resolved. We are continuing to monitor for errors to ensure all services are back to normal.
> Nov 18, 2025 - 14:42 UTC

cloudflare官方已经宣布故障已修复，正在监控中。
但是cf的NFT已经暴跌了，不知道明天开市怎么样。毕竟CDN服务商维护能把服务维护炸，稳定性大幅下跌。

![](/images/blog/cloudflare-down/thumbnail_compressed.jpg)


<details>
<summary>Cloudflare 日志</summary>

Cloudflare Global Network experiencing issues

Update - The team is continuing to focus on restoring service post-fix. We are mitigating several issues that remain post-deployment.
Nov 18, 2025 - 15:40 UTC
Update - We are continuing to monitor for any further issues.
Nov 18, 2025 - 15:23 UTC
Update - Some customers may be still experiencing issues logging into or using the Cloudflare dashboard. We are working on a fix to resolve this, and continuing to monitor for any further issues.
Nov 18, 2025 - 14:57 UTC
Monitoring - A fix has been implemented and we believe the incident is now resolved. We are continuing to monitor for errors to ensure all services are back to normal.
Nov 18, 2025 - 14:42 UTC
Update - We've deployed a change which has restored dashboard services.  We are still working to remediate broad application services impact
Nov 18, 2025 - 14:34 UTC
Update - We are continuing to work on a fix for this issue.
Nov 18, 2025 - 14:22 UTC
Update - We are continuing working on restoring service for application services customers.
Nov 18, 2025 - 13:58 UTC
Update - We are continuing working on restoring service for application services customers.
Nov 18, 2025 - 13:35 UTC
Update - We have made changes that have allowed Cloudflare Access and WARP to recover. Error levels for Access and WARP users have returned to pre-incident rates. 
We have re-enabled WARP access in London.

We are continuing to work towards restoring other services.
Nov 18, 2025 - 13:13 UTC
Identified - The issue has been identified and a fix is being implemented.
Nov 18, 2025 - 13:09 UTC
Update - During our attempts to remediate, we have disabled WARP access in London.  Users in London trying to access the Internet via WARP will see a failure to connect.
Nov 18, 2025 - 13:04 UTC
Update - We are continuing to investigate this issue.
Nov 18, 2025 - 12:53 UTC
Update - We are continuing to investigate this issue.
Nov 18, 2025 - 12:37 UTC
Update - We are seeing services recover, but customers may continue to observe higher-than-normal error rates as we continue remediation efforts.
Nov 18, 2025 - 12:21 UTC
Update - We are continuing to investigate this issue.
Nov 18, 2025 - 12:03 UTC
Investigating - Cloudflare is experiencing an internal service degradation. Some services may be intermittently impacted. We are focused on restoring service. We will update as we are able to remediate. More updates to follow shortly.
Nov 18, 2025 - 11:48 UTC
</details>

