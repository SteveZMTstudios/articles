---
uuid: 325e6742-aa8e-c5b1-d7c0-209cbc05d31a
title: 几乎超越鸿蒙的完全互联方案
toc: true
comments: true
date: 2024-12-03 20:15:22
tags:
    - 开源
    - 安卓
    - 互联
    - KDE
    - root
categories:
    - 折腾
#donate:
#license:
thumbnail:
#excerpt:
---

~~可能是这几天吃太饱了~~，花了一个周末，折腾了一个自己个人还算满意的全平台互联方案。

实现效果几乎可以完全满足我个人远程工作的需要，而且绝大部分组件都是开源，几乎无感知的实现了类似鸿蒙宣传的的完全互联方案。

但是好像目前只能限制在你自己的设备...

## 总体效果
在我手边的两台安卓手机，一台安卓词典笔，一台安装了linux & KDE Plasma的老旧笔记本上实现了：
    - 随时随地的控制媒体设备(穿网,kde-connect)
    - 异地访问设备文件(穿网,scp,ssh)
    - 远程桌面(穿网,vnc,rdp)（体验不好）
    - 通知同步，**在电脑(_所有设备_ )上接验证码**(穿网,kde-connect)
    - 手机当鼠标键盘（或者电脑给手机当键盘）(穿网,kde-connect)
    - 剪贴板同步(穿网,kde-connect)
    - 远程锁屏/关机/快捷执行指令(穿网,kde-connect)
    - 浏览器投放(kde-connect)
    - 互联打印(理论可行，穿网)
    - 类AirDrop(穿网)

这些可能在你看来就是装个软件的事，但是这其中最关键的是？
所有设备只要上网，离你多远都无所谓！

## 实现原理
先借助Tailscale实现了所有设备的内网穿透，然后再使用KDE Connect实现了所有设备的互联（
是的，看似极为深奥的技术本质都是很简单的（x

## 实现步骤
### 1. 安装Tailscale

这一步看起来很简单，但是实际上可能会遇到很多问题。
首先访问[Tailscale官网](https://tailscale.com/)，注册一个账号。我是选择github登陆的，你使用对你来说方便的账号即可。
然后根据你的设备选择对应的安装方式，他的新手教程很详细的。
注意：所有设备都要完成这一步。如果你想把打印机或者电视机也加入到你的互联方案中，并且你确实没有办法在上面安装apk或执行shell脚本，那你最好有一台网内设备可以常开（推荐是刷了openwrt的路由器）。
如果你更考虑安全性的话，你可以配置好Tailscale的tailnet Lock，但是所有加入网络的设备都要有认证配对。
还有tailscale是以来在NAT环境下穿透的，所以你的路由器要支持UPnP，或者起码是Easy NAT; 对于Hard NAT,你要么有台公网服务器常开配置中转，要么依赖tailscale的relay服务器，这样会有一定的延迟，毕竟人服务器都不在国内。
（你可以在你的路由器或者你公司的机器上配置出口，这样当你需要以家庭ip/公司ip访问某些站点，或者需要在不安全的热点上访问HTTP站点的话，就可以使用Tailscale的出口服务。因为流量加密，所以也很安全。）
Zerotier固然也可以，但是它不会主动穿透NAT，而且中转速度超慢，还限制10台设备；所以你要么自己配置中转，要么依赖它的relay服务器，这样会有一定的延迟，毕竟人服务器都不在国内。
如果你是Root高级用户，并且使用Magisk或者KernelSU的话，你可以使用[Tailscale的Magisk模块](https://github.com/anasfanani/Magisk-Tailscaled/releases "将前往 Github.com")，这样你就可以几乎无感的使用Tailscale了。

> 配置完Tailscale后，记得在管理面板上打开TailDrop，这样你就可以实现传文件的功能了，当然kde connect的传文件也很不错，如果你用linux的话，那还是选择kde connect吧。

### 2. 安装KDE Connect
这点我想不用多说了，软件在[官网（Windows端）](https://kdeconnect.kde.org/),[F-Droid（安卓端）](https://f-droid.org/packages/org.kde.kdeconnect_tp/)/[华为应用商店](https://appgallery.cloud.huawei.com/ag/n/app/C104724723)/[Google Play 商店](https://play.google.com/store/apps/details?id=org.kde.kdeconnect_tp "您所在的国家和地区可能无法访问此链接。"),[App Store（iOS）](https://apps.apple.com/app/kde-connect/id1580245991)或[OpenRepos（Salifish）](https://openrepos.net/content/r1tschy/sailfish-connect)上有。
Windows上也可以配置Kde Connect主机，但是功能没有在Linux & KDE Plasma上全。大概就是远程指令用不了，其他没啥损失。
因为Tailscale的虚拟局域网网段不在你的路由器的DHCP分配范围内，也不在常规的内网网段内，所以你的设备可能会有两个ip，一个是局域网ip，一个是Tailscale的ip。这时候你要在KDE Connect的设置里面手动添加你的Tailscale ip，这样你就可以在外网访问到你的设备了。
![图片](/images/blog/real-harmony-connect-all/2_compressed.jpg)
你可以在Tailscale客户端的设置里面配置DNS，这样你就可以通过设备名访问你的设备;也可以用ip来配置，ip列表在Tailscale 客户端上有的。也可以在Tailscale admin网页上查询。
总之KDE Connect真的是非常的全能，除了在电脑上接电话它几乎把所有必要的功能都做了。

### 3. 配置SSH（可选）
配置SSH的教程很多，你在你的Linux电脑上配置好SSH服务，就可以在远程办公的时候用VSCode的Remote SSH插件，或者用Termux的SSH客户端，或者用其他SSH客户端访问你的设备了。
如果你是Windows电脑，那就打开你电脑的远程桌面服务（RDP），手机上安装RDP 客户端（windows笔记本不需要配置），接入Tailscale就可以远程了。
Linux电脑上就安装xrdp或krfb（超卡，不知道哪里的问题），手机上安装VNC客户端，接入Tailscale就可以远程了。

### 4. 配置SFTP（可选）或syncthing（可选）
如果你想在远程访问你的文件，那么你可以配置SFTP，或者用syncthing同步你的文件。
SFTP的配置教程很多，你可以在你的Linux电脑上配置好SFTP服务，然后用你的手机上的文件管理器访问你的文件。
syncthing的配置教程也很多，你可以在你的Linux电脑上配置好syncthing服务，然后用你的手机上的syncthing客户端同步你的文件。
（syncthing我就没配置成功过，所以不过多指点了）

## 怎么使用

1. 控制媒体设备
   - 打开手机的通知访问权限
  就好了（x
2. 异地访问设备文件
    - 这个就更简单了，电脑可以直接在托盘图标上右键，选择远程文件访问，然后在电脑上就可以访问手机的文件了。
   ![图片](/images/blog/real-harmony-connect-all/7_compressed.jpg)
    - 手机访问电脑的话可能就还得依赖SCP。
1. 远程桌面
   这个前面提得很清楚了，不过体验不好，不推荐。
2. 通知同步
    这个就更简单了，打开手机的通知访问权限，在kde里面把广播设备通知打开就好了（x
    部分手机需要打开验证码读取权限
3. 手机当鼠标键盘
   如果kde connect授过权的话应该开箱即用的
4. 剪贴板同步
   电脑会自动同步到手机上。手机下拉通知栏，选择发送剪贴板，就可以发送到所有设备
    ![图片](/images/blog/real-harmony-connect-all/6_compressed.jpg)
5. 远程锁屏/关机/快捷执行指令
   这个需要Linux & KDE Plasma的kde connect主机，然后在手机上就可以远程执行指令了。
   还可以把快捷方式放到设备管理器（小米设备的在控制中心，叫智能生活）
   ![图片](/images/blog/real-harmony-connect-all/1_compressed.jpg)
6. 浏览器投放
   手机选择共享网页，在电脑上就可以看到了。
   ![图片](/images/blog/real-harmony-connect-all/4_compressed.jpg)
   电脑要安装浏览器插件[KDE Plasma浏览器集成](https://community.kde.org/Plasma/Browser_Integration)
7.  互联打印
    把打印机ip添加上
    理论可行，但是我没有打印机，所以没测试过。
8.  类AirDrop
    电脑上右键文件，选择发送到...，然后选择手机就好了。
    手机上共享就找到了。
    ![图片](/images/blog/real-harmony-connect-all/5_compressed.jpg)

## 结语
这个方案的优点是几乎无感知的实现了类似鸿蒙宣传的的完全互联方案，缺点是只能限制在你自己的设备，而且有一定的延迟。
屏幕共享和远程控制还是不是很完善，等我研究一段时间。

