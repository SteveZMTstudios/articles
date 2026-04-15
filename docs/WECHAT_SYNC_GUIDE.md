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

#### 方案 A（推荐）：自动风险确认（无需手动配置）

**原理**：微信有自动的「风险调用确认」机制，**不需要在后台手动启用**。流程如下：

1. 首次陌生 IP（如 GitHub Actions）调用 token 接口
2. 微信返回错误码 `89503`，**同时**给公众号管理员发送一条**模板消息**
3. **管理员在公众号的消息列表中找到这条消息，点击「确认」**
4. 管理员确认后，该 IP 在 **1 小时内**可用于 API 调用
5. 1 小时后如需继续使用，重复以上流程

**你需要做什么**：
- 配置好 GitHub Secrets（见下方 Step 2）
- 第一次触发 GitHub Actions 工作流
- **耐心等待模板消息**（可能在 1-5 分钟内到达）
- **在公众号消息列表中找到并确认**该消息

**常见问题**：
- Q: 为什么没看到模板消息？  
  A: 检查管理员微信号是否绑定了该公众号；检查消息是否被系统消息过滤；确认 Secrets 中的 AppSecret 是否正确

- Q: 错误码是 `61004` 而不是 `89503`？  
  A: 61004 表示 IP 永久不在白名单中（已被拒绝过多次），需在微信后台手动配置白名单（见方案 B）

#### 方案 B（可选）：手动配置固定 IP 白名单

如果你有自己的固定 IP 服务器，**或者**无法通过风险确认机制，可手动配置：

1. 登录微信开发者平台
2. 找到「我的业务」→「公众号」→「开发密钥」
3. 在 **API IP 白名单** 部分，点击「添加」
4. 输入你的服务器 IP 地址
5. 配置成功后，该 IP 可随时调用（无需等待管理员确认）

**适用场景**：部署在自己服务器上的同步脚本（而非 GitHub Actions）

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

#### GitHub Actions 部署（推荐）

在你的 GitHub 仓库中添加以下 Secrets：

1. 打开仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 新增以下 Secrets：
   - `WECHAT_APPID`：你的 AppID
   - `WECHAT_APPSECRET`：你的 AppSecret
   - `WECHAT_AUTHOR`（可选）：公众号作者名

⚠️ **重要**：配置好后，**保存这些值就可以了**。不需要在微信后台做其他准备。第一次 Actions 运行时会自动触发管理员确认流程（见「方案 A」说明）

**Secrets 安全性**：
- 不要将密钥提交到仓库代码中
- GitHub Secrets 在日志中自动掩码
- 每次 workflow 运行时凭据都会从加密存储中注入

#### 本地测试（开发阶段）

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

### 错误 `61004`：IP 白名单失败
**原因**：调用 Token 接口的 IP 已被永久拒绝（多次拒绝确认后）或 IP 白名单配置有误

**解决方案**：
1. **查看管理员是否误拒了该 IP**
   - 如果之前有过拒绝，该 IP 会被限制约 1 小时
   - 可等待 1 小时后重试

2. **检查 AppSecret 是否正确**
   - AppSecret 错误也会导致权限不足
   - 确认 GitHub Secrets 中的值无误

3. **手动配置 IP 白名单**（见上方「方案 B」）
   - 登录微信开发者平台
   - 在「开发密钥」找到 API IP 白名单
   - 添加 GitHub Actions 的 IP 段（较为复杂，仅推荐作为备选）

4. **部署到自己的服务器**
   - 如果配置白名单太复杂，可在自己的固定 IP 服务器上部署同步脚本（方案 B）

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
