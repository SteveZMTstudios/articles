---
uuid: 41980377-68a2-7104-1fa2-43d53ebb52df
title: 如何在学校安全的玩翻译笔

comments: true
date: 2024-03-22 10:00:00

tags: 
    - root
    - xposed
    - 安卓
    - 单词笔
categories:
    - 折腾
    - 电子垃圾
thumbnail: /images/blog/hide-your-scanpen/thumb_compressed.jpg
---

> 此页面最初由我自己发布在[酷安](https://www.coolapk.com/feed/54539836?shareKey=N2I4OGMyMGYyNDQ1Njc0OWQ1MWY~&shareUid=22536770&shareFrom=com.coolapk.market_14.5.3)

#翻译笔#
首先，你就不该在学校使用单词笔来玩。
你看，咱们在学校的时间其实挺宝贵的，每一分钟都应该用来充实自己，对吧？电子设备，像单词笔啊，手机啊，这些东西它们确实方便，能帮我们查东西，学习。但是，咱们得把握好这个度。

上课时候，最好还是别用这些设备了。老师讲的东西，书本上的知识，那都是基础，得认真听，认真记。你想啊，课堂上那点时间，一晃就过去了，错过了就是错过了，课后再补，那效果肯定不如当场学会的好。

再说，咱们用这些电子设备，很容易就跑偏了，一不小心就开始刷酷安，玩游戏，那学习效率就下来了。咱们都知道，学习是自己的事儿，现在不努力，将来后悔都来不及。

所以啊，我建议咱们还是多花点时间在书本上，多动动脑筋，多思考。遇到不懂的问题，多问问老师，多和同学讨论。这样学习才能扎实，才能进步。

总之，咱们一起努力，把握好在学校的每一天，好好学习，天天向上。将来咱们都能实现自己的梦想，那多好啊！咱们一起加油吧！

完。

.

..

...

..

.

好了，老师们，走了没（小声）

应该都走光了吧
那我们继续

注意:一切的基础上必须是你的学校对单词笔等这类学习用智能设备的态度模棱两可的前提下！

咳咳，首先如果要避免被抓包，我们需要:
1. 增加伪装性，这点只要你带的不是手机就行。
2. 提升反应能力，你需要能敏锐地发现教导主任来的意图，并且有足够的手速。
3. 沉着应对，当被叫住时，死咬住这只是一台单词笔的理论，基本上能抗过去。
4. 时刻谨慎，在学校没有人值得信任，张扬是祸患的根源。
5. 你必须root你的单词笔并植入xposed框架，如有必要，更广系统。
6. 你的单词笔最好能设置密码解锁。

其次，单词笔一定要像一台单词笔。在之前的魔改里面都把lawnchair切出来了，这点给老师看到将很要命。因此你的系统要么能打开学王扫学，要么有个全封闭的假桌面。

如果以下条件都能满足，那么我们就讲讲如何在应对抽查时快速地应对。
在这之前，你要做好充足的准备工作:快速地将单词笔切回原桌面（下同“假桌面”）

1.配置好xposed框架，xposed edge pro
明确两点，尽量不用这里面的手势控制，手势控制我是用来解除伪装的

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/1_compressed.jpg)
手势控制能不用就不用

2.打开 保存的多重动作 ，这玩意就像个函数，可以方便调用，这是我配置的伪装动作:

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/2_compressed.jpg)
当然你可以自由发挥

关于那条shell命令，我是这么写的

```shell
task_id=$(dumpsys activity | grep DemoLauncher | grep -A2 '#'| cut -d ' '; -f 7 | cut -c 2- | head -n 1); am task lock $task_id
```

把demolauncher换成你的单词笔桌面包名，下同。并以root权限执行。
命令解释:将假桌面屏幕固定，这可以强行在屏幕锁上面弹出，同时不关闭屏幕固定无法退出。

大框架完成，开始组装手和腿
打开手势控制，选择一个自己没改过的按键配置(如音量双击)，这么写可以增加点击次数触发，防止误触

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/3_compressed.jpg)
从左到右依次是双击-多重动作-里面写上这些-如果-那么多重动作

```shell
am task lock stop
```

命令解释:解除屏幕固定

至此触发机制就完成了，保险起见，可以加一个被动
应用状态触发-假桌面-位于焦点-多重动作-照图

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/4_compressed.jpg)
多重动作，执行前面可以加个判断

shell命令如下

```shell
task_id=$(dumpsys activity | grep -A2 "(dumpsys activity recents)"| grep '#'| cut -d ' '; -f 7| cut -c 2-); am task lock $task_id
```

这条命令以root权限执行，用来确保屏幕固定工作。

```shell
cmd package set-home-activity <intent>
```

把上面的intent换成你的假桌面的启动activity名字。

至此触发完成。

接下来是保持，确保可以在老师重启后活下来

更多触发器-启动完成-如果 照图

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/5_compressed.jpg)
"伪装"提换成你的多重动作,感叹号是 非

至此保持完成，即使重启也不会停止假桌面固定

接下来是解除

更多触发器-充电器插入-如果判断，照图

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/6_compressed.jpg)
变量和你自己的匹配，注意移除充电器的操作

然后打开手势，自己设计一套复杂的手势，然后多重动作 照图

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/hide-your-scanpen/7_compressed.jpg)
至此解除完成。
至此假桌面伪装完成。

ps:如果你用的是校园网络，那么建议你使用DoH加密DNS解析流量，安卓9以上系统自带DoT，安卓8以下可以用intra.

pps: 上面那一大坨根本不是我真心话，我是看我班主任酷安关注我我才找ai瞎编的
