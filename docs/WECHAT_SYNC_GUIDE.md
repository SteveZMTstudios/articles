# 微信公众号同步功能指南

## 概览

本博客系统支持将新增文章自动同步到你的微信公众号草稿箱。每当博客有新文章发布后，系统会自动：

1. ✅ 读取新文章并渲染为 HTML
2. ✅ 提取文章中的图片并上传到微信素材库
3. ✅ 替换图片 URL（使用微信 CDN）
4. ✅ 在微信公众号草稿箱中创建草稿供人工审核
5. ✅ 记录同步历史以支持增量同步（避免重复）

**当前版本**：v1.0（Beta）
- ✅ 支持新增文章同步
- ⏳ 更新和删除同步（规划中）
- ⏳ 自动群发（规划中，需要管理员初期确认）

---

## 前置要求

### 1. 微信公众号账号
- 需要一个正常运营的微信公众号（订阅号或服务号均可）
- 可访问「微信公众平台」→「开发」→「基本配置」

### 2. 开发密钥
在微信公众平台获取以下信息：
- **AppID**：公众号的 AppID
- **AppSecret**：开发密钥（需妥善保管！）

获取路径：「微信开发者平台」→「扫码登录」→「我的业务」→「公众号」→「开发密钥」

### 3. IP 白名单配置
⚠️ **重要**：AppSecret 调用的 Token 接口需要 IP 白名单配置。

**问题**：GitHub Actions 的 runner IP 是**动态的**，每次运行都可能不同。微信需要 IP 白名单，所以无法完全依赖自动确认机制。

#### 方案 A（仅供参考）：自动风险确认（可能不可用）

某些微信账号可能支持「风险调用确认」机制，流程如下：

1. 首次陌生 IP（如 GitHub Actions）调用 token 接口
2. 微信可能返回错误码 `40164` 或 `61004`
3. **管理员在公众号的消息列表中可能收到模板消息**
4. 管理员确认后，该 IP 在 1 小时内可用

**现状**：这个机制并非所有账号都启用，特别是个人开发者账号。如果没看到模板消息，说明你的账号不支持此机制。

---

#### **方案 B（推荐）：部署到自己的固定 IP 服务器**

这是最可靠的解决方案：

1. 在自己的服务器上部署此同步脚本（如 VPS、云服务器等）
2. 记录服务器的固定公网 IP
3. 登录微信开发者平台：「我的业务」→「公众号」→「开发密钥」
4. 在 **API IP 白名单** 部分，点击「添加」，输入你的服务器 IP
5. 配置成功后，可随时调用 API（无需等待管理员确认）
6. 在服务器上创建定时任务（如 crontab），定期运行 `npm run wechat:sync`

**优点**：IP 固定，一次配置永久有效

**示例服务器选项**：
- 阿里云轻量应用服务器（¥40/月起，已配置 Node.js）
- DigitalOcean Droplet（$5/月起）
- 自己的 NAS 或家庭服务器（需公网 IP）

---

#### **方案 C（短期测试）：联系微信技术支持**

如果你想继续在 GitHub Actions 上部署，可以：

1. 将实际的错误信息（包括 IP `172.184.172.213`）反馈给微信技术支持
2. 询问是否支持 GitHub Actions 部署或「动态 IP 白名单」功能
3. 某些企业认证账号可能有额外权限

**但注意**：这通常需要企业认证，个人开发者可能不支持。

---

## 快速开始

### Step 1: 本地验证（无需凭据）

确保清单导出和 Markdown 渲染正常工作：

```bash
npm run build     # 生成文章清单
npm run wechat:diagnose  # 诊断（支持本地测试或干运行）
```

你应该看到类似的输出：
```
✅ Found manifest with N posts
✅ Rendered HTML: X chars
✅ Found images: Y
✨ Diagnosis passed. Ready for WeChat sync!
```

### Step 2: 配置凭据

#### 选项 A：GitHub Actions 部署（需要解决 IP 白名单问题）

如果你想在 GitHub Actions 上自动同步，需要：

1. 打开仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 新增以下 Secrets：
   - `WECHAT_APPID`：你的 AppID
   - `WECHAT_APPSECRET`：你的 AppSecret
   - `WECHAT_AUTHOR`（可选）：公众号作者名

3. **解决 IP 白名单问题**（见上方「IP 白名单配置」中的方案 B 或 C）

⚠️ **注意**：仅配置 Secrets 还不够，还需要微信后台的 IP 白名单配置。

#### 选项 B：本地或服务器部署（推荐）

创建 `.env.local` 文件（请勿提交到仓库）：

```bash
export WECHAT_APPID="your_app_id"
export WECHAT_APPSECRET="your_app_secret"
export WECHAT_AUTHOR="你的公众号名"
export WECHAT_ORIGIN="https://blog.stevezmt.top"
```

然后：

```bash
source .env.local  # 或在 Windows PowerShell 中手动设置
npm run wechat:sync
```

如果在自己的服务器上部署，可以创建 crontab 定时任务，定期运行此脚本。

### Step 3: 扩展文章 Front-matter（可选）

在文章的 YAML front-matter 中，可以指定更多选项：

```yaml
---
title: 我的文章
excerpt: 自定义摘要（用于微信公众号）  # 若不指定，自动截取前 150 字符
thumbnail: /images/my-cover.jpg        # 文章封面（可选）
# wechat_sync: true                    # 未来支持按文章级别控制同步开关
---
```

---

## 工作流程

### GitHub Actions 自动同步

当你向 `main` 分支提交新文章并通过 PR 时：

```
PR 合并 → GitHub Actions
  1. Hexo clean && build
  2. 部署到 GitHub Pages
  3. 同步到微信（如已配置 Secrets）
     ├─ 生成待同步清单
     ├─ 获取 access_token（可能需要管理员确认）
     ├─ 逐篇上传图片并创建草稿
     └─ 生成同步报告
  4. 输出摘要到 PR / Workflow 日志
```

### 结果查看

同步完成后：

- **成功**：在微信公众号的「素材管理」→「草稿」中可以看到新草稿
- **报告**：`.github/wechat-sync-report.json` 包含详细的同步记录
- **状态**：`.github/wechat-sync-state.json` 包含已同步 UUID 列表（用于增量同步）

---

## 故障排除

### 错误 `40164`：IP 不在白名单中
**原因**：调用 Token 接口的 IP（如 GitHub Actions runner）未在微信后台的 API IP 白名单中

**为什么会出现这个错误**：
- GitHub Actions 的 runner IP 是动态的，每次运行可能不同
- 微信不支持动态 IP，必须提前配置白名单
- 个人开发者账号通常不支持自动确认机制

**解决方案**（按推荐顺序）：

1. **方案 B：部署到自己的固定 IP 服务器**（最可靠）
   - 在自己的 VPS/服务器上部署脚本
   - 在微信后台配置该服务器的固定 IP
   - 参考上方「IP 白名单配置 - 方案 B」详细步骤

2. **方案 C：联系微信技术支持**
   - 说明你使用 GitHub Actions，IP 是 `172.184.172.213`
   - 询问是否支持「动态 IP 白名单」或其他解决方案
   - 注意：企业认证账号可能有额外权限

3. **临时绕过**（仅用于测试）
   - 在本地计算机运行 `npm run wechat:sync`（如果本机 IP 在白名单中）
   - 手动记录已同步的 UUID（见 `.github/wechat-sync-state.json`）

### 错误 `61004`：IP 白名单配置失败
**原因**：IP 永久不在白名单中（可能被多次拒绝）或配置有误

**解决方案**：
- 等待 1 小时，某些 IP 会自动解禁
- 重新配置 IP 白名单（方案 B）
- 检查 AppSecret 是否正确

### 错误 `40001`：AppSecret 配置错误
**原因**：AppSecret 配置错误或被修改

**解决方案**：
- 检查 Secrets 中的 AppSecret 是否正确
- 确保未误手动重置
- 重新生成 AppSecret 并更新 Secrets

### 错误 `40014`：AppID / AppSecret 权限不足
**原因**：可能是账号权限不足或被限制

**解决方案**：
- 检查账号是否为公众号管理员或开发者
- 确认开发信息已完成配置

### 关键词过滤
**问题**：文章内容包含敏感词汇，微信可能拒绝创建草稿

**解决方案**：
- 调整文章措辞
- 在微信公众平台的内容发布策略中查看具体限制

### 图片上传失败
**问题**：部分图片上传到微信素材库失败

**解决方案**：
- 检查图片格式（支持 JPG、PNG、GIF、BMP）
- 检查图片大小（单张不超过 10MB）
- 检查微信素材库配额（永久素材有数量限制）

---

## 自定义配置

### 修改配置（位于 `_config.yml`）

```yaml
wechat_sync:
  enabled: true                 # 全局启用/禁用
  author: Steve ZMT             # 公众号作者（可覆盖全局 author）
  origin: https://blog.stevezmt.top  # 原文链接基础 URL
  
  content:
    upload_images: true         # 是否上传图片到微信
    keep_original_image_urls: false  # 若 false，默认使用原 URL
  
  sync:
    target: draft               # 目标：draft（推荐）或 publish
    incremental: true           # 增量同步（避免重复）
    max_retries: 3              # 单篇失败重试次数
    timeout_ms: 30000           # API 超时时间
```

### 手动触发同步

```bash
# 本地
npm run wechat:sync

# GitHub Actions（手动触发）
# 在 GitHub 仓库的 Actions 标签页，选择 "Hexo Deploy" workflow，点击 "Run workflow"
```

---

## FAQ

**Q: 如果微信认证失败怎么办？**
A: 当前版本正确处理失败情况，不会中断站点部署。同步步骤会输出诊断错误，供排查。

**Q: 我的博客有 1000 篇文章，都会一次性同步吗？**
A: 首版仅支持增量同步（自上次同步以来的新增文章）。如无历史同步记录，首次构建会反映所有未同步的文章。可分批手动调整。

**Q: 图片如果太多，会不会超时？**
A: 是的。每篇文章的 API 调用超时设为 30 秒。如文章图片特别多，可能超时。可通过配置 `timeout_ms` 调整。

**Q: 可以选择性同步某些文章吗？**
A: 当前不支持 front-matter 级别的开关（计划中）。所有满足条件的文章都会同步。

**Q: 同步失败了，能重试吗？**
A: 可以。只要文章的 `uuid` 未被记录为已同步，重新运行同步脚本即可。

---

## 技术细节

### 清单生成（Hexo 钩子）

在 Hexo 的 `generateAfter` 钩子触发时，脚本会：
1. 读取所有文章
2. 过滤：layout=post、非草稿、有 uuid、发布时间 ≤ 当前
3. 比对历史状态，仅导出未同步的文章
4. 输出 JSON 清单到 `.github/wechat-posts-to-sync.json`

### 文章渲染（运行时）

同步脚本读取清单后：
1. 用 markdown-it 重新渲染 Markdown 源文件
2. 用白名单过滤 HTML 标签（安全清洗）
3. 提取 `<img src>` 并上传到微信
4. 替换原 URL 为微信 CDN URL

### 幂等性保证

- 文章 `uuid` 作为全局唯一键
- 状态文件记录已同步的 uuid
- 同一 uuid 不会重复创建草稿

---

## 贡献与反馈

遇到问题，欢迎在 GitHub Issues 中反馈或提交 PR！

---

**最后修改**：2026 年 4 月 15 日
**维护者**：GitHub Copilot 辅助开发
