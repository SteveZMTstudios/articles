---
uuid: c31453b5-5ddc-5c17-0fde-aa938c3a99f3
title: 玩飞一台翻译词典笔（进阶-获取root）
toc: true
comments: true
date: 2024-02-01 14:55:00
tags: 
    - root
    - 安卓
    - 单词笔
categories:
    - 折腾
    - 电子垃圾
    - 
thumbnail: /images/blog/root-on-scanpen/thumb_compressed.jpg
---

> 此页面最初由我自己发布在[酷安](https://www.coolapk.com/feed/49767646?shareKey=YWNkMzBmNTU4NmY3NjU1ODhiY2Y~&shareUid=22536770&shareFrom=com.coolapk.market_13.3.6)

#你永远不知道酷友在用什么刷酷安#
#翻译笔# #Root# 基于adb、wwr、mtkclient、SP flash tool、短接，以实现解锁bl并且刷入magisk的方案。仅支持可拆卸的，基于联发科芯片的杂牌词典笔，不过方案思路大致一致，有道讯飞等使用定制Linux的词典笔无效（，请自行在GitHub搜索penmod）。

如果你连开发者选项都没打开或者没有体验过你的设备潜能，请先参阅这篇文章：

[链接]@史蒂夫ZMT的图文...

由于本文大量依赖于电脑操作，所以本文将同步发布在我的网站和社交账号上。你可以使用搜索引擎搜“史蒂夫ZMT工作室”，选择第一个搜索结果（哔哩哔哩或咕咕咕咕）；或者在浏览器地址栏访问si1vr.github.io，选择未满18岁，在新帖子里面找这篇文章。
（我们不承担您因好奇而导致rickroll的责任。）

重要：阅读完帖子再操作！

声明：这些操作可能摧毁你的设备或是使你的设备变砖，即使您按照这些操作完全按步骤执行，也有可能会因为是soc不同，或晚上刷机而导致砌砖。我们无法对您的操作提供任何担保和负责。可能需要焊接操作，如果你不了解，请找人帮忙。亲自焊接请务必注意安全，小心烫伤，完成后焊笔务必断电。

## 0x00.准备工作
你需要：

拆机工具
灵巧的手（如果你缺乏睡眠而手抖，请先睡一觉（、
内热电焊笔、
细导线、
锡焊料、
松香、
高温海绵、
铁架台、
热熔胶枪）
（如果-你的设备有两个音量键，或者-你打算找别人焊接，或者-你确认你的设备是廉价安卓设备且不需要使用fastboot刷写(意味着您只能使用SP flash tool)则忽略焊接工具）、
数据线（最好是手机原装的、质量好点的）、
电脑（已经配置好adb，Windows 10+）、
清醒的大脑（如果你感觉头晕，请先睡一觉）、
良好的螺丝刀，
纸盒，
可以上酷安的手机。

准备好：
电脑安装MTK驱动并重启安装完毕，如果遇到无法正确配置驱动的情况或者设备管理器已识别但是黄色感叹号的，那么打开Windows 更新，选择可选更新，安装来自Mediatek Inc.的驱动，完成后重启。

完成以上准备后，继续下一步。

如果你不要解锁，[直接从0x03开始看⤵️](#0x03：提取分区-跳至此处-⬅%EF%B8%8F)

## 0x01.焊接音量线（有音量键，或不需要解锁的可跳过）
拆开设备，这里以从屏幕处拆开为例：
1.用指甲把屏幕四周的胶分离开，但是只留一条缝
2.小心地抬起屏幕，把排线夹抠出来
3.去除固定的3颗螺丝，并把摄像头夹取出，放到小纸盒里面省得丢
4.在主板中下部有2个卡扣，小心地用小一字螺丝刀卡出
5.小心地把摄像头从底板槽中取出
6.小心地把主板抬起，拔下喇叭接线
7.把按键塑料块放到小纸盒里面
8.查看主板背面，拔电池，预热焊笔

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/1_compressed.jpg)
从上到下1－6，1 4音量下、24音量上

9.先在焊笔上涂一层焊锡，然后固定导线，使得导线拨了皮的铜丝末端对准焊板
10.先焊笔预热焊盘，然后焊锡接触到焊板和导线之间，当焊锡融化后立刻移除焊锡，再移除焊笔
用橡皮泥固定主板和导线，使得导线铜丝刚好在触点上，左手焊笔右手焊锡，先焊笔接触预热，再放上焊锡，熔化后先拿开焊锡，再拿开焊笔
如果连焊或者焊错位，不要直接拔导线！要用焊笔融化焊锡然后移除导线
11.完成后把屏幕排线扣回去，开机，测试音量线短接后机子有无反应。0x05：你要知道的一些事情
设备不能用音量键重启到fastboot，因此你只能用mtk bypass工具启动到fastboot
方法：关机或拔电池，bypass工具选reboot fastboot ,插上电脑

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/2_compressed.jpg)

## 0x02.=====解锁bootloader=====
（只要设备不是安卓4及更旧的系统就有bl锁，可能读不出来，但就是有，因为你打fastboot oem unlock会没反应）
(经过试验,联发科部分廉价设备如mt6580等无需解锁，可直接使用SP Flash tool刷写，无需特地解锁，但是仍然存在校验完全的设备，请谨慎判断。)

设备开机 (安卓6+设备需要开发者选项打开OEM解锁) ，电脑下载打开秋之盒atmb.top，运行右下角CMD命令行，在弹出黑窗口里输入adb reboot bootloader
以后类似的命令都是打在这里

（或者拔电池强行重启，用bypass重启到fastboot）
词典笔屏幕亮起后，输入fastboot oem unlock
不管设备屏幕有无任何反应 (非裁切屏可以显示解锁提示) ，短接音量上，也就是24焊点，此时终端窗口应有反应，并且报告成功

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/3_compressed.jpg)
解锁时窗口

然后打fastboot reboot，此时设备会清除所有数据

## 0x03：提取分区 (跳至此处) ⬅️
一共有2个方案
### 1.wwr+sp readback方案
特点：不需要焊音量键，但是提取的不一定完整，甚至可能就boot能用

此部分教程参考自[@可泺KoCleo](https://www.coolapk.com/u/%E5%8F%AF%E6%B3%BAKoCleo) 和rozetkin @ 4PDA ，非常感谢他们的帮助，原文可以访问他的个人主页，有图
（我现在用的酷安和手机太旧放个链接极为费劲）
电脑上准备好wwr（下载链接在文末）和bypass tool [这里](https://stevezmt.top/sharepoint/)
先打开，等待120秒

这期间下载SP flash tool、bypass tool和mtk驱动
完成安装
单词笔关机，电脑下载解压安装bypass tool，选择第一个选项，将单词笔连接到电脑，记录mt打头的编号。

回到wwr，选择auto mode，点开1.generating empty scatter file
选取刚刚读到的设备代号。

保存生成的scatter到一个目录
打开sp flashtool，保留wwr最小化或后台运行
(如果语言不对，左上角File里面选取Options，把English改成中文就行)
点开下载，在下面的第二个框里面选取刚刚创建的txt文本

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/4_compressed.jpg)
应该只有一行，不是像我的这么多

再打开内存测试选项卡
只勾选RAM测试，其他都不要勾

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/5_compressed.jpg)
其他都不要勾选!!!

点开始，设备关机，按中键或重插数据线，很快就读出一堆参数

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/6_compressed.jpg)
图源4pda，这里图都来自4pda

把这串复制到记事本上，不用保存
我们不关心0x0的地址，只需要4个值（其实是3个）

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/7_compressed.jpg)
手机做图烦死，这张也是搬的

然后点开回读选项卡
选择添加
双击新建的条目，选择rom_0保存位置（这是保存preloader）
区域选EMMC_BOOT_1，长度是你复制的第一个值

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/8_compressed.jpg)
就改动第一个选单，和底下的长度

然后单词笔插电脑上，按下中键或短暂的短路电池，或者把电池拔下再插上,此时底部进度条应该开始在跑，很快出现了一个绿圈或者一个大勾✔️。

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/9_compressed.jpg)
这就是那个中键（los图片编辑真烂）

在回读里面添加一个条目，双击选择保存位置（保存出来的文件是完整的emmc数据无压缩，你需要存在比你单词笔总大小大的电脑磁盘上），区域选EMMC_USER，长度就是你记录在记事本下来的值，最底下的很大

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/10_compressed.jpg)
取消勾选刚刚的rom_0
确保数据线，单词笔和主机连接稳定后，点开“回读”，再次按下单词笔的中键/拔插数据线/拔电池当进度条开始缓慢的移动时回读就已开始。
然后翻翻酷安，尽量不要动电脑，不要让电脑睡眠，不要锁屏，等待进度条跑完出现绿圈或大勾
再切回wwr，选择3.start autopilot，勾选第四个框，在右边选你的soc（如mt6582）
然后点start the process
在弹出的窗口里选择rom_0文件，也就是机器底层。
等进度条跑完后选择第一个build a clean firmware
选择你要保存固件的位置，然后软件开始疯狂输出（真），当出现done时弹出的文件夹应该已经有了你要的分区文件
⚠️ 注意! 尤其是mt6582用户
如果提示框出现了一大串information的绿色段落，大意是提取的固件不完整的，且你之前的操作都是按此帖说明来的；那很抱歉，你需要接受无法使用spflashtool刷写的事实，因为scatter不准确。不要使用任何来源的scatter刷写所有任何分区，无论来自adb或是preloader！如果你没解锁但是需要root，这下不得不解锁了，因为只能用fastboot刷写boot。提取的system.img是不能刷写的（大概？）所以你还需要保存好ROM_0和ROM_1。

### 2.mtkclient方案（未测试）
特点：部分mbr分区设备不能用，可以提全部分区但是一定要焊接音量线

（以下流程是根据我自己以前玩机总结的方案）
首先还是bypass找找自己设备soc型号
如果它很旧，那么你需要准备一个u盘（要么为空，要么已经做好了ventoy引导）然后用rufus（查看链接[这里](https://stevezmt.top/sharepoint/) rufus.ie）烧录链接里面的查看链接[这里](https://stevezmt.top/sharepoint/)镜像（ventoy就直接拷进去）
[ Windows用户可以参考查看链接[这里](https://stevezmt.top/sharepoint/)（在手机上打开即可）里面的readme文档配置Python环境或者自行搜索配置mtkclient，然后下载查看链接就行，解压出来后在地址栏里面输cmd，键入python mtk_gui或者直接双击mtk_gui.bat打开主界面]
[livecd用户引导完成后就直接双击mtkclient进主界面，参考文档也是上面那个链接]
按住音量上下键，连接数据线，音量上下键不放，直到mtkclient窗口开始转圈，等待出现一堆选项，把你要的分区全部提出来，顺便你还可以备份下分区表

上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。

## 0x04.安装magisk

1.github下载magisk23000版本，将安装包安装到单词笔上
（不管你想不想更新，都先用这个版本，它最低确保android5能运行。）
2.把刚提的boot.img用mtp或adb推到手机上
3.打开magisk，点安装，不勾选avb dm-verity以及其他任何选项
然后下一步，选择刚刚推送的boot.img,等待完成后用mtp或者adb pull出来保存在电脑上的任意位置。
4.打开mtk bypass，选择reboot fastboot选项，然后再次按下中键/关机插入/拔电池，在之前的终端里输fastboot flash boot [空格键]，然后不急着按回车，把刚刚提出来的magisk-patched_xxxxx.img拖动到命令窗口里面，再敲回车，直到出现OKAY字样，然后fastboot reboot，你就获得了root权限。
（如果你没解锁，并且不是mt6582机型设备，那么打开SP flash tool,导入原来的scatter,只勾选boot分区，双击后面路径选你的magisk_patched_xxxxx.img，选择方式为下载Download，然后开始下载，设备关机插入，等待红条和黄条跑完就行。）

![加载图片时遇到问题，请尝试访问mirror.blog.stevezmt.top](/images/blog/root-on-scanpen/11_compressed.jpg)

## 0x05：你要知道的一些事情
设备不能用音量键重启到fastboot，因此你只能用mtk bypass工具启动到fastboot
方法：关机或拔电池，bypass工具选reboot fastboot ,插上电脑

你要保护好你的原始boot映像和提取的ROM_0,ROM_1

如果你是用wwr方案提的分区，那要格外保存好ROM_0和ROM_1
应用程序不是总能安装到sd卡。
不要乱动开机动画，这机器删了开机动画就不开机，过度精简了属于是

我只在周末能回复消息。

## 0x06：附录
上面这些文件可以在[这里](https://stevezmt.top/sharepoint/)获得。

酷安更新帖子有次数限制，因此有些补充消息发在评论里面，可以在评论里“楼主”筛选里面查看。
md又涨价了