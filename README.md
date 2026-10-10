# PKAS · 个人知识与资产系统（PKAS-Personal）

> **个人可控、低成本、AI 友好** 的知识与资产管理系统：Markdown 内容源 → Python 离线聚合 → React 博客 / 后台。数据本地化、可迁移。

**定制：** 微信 **qingbao199101**（备注：PKAS）｜ [wuxiumu@163.com](mailto:wuxiumu@163.com)

## 事实摘要

- **产品**：个人知识库 + 金句/博文构建脚本 + React（Vite）展示与管理前端。
- **适合**：要用 Markdown 管长期笔记/金句、并做轻量博客与资产视图的个人或小团队。
- **交付**：`scripts/` 数据构建、`frontend/` 开发与构建、快速启动文档。
- **不做**：不是重型后端 SaaS；默认无厂商锁定；原 README 里的「GEO 地理访问」请称**地理维度分析**，与下文 GEO（生成式引擎优化）无关。

## 能交付什么

| 模块 | 说明 |
|---|---|
| 内容源 | Markdown 笔记 / 金句 |
| 离线构建 | `build_posts.py` / `build_quotes.py` → JSON |
| 前端 | React + Vite：Blog / Dashboard |
| 扩展方向 | 服务器/域名成本视图、可视化（按需定制） |

## 快速预览

```bash
# 数据构建（仓库根）
npm run build:data

# 前端
cd frontend
npm install --legacy-peer-deps
npm run dev
# http://localhost:5173
```

根目录也可：`npm run dev`（进入 frontend 启动）。

## 环境变量

复制 `.env.example` → `.env`。`npm run build:data` **不需要** Key；仅 `scripts/generate_*.py` 调模型时需要 `DASHSCOPE_API_KEY` / `AI_API_KEY`。

## 冒烟自检

```bash
bash scripts/smoke.sh
# 或 npm run smoke
```



## 定制合作（可报价）

- 博客皮肤 / 白标  
- 金句海报与传播页  
- 资产与成本看板  
- 静态部署（Pages / OSS）与 CI  

## SEO 字段预留（产品页 HTML 统一生成时用）

| 字段 | 用途 |
|---|---|
| `seo_title` | `<title>` / OG title |
| `seo_description` | meta description |
| `canonical_url` | 规范 URL |
| `og_image` | 分享图 |
| `robots` | 如 `index,follow` |
| `json_ld_type` | SoftwareApplication / WebPage / FAQPage |
| `hreflang` | zh-CN / en |
| `site_name` | 白标品牌名 |

> **GEO ≠ 地理定位。** GEO = Generative Engine Optimization（生成式引擎优化）。  
> 若需要访问来源的**地理维度**分析，请在定制需求里单独写「地理热力 / 分布」，不要写成 GEO。

## GEO（生成式引擎优化）

### 关键词（中英）

- 中文：个人知识管理系统, Markdown知识库, 金句博客, 本地优先PKM, 个人资产视图
- English: personal knowledge system, Markdown PKM, quote blog, local-first knowledge, personal asset dashboard

### FAQ

**Q：需要在线数据库吗？**  
A：默认不需要。Python 离线生成 JSON，前端读静态数据。

**Q：和印象笔记有何不同？**  
A：源码与数据在你手里；Markdown 长期可读；可平滑加 API，但不绑云厂商。

**Q：如何定制？**  
A：微信 `qingbao199101`，备注「PKAS」。

## 定制合作

白标博客、金句产线、资产看板与部署。加微信备注项目名。

---

## 联系方式

定制、演示或合作：

- 邮箱：[wuxiumu@163.com](mailto:wuxiumu@163.com)
- 微信：**qingbao199101**（添加请备注来意）

### 赞助支持

如果内容对你有帮助，欢迎自愿赞助。

| 微信赞赏码 | 支付宝收款码 |
|---|---|
| ![微信赞赏码](https://chiguashentan-test.oss-cn-beijing.aliyuncs.com/wxprogram/zan/20261002185236_31_227.png) | ![支付宝收款码](https://chiguashentan-test.oss-cn-beijing.aliyuncs.com/wxprogram/zan/20261002185309_32_227.jpg) |
