**📘 PKAS – Personal Knowledge & Asset System**





> 一个 **个人可控、低成本、AI 友好** 的知识与资产管理系统

> 支持 **Blog 展示 / 后台管理 / 数据完全本地化**





### **🎯 项目目标**





PKAS 用于统一管理个人长期积累的 **知识资产 + 数字资产**，包括：



- 📚 读书笔记 / 大模型思考 / Prompt 感悟
- ✨ 金句与可传播内容
- 🌐 服务器 / 域名 / 成本结构
- 📊 成本控制与资产视图
- 🌍 GEO 维度的访问与分布分析





所有数据 **本地存储、结构化、可迁移**，不依赖重型后端。



------





### **🧱 架构设计**



```
Markdown / CSV / 本地数据
        ↓
Python 离线处理 & 聚合
        ↓
标准化 JSON 数据
        ↓
React 前端（Blog / Dashboard）
```



- **Python**：数据构建器（不是在线后端）
- **React**：展示 & 管理
- **JSON**：唯一数据交换格式
- **Markdown**：内容源，长期可读





------





### **✨ 核心特性**





- ✅ Markdown 驱动内容（天然适合写作与 AI 生成）
- ✅ Blog & Admin 同一套前端
- ✅ SEO 友好（静态可部署）
- ✅ 数据完全可控（无厂商锁定）
- ✅ 可平滑升级为 API / SaaS





------





### **🧠 为什么做这个项目**





> 个人知识、AI 思考、服务器资产、域名成本

> 不应该散落在 Notion、Excel、云厂商后台里。



PKAS 追求的是：

**结构化、长期主义、低依赖、可演进。**



------





### **📦 技术栈**





- Frontend: React 18 + Vite
- Content: Markdown → JSON
- Builder: Python 3
- Charts / GEO: ECharts / Recharts
- Deploy: GitHub Pages / Nginx / OSS





------





### **🚀 Roadmap（简要）**





- 项目结构设计
- React Blog（Markdown + SEO）
- Python 数据构建器
- AI 自动生成内容管道
- 成本 / 资产可视化

---

## 🚀 快速开始

### 前端项目启动（3 步）

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install --legacy-peer-deps

# 3. 启动开发服务器
npm run dev
```

访问：**http://localhost:5173**

> 📖 **详细启动和打包流程**：查看 [QUICKSTART.md](./QUICKSTART.md)

---

## 📚 项目文档

- [快速启动指南](./QUICKSTART.md) - 项目启动和打包流程
- [开发计划](./todo.md) - 详细开发计划和进度
- [项目设计文档](./doc/README.md) - 架构和设计文档
- [前端文档](./frontend/README.md) - 前端项目说明
