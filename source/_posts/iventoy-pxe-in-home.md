---
uuid: 7f51d3d6-698b-e738-d834-9bf46d840077
title: iVentoy 与家用路由器引导 PXE
donate: true
toc: true
comments: true
date: 2025-09-29 21:31:33
tags: 
    - iVentoy
    - PXE
    - 网络引导
categories:
    - 折腾
---

近期要给家里另一台电脑重做系统，但是手边没有U盘，就想着折腾网络启动看看免U盘能不能装系统。

<!-- more -->

以前为了做学校电脑批量自动恢复做 HephaestusOS 的时候就用过PXE，只不过项目后面难产了，导致最后也没彻底实现。
PXE 的原理其实很简单，就是通过DHCP和TFTP协议让电脑从网络上下载启动文件，然后再加载操作系统。
因此对带宽的要求比较高，如果跑不到千兆的话效果可能不如U盘。
（但是我忘性大，U盘都丢光了导致我一时半会手边真找不到能格的U盘...）

## iVentoy  
iVentoy 本质上是个 PXE 服务器，可以在Windows和Linux上双击运行，不需要太多配置，开箱即用。

需要注意的是iVentoy不是自由软件，虽然个人可以免费使用，但是有设备限制，也不支持ARM架构的设备，要放宽限制需要购买授权激活。

不过对于家用电脑和普通电脑维修店来说，免费版已经足够使用了。

iVentoy 项目地址：https://www.iventoy.com/cn/index.html

## PXE
PXE 的原理其实很简单，就是通过DHCP和TFTP协议让电脑从网络上下载启动文件，然后再加载。
然后蛋疼的地方就来了，家用路由器如果不刷机的话，基本上都不支持PXE引导。
幸好现在的路由器大多支持安装第三方固件，比如 OpenWrt、Padavan、梅林等。

悲催的是我家选择了中兴的路由器，根本没得刷。

然后继续找教程...

## 路由器配置

首先把iVentoy设置为External DHCP模式，然后设置好TFTP根目录，放入需要的ISO文件。
如果路由器能刷机的话，推荐刷 OpenWrt，然后安装 `dnsmasq` 和 `tftpd` 两个软件包，就可以配置PXE了，还是很简单的。
~~（你妈妈的网上清一色的教程都是这个...）~~

## 直接iPXE指定网络设备
我想着是，反正都是DHCP和TFTP协议，能不能直接指定IP地址和TFTP服务器地址，然后直接连接到iVentoy的TFTP服务器上，省的折腾路由器？
继续查了几十条教程，发现 iPXE 支持直接指定网络设备和TFTP服务器地址。
但是！
完成DHCP后，
ipxe 打不开，连不上。
你妈。

## 用 EFI shell 连
万般无奈去求助Deepseek，然后deepseek也跟个若只一样煞有介事地讲说EFI shell可以连。
真尼玛扯淡，EFI shell只能指定本地文件，连个TFTP都不支持。
继续问，deepseek又鬼扯淡说可以用`ifconfig`和`tftp`命令。
讲着讲着连`wget`都能讲出来了。
G*t*ub Cop**ot也没好到哪里去。
我真是服了。

## 最终解决方案：关掉路由器DHCP
最后突然想到，iVentoy的DHCP选项里还有一个叫Internal的选项。
查阅文档发现这个选项是让iVentoy自己充当DHCP服务器。
然后我就把路由器的DHCP关掉了，直接让iVentoy充当DHCP服务器。
然后就成功了。

如果有其他联网设备在线并且要上网的话，记得指定一下DNS。

为什么这么简单的东西没人写教程呢？


