# PKAS Frontend - React Blog

## 🎯 项目概述

基于 React + Vite 的 Blog 前端应用，支持 SEO、Markdown 渲染和 GEO 功能。

## ✨ 已实现功能

### ✅ 核心功能
- [x] React 18 + Vite 6 项目初始化
- [x] React Router 路由配置
- [x] SEO 支持（react-helmet-async）
- [x] Markdown 渲染（markdown-it）
- [x] Tailwind CSS 样式系统

### ✅ 页面组件
- [x] 首页（Home）- 显示最新文章
- [x] 文章列表页（PostList）- 所有文章列表
- [x] 文章详情页（PostDetail）- Markdown 渲染
- [x] GEO 页面（Geo）- 基础结构

### ✅ 组件
- [x] Layout - 布局组件（Header + Footer）
- [x] SEO - SEO 元数据管理
- [x] MarkdownRenderer - Markdown 内容渲染

### ✅ 数据结构
- [x] TypeScript 类型定义
- [x] 示例数据（posts.json）

## 🚀 快速开始

> 📖 **详细启动指南**：查看 [QUICKSTART.md](./QUICKSTART.md)

### 快速启动（3 步）

```bash
# 1. 安装依赖
cd frontend
npm install --legacy-peer-deps

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:5173
```

### 项目打包

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

> 📦 **详细打包流程**：查看 [QUICKSTART.md](./QUICKSTART.md#-项目打包流程)

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/      # 组件
│   │   ├── Layout.tsx
│   │   ├── SEO.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── pages/           # 页面
│   │   ├── Home.tsx
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   └── Geo.tsx
│   ├── data/            # 数据文件
│   │   └── posts.json
│   ├── types/           # 类型定义
│   │   └── index.ts
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 主应用
│   └── main.tsx         # 入口文件
├── scripts/             # 脚本
│   ├── install-fixed.cjs
│   └── check-install.cjs
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔧 技术栈

- **React 18.3.1** - UI 框架
- **Vite 6.0.1** - 构建工具
- **TypeScript 5.7.2** - 类型系统
- **React Router 6.28.0** - 路由
- **React Helmet Async 2.0.5** - SEO
- **Markdown-it 14.1.0** - Markdown 解析
- **Tailwind CSS 3.4.17** - 样式框架
- **ECharts 5.5.1** - 图表（GEO 功能使用）
- **Recharts 2.15.0** - React 图表库

## 📝 数据格式

文章数据格式（posts.json）：

```json
{
  "id": "unique_id",
  "title": "文章标题",
  "slug": "url-friendly-slug",
  "summary": "文章摘要",
  "tags": ["标签1", "标签2"],
  "created_at": "2026-01-10",
  "content": "Markdown 格式的内容"
}
```

## 🎨 SEO 支持

每个页面都支持动态 SEO 配置：

- `<title>` 标签
- `<meta description>`
- `<meta keywords>`
- Open Graph 标签
- Twitter Card 标签

## 🌍 GEO 功能

GEO 页面已创建基础结构，后续可扩展：

- 访问来源地理位置分析
- GEO 维度数据可视化
- 访问分布热力图
- 地区访问统计

## 📦 依赖管理

项目使用固定版本号，确保稳定性。安装脚本已优化：

- 使用国内镜像源
- 优化安装选项
- 提供诊断工具

## 🔍 检查安装环境

```bash
npm run check:install
```

## 📚 相关文档

- [快速启动指南](./QUICKSTART.md) - 启动和打包流程
- [安装说明](./INSTALL.md) - 详细的安装指南
- [故障排查](./TROUBLESHOOTING.md) - 常见问题解决方案
- [项目文档](../doc/README.md) - 项目设计文档
