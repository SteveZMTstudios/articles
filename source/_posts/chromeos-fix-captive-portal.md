---
uuid: 3523271b-97b1-7a14-5674-9199a829cd7d
title: ChromeOS  修复“无法连接到互联网”
date: 2026-05-29 02:18:12
tags: [开源, root, linux, 故障, chromeos]
categories: [折腾]
donate: true
toc: true
comments: true
thumbnail: /images/blog/chromeos-fix-captive-portal/thumbnail.jpg
---

其实一年前就应该把这篇文章发出来的，结果直到最近整理自己的项目库时才发现说“噢我以前还研究过这个”。

一年前多前新入了一个AMD笔记本，算是把老Intel电脑换掉了，而且由于CPU受支持，终于可以装上心心念念的[brunch ChromeOS](https://github.com/sebanc/brunch)。

关于怎么安装这里不必多赘述，它自带的文档写得还挺清楚。需注意如果要保留安全启动的话，最好是linux安装然后禁用mokutil的shim额外验证。

安装完成之后手机上网开[热点](https://github.com/Mygod/VPNHotspot)，网上教程多这里不再讲了。

虽然说 ChromeOS 确实比较依赖国际网络，但是一直连着热点还是太耗费流量了。如果接入宽带或者WiFi的话，此时右下角就会提示“已连接，但无法访问互联网”，而且带着让人讨厌的感叹号。

![](/images/blog/chromeos-fix-captive-portal/img_1780017788926_0_compressed.jpg)

这篇文章就是讲怎么修复这个感叹号的。

## 这是什么

首先有必要解释一下这个连通性检查是干嘛的，通俗来说就是检查看看你是不是真的连上网，于是它要请求一个空白网站，如果网站正确返回了空白（204），就认为连上网，反之如果返回了页面（200）或重定向（3xx），那么你可能连接到了一个公共wifi，于是拉起登录页面供你完成路由器登录（Captive Portal Login）。

有点像我们打开百度看看网连没连上。

但是如果请求这个端点后很长时间没有响应，或者发现发回了RST，或者请求老是被断开，通常来说因为终结点不大容易下线，那么此时很可能是我们的网络出了问题。于是它就提示“无法连接到互联网”。

然而，谷歌将这个“不大容易下线的终结点”和旧式Android 一样，设置到了 google.com/generate_204 ，而不是哪里都能打开的gstatic.com/generate_204（新AOSP默认用这个）。

但是Android设置这个简单，只要往系统数据库里插两个值就行：

```bash
adb shell settings put global captive_portal_http_url http://cp.cloudflare.com/generate_204
adb shell settings put global captive_portal_https_url https://cp.cloudflare.com/generate_204
```

一开始以为 ChromeOS 可能和 Android 一样，留一个dbus接口或者什么的供用户直接修改，然而这种东西什么的好像是确实不存在的说。

您也可以查看 https://chromium.googlesource.com/chromiumos/platform2/+/HEAD/shill/ 核查，ChromeOS 把终结点检查地址

**硬编码到网络管理工具 shill 里面了！**

那没办法。他硬编码，我只能硬改。

## 先决条件

如果您用的不是 Brunch ，您可能无法获取到 ChromeOS 的 root。为此您可能需要[启用设备的开发者模式](https://www.chromium.org/chromium-os/developer-library/guides/device/developer-mode/)，这可能会重置您的 ChromeOS ，并在启动界面提示**验证已被关闭**等画面。

Google可能认为这是什么所谓**自由的代价**，而我认为这毫无意义。

如果您用的是 Brunch ，那么只要您的 Brunch 引导条目中包含 `cros_debug` 就可以了。

## 解决方案

我把解决方案做成了一个bash script，您可以拉取它直接下载，或者curl下载运行。

https://gist.github.com/SteveZMTstudios/e3beeb227b3b4fd31c22f1ce2eb7bad3

```bash
curl https://gist.githubusercontent.com/SteveZMTstudios/e3beeb227b3b4fd31c22f1ce2eb7bad3/raw/ab901b598e91d74a645340b9ca560c40519329c3/patch_shill.sh | sudo bash
```

<details markdown="1">
<summary>脚本代码</summary>

```bash

#!/bin/bash

usage() {
    cat <<'USAGE'
用法: patch_shill.sh [-r]

  -r    从 .bak 备份恢复原始文件
USAGE
}

restore_mode=false

while getopts ":rh" opt; do
    case "$opt" in
        r) restore_mode=true ;;
        h)
            echo "    编辑 ChromeOS 连通性检查（强制门户）终结点。"
            usage
            exit 0
            ;;
        *)
            echo "错误: 不支持的参数。"
            usage
            exit 1
            ;;
    esac
done
shift $((OPTIND - 1))

if [ "$#" -ne 0 ]; then
    echo "错误: 不支持的参数: $*"
    usage
    exit 1
fi

stop_shill() {
    echo "尝试停止 shill 服务以解除文件占用..."
    if [ -x /sbin/initctl ]; then
        /sbin/initctl stop shill >/dev/null 2>&1 || true
    fi
    if [ -x /sbin/stop ]; then
        /sbin/stop shill >/dev/null 2>&1 || true
    fi
    killall -9 shill >/dev/null 2>&1 || true
}

restart_shill() {
    echo "尝试重启 shill 服务..."

    if [ -x /sbin/initctl ]; then
        if /sbin/initctl restart shill >/dev/null 2>&1; then
            if /sbin/initctl status shill 2>/dev/null | grep -q "start/running"; then
                echo "shill 服务已通过 /sbin/initctl 重启。"
                return 0
            fi
        fi
        if /sbin/initctl stop shill >/dev/null 2>&1 && /sbin/initctl start shill >/dev/null 2>&1; then
            if /sbin/initctl status shill 2>/dev/null | grep -q "start/running"; then
                echo "shill 服务已通过 /sbin/initctl stop/start 重启。"
                return 0
            fi
        fi
    fi

    if [ -x /sbin/stop ] && [ -x /sbin/start ]; then
        /sbin/stop shill >/dev/null 2>&1 || true
        if /sbin/start shill >/dev/null 2>&1; then
            if [ -x /sbin/initctl ] && /sbin/initctl status shill 2>/dev/null | grep -q "start/running"; then
                echo "shill 服务已通过 /sbin/stop 和 /sbin/start 重启。"
                return 0
            fi
            echo "shill 服务已通过 /sbin/stop 和 /sbin/start 发起重启。"
            return 0
        fi
    fi

    echo "未找到可用的服务管理命令，请重启系统以应用更改。"
    return 1
}

get_selinux_context() {
    local target_path="$1"
    if command -v ls >/dev/null 2>&1; then
        ls -Zd "$target_path" 2>/dev/null | awk '{print $4}'
    fi
}

apply_selinux_context() {
    local target_path="$1"
    local context="$2"

    if [ -n "$context" ] && command -v chcon >/dev/null 2>&1; then
        chcon "$context" "$target_path" >/dev/null 2>&1 || true
    fi
}

# 自动检测目标文件位置
if [ -f "shill" ]; then
    FILE="shill"
    BACKUP="shill.bak"
    echo "检测到当前目录下存在 shill，将对当前目录文件进行操作。"
elif [ -f "/usr/bin/shill" ]; then
    FILE="/usr/bin/shill"
    BACKUP="/usr/bin/shill.bak"
    echo "检测到 /usr/bin/shill，将对系统文件进行操作。"
else
    echo "错误: 未找到 shill 文件 (既不在当前目录，也不在 /usr/bin/shill)。"
    exit 1
fi

SHILL_CONTEXT=$(get_selinux_context "$FILE")
if [ -z "$SHILL_CONTEXT" ] && [ "$FILE" = "/usr/bin/shill" ]; then
    SHILL_CONTEXT="u:object_r:cros_shill_exec:s0"
fi

ensure_backup_context() {
    apply_selinux_context "$BACKUP" "$SHILL_CONTEXT"
}

rollback_to_backup() {
    local reason="$1"
    echo "$reason"
    echo "正在回滚到备份: $BACKUP -> $FILE"
    ensure_backup_context
    cp -a "$BACKUP" "$FILE"
    apply_selinux_context "$FILE" "$SHILL_CONTEXT"
    restart_shill || true
    exit 1
}

if [ "$restore_mode" = true ]; then
    if [ ! -f "$BACKUP" ]; then
        echo "错误: 备份文件不存在: $BACKUP"
        exit 1
    fi
    ensure_backup_context
    stop_shill
    echo "正在从备份恢复: $BACKUP -> $FILE"
    cp -a "$BACKUP" "$FILE"
    apply_selinux_context "$FILE" "$SHILL_CONTEXT"
    echo "恢复完成。"
    restart_shill || true
    exit 0
fi

stop_shill

# 创建备份
if [ ! -f "$BACKUP" ]; then
    echo "正在创建备份: $BACKUP"
    cp -a "$FILE" "$BACKUP"
else
    echo "备份文件 $BACKUP 已存在，跳过备份步骤。"
fi

ensure_backup_context

orig_size=$(wc -c < "$FILE" | awk '{print $1}')

# 定义替换函数
# 参数 1: 原 URL
# 参数 2: 新 URL
replace_url() {
    local old_url="$1"
    local new_url="$2"
    
    local old_len=${#old_url}
    local new_len=${#new_url}

    # 检查长度约束
    if [ $new_len -gt $old_len ]; then
        echo "警告: 新 URL ($new_url) 比 原 URL ($old_url) 长，无法安全替换。跳过。"
        return
    fi

    # 计算需要填充的 null 字节数
    local pad_len=$((old_len - new_len))
    
    # 使用 grep -b -F 查找所有匹配项的字节偏移量
    # grep 输出格式为: 偏移量:匹配内容
    local offsets
    offsets=$(LC_ALL=C grep -a -b -o -F -- "$old_url" "$FILE" | cut -d: -f1)

    if [ -z "$offsets" ]; then
        if LC_ALL=C grep -a -q -F -- "$new_url" "$FILE"; then
            echo "已是目标值: $old_url -> $new_url (跳过)"
        else
            echo "未找到目标: $old_url"
        fi
        return
    fi

    for offset in $offsets; do
        local hex_offset
        hex_offset=$(printf '0x%X' "$offset")
        echo "正在替换 (偏移量 $offset, $hex_offset): $old_url -> $new_url (填充 $pad_len 字节)"
        
        # 1. 写入新 URL
        # 使用 printf 确保不输出换行符
        printf "%s" "$new_url" | dd of="$FILE" bs=1 seek="$offset" count="$new_len" conv=notrunc 2>/dev/null
        
        # 2. 写入 null 填充 (如果需要)
        if [ $pad_len -gt 0 ]; then
            dd if=/dev/zero of="$FILE" bs=1 seek=$((offset + new_len)) count="$pad_len" conv=notrunc 2>/dev/null
        fi
    done
}

# 目标 URL 列表与替换策略
# 为了保持多样性，我们将原 URL 分散映射到 google.cn 和 dl.google.com

# 1. http://play.googleapis.com (39 chars) -> http://dl.google.com (31 chars)
replace_url "http://play.googleapis.com/generate_204" "http://dl.google.com/generate_204"

# 2. http://www.googleapis.com (38 chars) -> http://google.cn (29 chars)
replace_url "http://www.googleapis.com/generate_204" "http://google.cn/generate_204"

# 3. https://www.google.com (35 chars) -> https://google.cn (30 chars)
replace_url "https://www.google.com/generate_204" "https://google.cn/generate_204"

# 4. https://accounts.google.com (40 chars) -> https://google.cn (30 chars)
replace_url "https://accounts.google.com/generate_204" "https://google.cn/generate_204"

# 5. http://safebrowsing.google.com (43 chars) -> http://dl.google.com (31 chars)
replace_url "http://safebrowsing.google.com/generate_204" "http://dl.google.com/generate_204"

# 6. https://clients3.google.com (38 chars) -> https://google.cn (30 chars)
replace_url "https://clients3.google.com/generate_204" "https://google.cn/generate_204"

new_size=$(wc -c < "$FILE" | awk '{print $1}')
if [ "$orig_size" != "$new_size" ]; then
    rollback_to_backup "错误: 文件大小发生变化 ($orig_size -> $new_size)！"
fi

pairs=(
    "http://play.googleapis.com/generate_204|http://dl.google.com/generate_204"
    "http://www.googleapis.com/generate_204|http://google.cn/generate_204"
    "https://www.google.com/generate_204|https://google.cn/generate_204"
    "https://accounts.google.com/generate_204|https://google.cn/generate_204"
    "http://safebrowsing.google.com/generate_204|http://dl.google.com/generate_204"
    "https://clients3.google.com/generate_204|https://google.cn/generate_204"
)

verify_ok=1
for p in "${pairs[@]}"; do
    old=${p%%|*}
    new=${p#*|}
    old_count=$(LC_ALL=C grep -a -o -F -- "$old" "$FILE" | wc -l)
    new_count=$(LC_ALL=C grep -a -o -F -- "$new" "$FILE" | wc -l)

    if [ "$old_count" -ne 0 ] || [ "$new_count" -eq 0 ]; then
        echo "校验失败: $old -> $new (old=$old_count, new=$new_count)"
        verify_ok=0
    else
        echo "校验通过: $old -> $new"
    fi
done

if [ "$verify_ok" -eq 1 ]; then
    echo "修补完成，校验通过。"
    restart_shill || true
else
    rollback_to_backup "修补完成，但校验未通过。"
fi

```
</details>


### 如何使用

1. 首先，打开 crosh 控制台。在桌面按下 `Ctrl` + `Alt` + `T`
2. 在其中输入 `shell`并回车
3. 运行 `sudo -i` 
4. 粘贴以下命令到终端：
```bash
curl https://gist.githubusercontent.com/SteveZMTstudios/e3beeb227b3b4fd31c22f1ce2eb7bad3/raw/ab901b598e91d74a645340b9ca560c40519329c3/patch_shill.sh | sudo bash
```

如果您介意远程命令，那么：  
5. 将此脚本保存到“我的文件”目录下。  
6.    
```bash
   cd /home/chronos/user/MyFiles
```

7.
```bash
   sudo bash patch_shill.sh
```

8. 此时，您会断开所有的网络连接。如果您是有线网络，那么它将自动连接。如果您是WiFi网络（包括手机热点），则可能需要重新连接。

![](/images/blog/chromeos-fix-captive-portal/img_1780021043487_0_compressed.jpg)

如果您无法控制WiFi网络，则可能需要重启您的设备。

9. 如果您出于某些原因想要撤消更改，运行：
```bash
   bash patch_shill.sh -r
```

另外，每次更新 ChromeOS 后，由于 Rootfs被重建，都需要再次执行此脚本。

目前，它在我的 ChromeOS 148 上正常工作。

## 已知问题

这样操作之后第一次关机似乎需要长按电源键强制关机，之后都不需要。

## 运作原理

阅读源代码可知，`shill` 服务请求的强制门户地址都是些 `google.com`，`googleapis.com`，通过替换文件内的硬编码，将它们替换为国内连通性不错的`google.cn`和国内有CDN的`dl.google.com`。


## 小结

ChromeOS 和 Chromebook 似乎又要成为 Google 的弃子了，哎
新的 Googlebook 能走多远呢？

本文撰写自 ChromeOS 148。

![](/images/blog/chromeos-fix-captive-portal/img_1780021024542_0_compressed.jpg)



