---
uuid: 31d369fa-d378-dca4-7ad8-0128f6d308d8
title: WSL中如何顺畅地使用GPG和Yubikey这类东西
date: 2026-04-13 15:59:34
tags: [开源, wsl, linux, yubikey, usb]
categories: [瞎搞]
donate: true
toc: true
comments: true
thumbnail: /images/blog/wsl-gpg.exe/thumb.png
excerpt: 这事明明很简单的，怎么给互联网和技术大牛搞得这么复杂？
---




有时经常需要在WSL2中执行一些GPG操作，比如签名Git提交什么的。如果此时又不幸购买了Yubikey，那么就需要想办法让GPG和插在Windows上的Yubikey对上话。

然而如果你要一旦上网去搜索`wsl gpg yubikey`，那么你大概就会看到像[这样](https://readmedium.com/how-to-use-a-yubikey-in-wsl2-linux-on-windows-96f176518583)或者[那样](https://blog.caomingjun.com/series/yubikey/wsl/)的文章。

诚然，这些文章写的都很好。我自己以前也是用usbipd把yubikey映射到wsl中。但这样有个问题，你会忘记上一次配置usbipd把yubikey接到linux上了，这很容易导致未预期的错误。

如果你选择去问AI，那么它大概会给你一个奇幻的答案，让你在windows和linux上装一大堆乱七八糟的东西，然后最好的情况是`gpg --card-status`没有反应。

但是，WSL（Windows Subsystem of Linux）必须得Sub✍️✍️✍️，就像它的名字一样

好了不扯废话了，我来说我现在的解决方案。

## 我的环境

这是我的fastfetch，即使不完全匹配应该也没大问题

```powershell
PS C:\Users\stevezmt> uname -a
uname: The term 'uname' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
PS C:\Users\stevezmt> fastfetch -l none
stevezmt@DESKTOP-LLICT9J
------------------------
OS: Windows 11 专业版 Insider Preview (25H2) x86_64
Host: Yilong15Pro Series GM5HG0A
Kernel: WIN32_NT 10.0.26220.8165
```


我的WSL：
```bash
steve@DESKTOP-LLICT9J:~$ uname -a
Linux DESKTOP-LLICT9J 6.6.87.2-microsoft-standard-WSL2 #1 SMP PREEMPT_DYNAMIC Thu Jun  5 18:30:46 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
steve@DESKTOP-LLICT9J:~$ cat /etc/lsb-release
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=24.04
DISTRIB_CODENAME=noble
DISTRIB_DESCRIPTION="Ubuntu 24.04.4 LTS"
steve@DESKTOP-LLICT9J:~$

```

我的电脑上安装了[Gpg4win](https://www.gpg4win.org/)，我觉得你们也都应该装一下

## 我现在的解决方案

就像我文章头图那样：

```bash
gpg.exe
```

真的，如果想在wsl上下文里面运行任何windows程序的话，后面加个`.exe`就好了。

你甚至可以直接在 WSL2 终端里输入 `notepad.exe` 并回车，Windows 记事本就会弹出来

也就是说，如果你想要在wsl里面用gpg签署提交，并且windows的gpg4win也都配置完成了，那你就可以直接：
```bash
git config --global gpg.program gpg.exe
```

![](/images/blog/wsl-gpg.exe/img_1776093416571_0_compressed.jpg)

当然类似`cls` `dir`这种cmd.exe提供的命令不大跑的起来，不过`shutdown.exe`是可以的

同理，你甚至可以`alias adb="adb.exe"`，然后wsl和windows调试同一台设备

![](/images/blog/wsl-gpg.exe/img_1776093550944_0_compressed.jpg)

如果你的工作只是要传递`stdin`和`stdout`就可以了的话，用这个就够了。

### 为何它运作？

我觉得wsl和普通虚拟机相比最大优势不是它快，也不是资源管理器直接管理虚拟磁盘，而是**跨操作系统进程操作**（Cross-OS Process Interop）

```bash

steve@DESKTOP-LLICT9J:~$ cat /proc/sys/fs/binfmt_misc/WSLInterop
enabled
interpreter /init
flags: P
offset 0
magic 4d5a

```
可以看到，它将所有以`4d5a`开头的文件交给了`/init`去处理。

那为什么是/init？

/init充当Linux虚拟机与Windows主机间的“跨系统消息总线”。它会检查自己被调用时的“名字”（argv[0]），来知道它现在该干嘛。在这次调用中，它的名字是/init，于是就开始作为binfmt_misc的解释器，尝试启动一个windows程序。

这就是为何wsl内核要定制。



启动新的 Windows 进程`/init`需要连接到互操作服务器。互操作服务器是特殊的 Linux 进程，充当 Linux 和 Windows 之间的桥梁。它们与 Windows 进程（例如`wsl.exe`或`wslhost.exe`）保持安全的通信通道（通过 hvsocket 连接），从而启动 Windows 可执行文件。

在 Linux 系统中，每个会话领导者和每个init实例都有一个关联的互操作服务器，该服务器通过 unix 套接字提供服务`/run/WSL`。

`/init`使用`$WSL_INTEROP`环境变量来确定要连接的服务器。如果未设置该变量，`/init`会尝试`/run/WSL/${pid}_interop`使用自身的进程 ID (PID) 连接到服务器。如果连接失败，`/init`则会尝试连接其父进程的进程 ID，然后继续向上查找，直到找到`init` 进程。

连接成功后，`/init`会发送一个`LxInitMessageCreateProcess`（WSL1）或`LxInitMessageCreateProcessUtilityVm`（WSL2），然后将该消息转发给关联的 Windows 进程，该进程将启动请求的命令并将其输出转发给`/init`。[^1]

之后的操作都在windows上执行了，windows程序根据参数去干活，然后把参数发回去，wsl里面的init拿到退出码和返回后，原样交给fork它的进程，然后就像活都是自己干的一样退出并返回一样的返回值。


[^1]: https://wsl.dev/technical-documentation/interop/


所以，一旦涉及跨系统的内存共享或直接内存控制，这套协作机制就无法和 Linux 进程协同了。你也不能把游戏在windows和linux上各装一半，然后试着利用这套机制去运行起来。慢不说，它们在实际运行时就会撞到vm本质上的那层墙。

也不要指望让 Linux 调试器 attach 一个 Windows 进程的内存——何苦呢？

还有什么能传？

不多，除了 stdin/stdout/stderr，/init 这座桥还能传递一些常规的东西，比如:

- 环境变量；很显然，不然你的`gpg.exe`linux怎么知道它要处理哪一个elf
- 工作目录：Linux 的 /mnt/c/Users/steve 会被转换成 C:\Users\steve 传给 Windows。
- 文件描述符：Linux 进程可以把打开的文件句柄传给 app.exe。比如 `git log | gpg.exe --verify`，这个管道 `|` 是由 Linux 内核的 `pipefs` 管理的，`/init` 会把这个管道的一端映射给 Windows 进程。



## 我以前的解决方案

我以前是“相当于直接把yubikey塞进wsl虚拟机”，这种方式也适合像烧录固件这种最好直接控制usb的程序

Windows 侧
安装 usbipd-win：
在管理员 PowerShell 中执行：

```powershell
winget install --interactive --exact dorssel.usbipd-win
```

WSL2 侧 (以 Ubuntu 为例)
需要安装 USBIP 客户端工具：

```bash
sudo apt update
sudo apt install linux-tools-generic hwdata
sudo update-alternatives --install /usr/local/bin/usbip usbip /usr/lib/linux-tools/*-generic/usbip 20
```

2. 绑定并连接 Yubikey
在 Windows 管理员 PowerShell 中找到 Yubikey：

```powershell

usbipd list
```

找到类似 1050:0407  Yubikey 4/5 OTP+U2F+CCID 的行，记下其 BUSID（例如 4-1）。

绑定设备（只需操作一次）：

```powershell
usbipd bind --busid 4-1
```

连接到 WSL：

```powershell
usbipd attach --wsl --busid 4-1
```

注：连接后，Windows 侧将暂时无法识别该 Yubikey，直到你执行 detach 。

3. 在 WSL 中配置 GPG 签名
连接成功后，在 WSL 中执行 lsusb，你应该能看到 Yubikey。

确保智能卡服务运行
```bash
sudo apt install scdaemon pcscd
sudo service pcscd start
```


检查卡片状态：

```bash
gpg --card-status
```
如果输出了你的 Key 信息（包括 Signature key 的 ID），说明硬件链路已通。

配置 Git 使用该 Key：
获取 Key ID：`gpg --list-secret-keys --keyid-format aaaaaaaaaaaaaaaaaaaaa`

```bash
git config --global user.signingkey 3745872A953198FE

git config --global commit.gpgsign true
```
测试签名 Commit：

```bash
git commit -S -m "signed commit via usbipd"
```

此时 WSL 内部会调用 scdaemon 访问 USB 硬件。


这么做不仅看运气和环境，而且弹窗也比较麻烦。

但是有时（比如用linux烧固件）只能这么干。

### 这又是怎么运作的？

这个解释起来稍微简单一点：

诸位肯定都用过usb转发器吧。

它就相当于借助`usbipd`这个转发器，把你的硬件从windows上拔下来插在usbipd这个延长线上。之后的驱动和操作完全由linux控制。



## 结语

wsl很可能是~~microslop~~Microsoft这几年为数不多做的还算人事的东西。






