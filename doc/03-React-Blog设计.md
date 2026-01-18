# React Blog 设计

## 目标

> **一个"像 Blog、但不只是 Blog" 的 React 项目**

## 1️⃣ 技术选型

### 推荐方案（最稳）

- **React 18**
- **Vite**
- **react-router**
- **Markdown → HTML**（markdown-it 或 remark）
- **静态 JSON 数据**
- **SEO**：react-helmet-async

### ❌ 不建议现在上 Next.js

原因：明确说了 *后面 Python + AI 自动生成*，不是实时 CMS。

## 2️⃣ Blog 架构设计

### 目录结构

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   └── Tag.tsx
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── SEO.tsx
│   │   └── MarkdownRenderer.tsx
│   │
│   ├── data/
│   │   └── posts.json
│   └── router.tsx
```

## 3️⃣ Markdown 数据模型（关键）

**Python / AI 都围绕这个格式生成**

```json
{
  "id": "llm_thought_001",
  "title": "为什么大模型更像认知放大器",
  "slug": "llm-as-cognition-amplifier",
  "summary": "从工程和认知角度理解 LLM 的本质。",
  "tags": ["AI", "LLM", "认知"],
  "created_at": "2026-01-10",
  "content": "## 正文\n\n这里是 Markdown 内容"
}
```

### 字段说明

- **id**: 唯一标识符
- **title**: 文章标题
- **slug**: URL 友好的标识符
- **summary**: 文章摘要
- **tags**: 标签数组
- **created_at**: 创建日期
- **content**: Markdown 格式的正文内容

## 4️⃣ SEO 设计（React 场景下的重点）

### SEO 组件（核心）

```tsx
<SEO
  title={post.title}
  description={post.summary}
  keywords={post.tags.join(',')}
/>
```

### 生成内容

- `<title>`
- `<meta description>`
- `<meta keywords>`
- OpenGraph（后期加）

### 部署效果

部署到静态服务器后：

- Google 可抓
- Bing 可抓
- 国内搜索也没问题

## 5️⃣ 为什么这个 Blog 非常适合 AI 接管

- AI → 生成 Markdown
- Python → 校验 + build JSON
- React → 自动渲染

👉 **人只负责判断，不负责搬运**

