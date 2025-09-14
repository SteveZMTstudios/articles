---
uuid: a7a96631-691e-1bc4-9149-f53ab32c7da5
title: 玩飞一台翻译词典笔（非root方案）
toc: true
comments: true
date: 2023-10-01 16:52:00
tags: 
    - root
    - 安卓
    - 单词笔
categories:
    - 折腾
    - 电子垃圾
thumbnail: /images/blog/play-on-scanpen/thumb_compressed.jpg
---

> 此页面最初由我自己发布在[酷安](https://www.coolapk.com/feed/49767646?shareKey=YWNkMzBmNTU4NmY3NjU1ODhiY2Y~&shareUid=22536770&shareFrom=com.coolapk.market_13.3.6)

#你永远不知道酷友在用什么刷酷安#
#翻译笔# 基于adb（可有也可无）和mtklogger的方案，仅限第三方杂牌单词笔，对于有道等使用开源Linux编译的内核的单词笔无效（，请自行github penmod）

目标：不损坏单词笔的同时，实现听音乐、看b站、访问网页、玩基本单机游戏、并且系统能稳定正常使用等需求。

所需硬件：单词笔本体（，一台安卓手机、传输数据线、OTG接口）

手机的软件需要我会在合适的时候填写在文章里面。

## 0：解开这个设备！
有已知的这几个方式：
1.打开设置，狂戳版本号8次，可以打开工厂调试，工厂调试里面的快捷菜单，打开mtk logger，在低于安卓7以下的版本中，mtk logger可以手动输入命令，如service call statusbar 1（这一条可以把状态栏拉下来，安卓状态栏控制中心里面都会有设置项。）
2.打开设置,戳sn码3次后点一下版本号末端，跳出来一个要输密码的窗口，输入jxwkj888,进入设置。
（此方案普遍适用于嘉鑫微方案软件，如果关于本机中包含JXW条目，那么尽管不是单词笔，你也可以尝试。）

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/1_compressed.jpg)

键盘是可以滑动的

3.设备蓝牙连接手机，使用Bluetooth keyboard，新建一个虚拟组合键，按下win+N（Command+N）
4.查看评论区给出的建议。如果您知道更多关于如何绕过前台桌面和强制悬浮窗的方法的话，请发送评论。

## 1.打开adb调试并开始传输基本应用程序。
在设置-关于本机中，点按多次“版本号”即可打开开发者选项。
从酷安下载“甲壳虫ADB助手” [【甲壳虫ADB助手】](https://www.coolapk.com/apk/com.didjdk.adbhelper) 来更方便的联机调试。如果你不喜欢闭源软件以及付费服务的话，你也可以选择开源的ADB KIT.

### 无需外部adb调试的方法（仅限安卓5）：
打开设置（安卓设置,不是学王设置）
选择安全，点开数据保护

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/2_compressed.jpg)

点开要绘制手势，放心这不会变砖

设置一个记得住的手势
之后右上角有加号
点开，选择sd卡
接下来就是找自己的软件包安装，不用我教了吧受虐滑稽

使用任何你喜欢的方式将Gesture、文件管理器+和Lawnchair安装到设备上
[Gesture 由 嘟嘟斯基 开发] 查看链接
[蓝奏云备用链] 查看链接
[RE 管理器] 查看链接
（它不会请求sd卡授权，换了一个）
[文件管理器+] 查看链接
[原帖地址] 查看链接
[Lawnchair Github项目] 查看链接
[Lawnchair 蓝奏云] 查看链接
密码:2fn5
蓝奏云如果无法下载请将UA切换成电脑版
（现在应该可以下了，花9块钱开了会员）

上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。

### 关于sd卡授权读写的问题：
如果你的设备没有基础的“下载管理程序”或”documentsui“，那么它们就是不能被授权，你只能adb移动文件。

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/3_compressed.jpg)

就是那个“下载”

将gesture安装到设备之后，先打开gesture的设置页面，授予它无障碍权限，然后先启用底部三栏的手势，确保能够正常使用，需要先预先设置好返回键以及拉出状态栏，还有多任务。

如果你的设备屏幕过小，gesture可能有一些选项无法显示。显示的方法：首先把gesture打开在后台，然后启动一个强行横屏的应用程序（如新版via 【Via】 ，在利用多任务切换到gesture。如果这一步没有成功的话，检查屏幕自动旋转是否是打开状态。你现在就可以使用gesture里面的简易手势。
我们建议你始终预留一个手势直接打开lawnchair。

## 2.设置系统桌面
首先在默认应用程序里面看看能不能直接把lawnchair设置为系统桌面.如果adb也不能的话,在gesture里面把你想要返回到桌面的手势改成打开程序-Lawnchair，虽然跟真正意义上的桌面不一样，但是也算是曲线救国。

或者安装冰箱之后，使用mtklogger里面的run command授权（没错，mtklogger的run command运行权限就是shell，uid2000），冻结com.android.provision组件后便可将lawnchair设为默认桌面（冰箱可能弹出警告，只需要确保学王扫学和/或lawnchair未被冻结即可），记住桌面锁定方式设置为“无”，而不是“滑动”，更不是任何密码锁定！

如果您将您自己的词典笔设置了安卓原生的密码锁定的话，我们将不会（也不能）为它提供支持！！！
设置密码务必三思！！！！
上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。
（如果您需要原生锁屏，那么你需要在每次开机的时候为任何程序授权设备管理员权限一次，这样默认桌面和锁屏才会生效）

(这一步完成发现系统自带音乐)

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/4_compressed.jpg)
为当时拍照的手机默哀

（关于com.android.provision的问题，这个程序本来是用来广播系统组件更新完成的，但是jxw将其做成了锁定学王作为桌面的程序，因此若不冻结，那么设置里面将无法切换默认桌面）
## 3.安装冰箱。
[酷安官方] [冰箱 IceBox：自动冻结・省电神器](http://www.coolapk.com/apk/com.catchingnow.icebox)
[旧版本] 查看链接
密码：dddd（懂的都懂）
注意冰箱在设置冻结列表的时候，不要冻结lawnchair和gesture，并且在gesture没有设置快捷启动launcher之前，不要冻结系统原先的第一启动程序（如单词笔主程序），否则可能有变砖风险。

上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/5_compressed.jpg)
妹想到吧

就像上文，冰箱的管理员授权指令直接输在mtklogger里面就可以，mtklogger可以从工厂测试里面打开。

## 4.自由发挥
以下的链接提供了一些，我已经在我的笔上面试过运行良好且很实用的小程序组件,包含QQ b站等一些基本程序。
如果你想下载其他程序的话，不妨在网上试着加上这些名词：tv版 手表版 车机版上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。 定制版 lite

## 5.注意
你需要时刻关注单词笔的内存使用量,因为内存使用量跟设备内存性能以及发热程度有关。
***不建议***在这一台单词笔上安装任何小而美的程序，以及专为手机打造的应用程序，否则导致的卡慢我们概不负责。

[附录]
[只能看不能摸的酷安] 查看链接
[上面提到的所有软件] 查看链接
（请在评论区里面选择“只看楼主”，ta可能发布了一些新的软件没更新）
[亿些铃声，全部提取系统] 查看链接
『如果需要iOS铃声与我联系』

上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。

## 一个彩蛋：
如果你需要system进程权限，即uid1000，那么可以通过安装activity launcher或“创建快捷方式”程序，通过它们打开common data service，反正就是蓝色机器人歪嘴那个，点开第一个activity，选择“network utility”，在第一个里面输入执行的shell脚本路径（sh文件）就行。

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/6_compressed.jpg)

喏

告知：
除非你的设备是安卓4，否则它们一定有bootloader锁，你需要飞三根线来作为音量键，然后正常adb重启到bootloader，使用fastboot oem unlock然后短接音量上键，看到电脑上显示OKAY就可以解锁成功了。下一次重启时会清除内部存储所有数据。


众所周知，brom起码得按住音量键

如果你的设备和我的公版很像，请试试这个：
1和4 音量-
2和4 音量+

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/play-on-scanpen/7_compressed.jpg)

敬告：除非你有充分的飞线经验和洞洞板焊接操作经验，否则请寻求专业人员帮助，我可不希望看到第二个怨种把焊点整个摘下来。

[链接](https://mobile.yangkeduo.com/duo_coupon_landing.html?goods_id=440355635847&pid=13436888_221973215&goods_sign=E9b2xO1zPBNLXBNhwfDchu9rOlfmjN_89g_J7rMXyru4)好记星T5英语点读笔万能扫描翻译笔电子词...

（我了个豆，涨价了，刚开始69来着