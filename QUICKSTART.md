# PKAS 项目快速启动指南

## 📋 项目结构

```
PKAS-Personal/
├── frontend/          # React 前端应用
├── doc/              # 项目文档
├── todo.md           # 开发计划
└── README.md         # 项目说明
```

## 🚀 前端项目启动

### 快速启动（3 步）

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install --legacy-peer-deps

# 3. 启动开发服务器
npm run dev
```

访问：**http://localhost:5173**

### 详细流程

#### 第一步：安装依赖

```bash
cd frontend
npm install --legacy-peer-deps
```

**如果安装慢或遇到问题**：

```bash
# 使用优化脚本安装
npm run install:fixed

# 或检查安装环境
npm run check:install
```

#### 第二步：修复 Rollup（如需要）

如果启动时遇到 `Cannot find module @rollup/rollup-darwin-arm64` 错误：

```bash
npm run fix:rollup
```

#### 第三步：启动开发服务器

```bash
npm run dev
```

**成功标志**：
```
VITE v6.0.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 验证启动成功

浏览器应该显示：
- ✅ "PKAS Blog" 标题
- ✅ 导航栏（首页、文章、GEO）
- ✅ 最新 3 篇文章卡片
- ✅ 页脚信息

---

## 📦 前端项目打包

### 开发环境构建

```bash
cd frontend
npm run build
```

### 构建输出

构建完成后，在 `frontend/dist/` 目录生成：

```
dist/
├── index.html          # 入口 HTML
├── assets/
│   ├── index-*.css    # 样式文件
│   └── index-*.js     # JavaScript 文件
```

### 预览构建结果

```bash
npm run preview
```

访问：**http://localhost:4173**

### 生产环境部署

#### 方式一：静态文件部署

1. **构建项目**：
   ```bash
   cd frontend
   npm run build
   ```

2. **部署 dist 目录**：
   - 将 `frontend/dist/` 目录内容上传到静态服务器
   - 配置服务器支持 SPA 路由（所有路由指向 `index.html`）

3. **Nginx 配置示例**：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

#### 方式二：GitHub Pages

1. **安装 gh-pages**：
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **添加部署脚本**（frontend/package.json）：
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **执行部署**：
   ```bash
   npm run deploy
   ```

#### 方式三：Vercel / Netlify

1. **Vercel**：
   - 连接 GitHub 仓库
   - 设置根目录：`frontend`
   - 构建命令：`npm run build`
   - 输出目录：`dist`

2. **Netlify**：
   - 连接 GitHub 仓库
   - 基础目录：`frontend`
   - 构建命令：`npm run build`
   - 发布目录：`frontend/dist`

---

## 🔧 常用命令

### 开发

```bash
cd frontend

# 启动开发服务器
npm run dev

# 检查安装环境
npm run check:install

# 代码检查
npm run lint
```

### 构建

```bash
cd frontend

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 安装相关

```bash
cd frontend

# 使用优化脚本安装
npm run install:fixed

# 修复 Rollup 依赖
npm run fix:rollup
```

---

## 🐛 故障排查

### 问题：启动失败

1. **检查依赖**：
   ```bash
   cd frontend
   npm run check:install
   ```

2. **重新安装**：
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **修复 Rollup**：
   ```bash
   npm run fix:rollup
   ```

### 问题：页面空白

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页是否有错误
3. 查看 Network 标签页，确认资源是否加载
4. 尝试硬刷新：`Cmd + Shift + R`（Mac）或 `Ctrl + Shift + R`（Windows）

详细排查指南：查看 [frontend/TROUBLESHOOTING.md](./frontend/TROUBLESHOOTING.md)

---

## 📝 开发工作流

### 日常开发

```bash
# 1. 启动开发服务器（热重载）
cd frontend
npm run dev

# 2. 在浏览器中打开 http://localhost:5173
# 3. 修改代码后自动刷新
```

### 添加新文章

#### 方式一：使用 Markdown 文件（推荐）

1. 在 `content/posts/` 目录创建新的 `.md` 文件
2. 按照 [Markdown 规范](./doc/05-Markdown规范.md) 编写 Frontmatter 和内容
3. 运行构建脚本生成 JSON：

```bash
# 从项目根目录运行
npm run build:data
```

#### 方式二：直接编辑 JSON（不推荐）

直接编辑 `frontend/src/data/posts.json`，添加新文章对象。

### 完整构建流程

```bash
# 从项目根目录运行

# 1. 构建数据（从 Markdown 生成 JSON）
npm run build:data

# 2. 构建前端
npm run build:frontend

# 或一次性构建
npm run build
```

### 提交前检查

```bash
# 从项目根目录运行

# 1. 构建数据
npm run build:data

# 2. 前端代码检查
cd frontend
npm run lint

# 3. 构建测试
npm run build

# 4. 预览构建结果
npm run preview
```

---

## 🎯 快速参考

| 操作 | 命令 |
|------|------|
| 启动开发服务器 | `cd frontend && npm run dev` |
| 构建生产版本 | `cd frontend && npm run build` |
| 预览构建结果 | `cd frontend && npm run preview` |
| 检查安装环境 | `cd frontend && npm run check:install` |
| 修复 Rollup | `cd frontend && npm run fix:rollup` |

---

## 📚 相关文档

- [前端快速启动](./frontend/QUICKSTART.md) - 前端详细启动指南
- [前端安装说明](./frontend/INSTALL.md) - 前端安装指南
- [前端故障排查](./frontend/TROUBLESHOOTING.md) - 前端问题解决方案
- [项目文档](./doc/README.md) - 项目设计文档
- [开发计划](./todo.md) - 项目开发计划

---

## ✅ 项目状态

**Phase 1：基础可用** ✅ **已完成**

- ✅ React + Vite 项目初始化
- ✅ 所有核心功能实现
- ✅ SEO 支持完成
- ✅ Markdown 渲染完成
- ✅ 项目文档完善

**下一步**：Phase 2 - Python 数据构建

