---
uuid: 02d8c8ca-9fd8-3475-a01d-e0a413425beb
title: Ticwatch Pro 3 Ultra 的苦痛之路
date: 2026-03-27 08:35:55
tags:
  - 安卓
  - 开源
  - root
categories:
  - 折腾
  - 电子垃圾
donate: true
toc: true
comments: true
---

这几天二手淘了一个ticwatch pro3 ultra。170。

卖家说他刷了国行系统。

刚好那天勤工俭学发工资想买点东西，再一看，170就能买到一个带屏幕、GPS还有NFC的安卓9，那还要啥自行车，当时就脑子一热入了...




<!-- more -->


![](/images/blog/ticwatch-ruby-fishy/img_1774589894803_0_compressed.jpg)

就这样，史蒂夫蒸馒头的一周完全被毁掉了...


## 第一关：充电和....这尼玛什么固件？？？

开箱到手发现卖家就充了30%的电，行吧，大概够用？刚好赶上上课，就把手表带去上课顺便研究一下系统。

因为是wearos2国内版，所以还是下载[WearOS by Google 中国版](https://sj.qq.com/appdetail/com.google.android.wearable.app.cn)，蓝牙对上之后初始化，然后研究系统和手机app...

状态栏有个很碍眼的无Sim卡图标，应用列表里面还有一个esim助理？再仔细一看国内御三家运营商早就凉掉了，没有一家能绑定ticwatch的。

看看公交卡包，ok `CPLC为空`

![](/images/blog/ticwatch-ruby-fishy/img_1774592441246_0_compressed.jpg)

门禁卡也一样写不进去。

得，当个大号手环好了。

wearos总还是能安装app吧，在手表上把支付宝和微信装上了之后，手表长震一阵，然后就只剩液晶屏显示了...

再开不能，没电了。

屮。这还不到一个小时30%就没了？？？

熬过下午的大水课之后回宿舍给表充电...

从四点充到八点，就冲进去40%。好嘛，我adb一看，就25毫安的电流。

```
$ dumpsys battery
Current Battery Service state:
  AC powered: true
  USB powered: false
  Wireless powered: false
  Max charging current: 25000
  Max charging voltage: 5000000
  Charge counter: 0
  status: 2
  health: 2
  present: true
  level: 44
  scale: 100
  voltage: 3889
  temperature: 285
  technology: Li-ion
```

卖家送的什么垃圾线。被迫下单等新数据线。
今晚只能放着冲了。淦。

## 怎么还有第二关？
刷了一晚上贴吧，酷安和xda，确认了ticwatch pro 3基本上都是同一个板子，固件有微小的差异，但是通刷基本没问题。

在这个[小绿书帖子](https://www.coolapk.com/feed/61736764?s=YTBkOGIwZGYxNTdlMjQyZzY5YzYxY2E4ega1603)上下到了MBN程序员文件之后，拆了一根4pin线，准备进9008 dump分区表。

> 千万不要学我这样用热熔胶糊线！xda上介绍了[一种更加方便的方式](https://xdaforums.com/t/guide-how-to-make-data-cable-for-ticwatch-pro-3-5-the-easiest-ever.4648785/)但是不是很稳，或在reddit上找有大佬制作的3D模具然后打印。当然闲鱼上好像也有卖，我不确定。

把固件dump出来之后，找到了[国际版的固件](https://wear.onetm.ovh/en/OneOSWear/downloads/rubyfish)，开刷

![](/images/blog/ticwatch-ruby-fishy/img_1774592140291_0_compressed.jpg)

即使找到了包我也依旧踌躇，如果这确实是没有esim的ticwatch pro 3 ultra，那它的设备代号就应该是`rubyfish`,然而呢？

拜托这谁看了不犹豫.
```bash
adb shell
```
![](/images/blog/ticwatch-ruby-fishy/img_1774592356780_0_compressed.jpg)

```bash
fastboot getvar all
```
![](/images/blog/ticwatch-ruby-fishy/img_1774592473967_0_compressed.jpg)

怎么看怎么不像。以防圈外人不懂，product不对通常不能通刷，会出大问题。

又在网上找了各路帖子和文章，感觉这个rover很可能就是卖家刷的国行，包里有aboot，给fastboot也覆盖了。

总之硬着头皮刷，算是刷开机了。

你可以看到这里有三版stock rom，但是在我这里似乎只有PMRB.220703.001的固件刷了能开机，可能是什么神秘的防回滚？

## 升级wearos3

仔细搜索，国际版的ticwatch pro 3 ultra是有wearos 3推送的。

我的这个已经还原国际版的也接收到了更新。

于是把网络环境配好，手表连上热点，尝试从内置的系统更新安装...

这一步我花了两个晚上，似乎证明上面那个包有问题，mobvoi下发的包是diff格式的，即使有twrp也得在官方原厂的recovery环境，并且哈希要和目标匹配。而上面one team提供的rom中的system分区升级包信不过。

当然网上一搜就有相关讨论，[xda论坛](https://xdaforums.com/t/guide-ticwatch-pro-3-gps-wearos-3-5-for-open-bootloader.4647312/)上有人研究过了。

当然就想照着试试，上面说第一步是先刷旧版固件。但我这个设备不知道是撞上了什么神秘的防回滚，一旦刷了旧版固件就死活不开机。有时刷完还能进第二屏转一下，但重启完就卡第一屏了。硬是研究和ai对线了好长时间。

事实证明Gemini不开思考模型纯⑨，没话讲。

把[4pda上关于这块表的讨论](https://4pda.to/forum/index.php?showtopic=1005330)发给Codex并给它装上playwright（虽然应该用来调试浏览器，不过怎么用不是用是吧🤧），帮它过掉人机验证然后登录论坛账号让它搜索关键词（毕竟我不懂俄语），codex找到了这么一个解决方案：

遵照[这篇XDA帖子](https://xdaforums.com/t/guide-ticwatch-pro-3-gps-wearos-3-5-for-open-bootloader.4647312/post-89364621)，但是如果是Ticwatch Pro 3 Ultra，可以跳过3-7步，总的来说，你要：

- 确认你拿的是Ticwatch Pro 3 Ultra
- 先把表刷到`PMRB.220703.001` （这个固件在我的表上能开机）

然后：
1. 解锁引导加载程序，跑下面的程序然后按下面的键选择Unlock bootloader之后按上面的键
```bash
fastboot oem unlock
```

2. 再次确认你的表是上面那个固件版本，如有必要再刷一次
3. 保持引导解锁下开机一次，确保能开并且固件版本是对的
4. 把[这个system.img](https://pixeldrain.com/u/KF15yFYB)下载下来
5. 刷进去
  ```bash
  fastboot flash system 231020_system_image/system.img
  ```
6. 上锁。critical锁不锁无所谓，但是一定要上锁
  ```bash
  fastboot oem lock
  ```
7. 此时设备会再进一次recovery清数据，建议这时就按住下面那个键，确保在recovery屏幕完成清理之后进bootloader
8. 成功进引导之后按下面的按钮切换到Recovery Mode
9. 在`No Command`屏幕下，按住上面的那个按钮，手从屏幕底下往上滑
10. 出现菜单之后，先按下面的键切到 `Mount /system`，按上面的按钮确定
11. 再按下面的按钮切到 `Apply Update via ADB`，按电源键确定
12. 如果上面的步骤全部按顺序来的话，sideload这个[升级包](https://pixeldrain.com/u/ugD7WsVW)
```bash
adb sideload update.zip
```

然后千万不要动线。稍等一会等电脑上显示 `Total xfer: 2.xx`字样，手表显示`Install From ADB complete`之后，就可以重启到系统体验wearos3了。

![](/images/blog/ticwatch-ruby-fishy/img_1774684145065_0_compressed.jpg)

btw手机最好root过，因为要装[unlock-cn-gms模块](https://github.com/fei-ke/unlock-cn-gms)，不然手机没法和手表配对

手机靠近手表，下载一个[Mobvoi Health](https://play.google.com/store/apps/details?id=com.mobvoi.companion.at)

接下来保持网络畅通，按照屏幕上显示的流程来就可以了。

## 怎么这么卡

一般来说，只要手机保持网络畅通，手表蓝牙连接的手机，手表的网络也是通的，不需要特地留学。

但是，在我这，即使网络通畅， Google 地图也偏移到姥姥家了，钱包也没啥用，我也不需要talkback和小问关怀

我只停用了以下包：

```
package:com.google.android.marvin.talkback //Android 无障碍套件
package:com.google.android.apps.maps //Google地图
package:com.google.android.apps.walletnfcrel //Google钱包
package:com.mobvoi.mwf.magicfaces //元创秀
package:com.mobvoi.care //小问关怀
```

```bash
adb shell pm disable-user --user 0 com.google.android.marvin.talkback
adb shell pm disable-user --user 0 com.google.android.apps.maps
adb shell pm disable-user --user 0 com.google.android.apps.walletnfcrel
adb shell pm disable-user --user 0 com.mobvoi.mwf.magicfaces
adb shell pm disable-user --user 0 com.mobvoi.care
```

（如果临时需要某个组件，手表上设置里也可以直接启用）


并且内置ROM的后台实在是太宽松了，用以下命令限制到12个缓存

```bash
adb shell settings put global activity_manager_constants max_cached_processes=12
adb shell settings put global activity_manager_constants fg_service_minimum_shown_time_ms=0
```

恢复：
```bash
adb shell settings delete global activity_manager_constants
```

play商店一直想要后台更新，加进待机桶：
```bash
adb shell cmd activity set-standby-bucket com.android.vending rare
adb shell cmd activity set-standby-bucket com.google.android.apps.maps rare
adb shell cmd activity set-standby-bucket com.google.android.tts rare
```

## 我软件商店呢？

去Play商店逛了一圈发现没有支付宝等一众国内手环应用。去别的地方找了一圈发现都不大兼容。于是心想我要不干脆把小问商店下回来。去网上找到了2.3.1版本，但奈何装上就闪退。

发现小问商店会在启动时检查自己是不是特权app，并尝试和自己的账号服务联动。因为国际版的账号系统和国内版固件不一样握不上手，故闪退。

随手修复了一下小问商店，因为自己不是特权应用，安装需要root或者shizuku授权，简单地写了个握手，发在[米坛社区](https://www.bandbbs.cn/resources/5746)。

商店有服务器端指纹校验，只有ticwatch系列可以下载app。这个还是保留没有额外修改。

进商店发现里面软件也就那么几个，需要的高德地图什么还是一概没有

找了好几个手表商店，最后我看[微思应用商店](https://apk.wysteam.cn/)看起来还行。

## 我蓝牙调试呢？

手表开发者选项里有个蓝牙调试，看着很碍眼。

但是[Android文档](https://developer.android.com/training/wearables/get-started/debugging?hl=zh-cn#physical-wa)却这么说：

> 注意： 自 Wear OS 3 起，不再支持通过蓝牙进行调试。

那那个选项就显得**非常突兀**。我把我备份提出来的固件拆开看了一眼，蓝牙调试的握手协议还在那里，只要有懂的，马上就能握上。

刚好我嫌wifi调试太耗电了，于是简单搓了一个[蓝牙调试中间件](https://github.com/SteveZMTstudios/WearOS-bluetooth-adb-wrapper)，装在配对的手机上就可以用。

顺手让AI翻译了一下[bugjaeger的界面](https://stevezmtstudios-my.sharepoint.com/:u:/g/personal/me_stevezmt_top/IQC0vkOuPHvrQZf16X-f2a3PAdN7hW3z8yejsGF70p9PIWE?e=l3YosG)，但是这个我还没签名，回头签一下。

这样就不用想装个app还得开个热点，既浪费手机电也浪费手表电。

## 怎么root还这么费劲？

想试试能不能模拟门卡刷小区，很明显这需要root。

再度解锁引导加载，装上magisk

ok，ramdisk 没有在boot里面。

![](/images/blog/ticwatch-ruby-fishy/img_1774686118247_0_compressed.jpg)

完全没有问题，patch recovery就好了。

recovery一进系统就会被`/vendor/bin/install-recovery.sh`还原

没事，把`vendor`挂载到wsl Ubuntu下面修改就好了。

但是我就不明白了，我都修改那么多字节了怎么FEC还能纠错回来的啊

![](/images/blog/ticwatch-ruby-fishy/img_1774686265039_0_compressed.jpg)

没话讲，干掉vbmeta
```bash
fastboot --disable-verity --disable-verification flash vbmeta vbmeta.img
```

---
---

最后手环的vendor没法改nfc使其模拟特定卡片。

shizuku_daemon在后台虽然只有30多兆的内存占用，但是还是捉襟见肘，wearos自己的软件包安装程序根本没法安装app，稍微[改了一下](https://github.com/SteveZMTstudios/PackageInstaller/releases/latest)特轻量的[shizuku安装器](https://github.com/vvb2060/PackageInstaller)，让它直接用root权限安装app，省得多装一个app还常驻后台耗电。

感谢[vvb2060](https://github.com/vvb2060)。

不过150买个带屏幕的openpgp card，webauthn，oauth，还能测量运动和聊qq刷支付宝，感觉还是比三百多的yubikey划算。

![](/images/blog/ticwatch-ruby-fishy/img_1774686649564_0_compressed.jpg)



























