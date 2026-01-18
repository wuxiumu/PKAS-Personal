# 快速启动指南

## 🚀 项目启动流程

### 前置要求

- Node.js 18+
- npm 10+

### 第一步：安装依赖

```bash
cd frontend
npm install --legacy-peer-deps
```

如果安装遇到问题，可以使用优化脚本：

```bash
npm run install:fixed
```

### 第二步：修复 Rollup（如需要）

如果启动时遇到 `Cannot find module @rollup/rollup-darwin-arm64` 错误：

```bash
npm run fix:rollup
```

### 第三步：启动开发服务器

```bash
npm run dev
```

服务器启动后，访问：**http://localhost:5173**

### 验证启动成功

看到以下输出表示启动成功：

```
VITE v6.0.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

浏览器应该显示：
- ✅ "PKAS Blog" 标题
- ✅ 导航栏（首页、文章、GEO）
- ✅ 最新 3 篇文章卡片
- ✅ 页脚信息

---

## 📦 项目打包流程

### 开发环境构建

```bash
# 1. 进入前端目录
cd frontend

# 2. 构建项目
npm run build
```

### 构建输出

构建完成后，会在 `frontend/dist/` 目录生成：

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
   npm run build
   ```

2. **部署 dist 目录**：
   - 将 `dist/` 目录内容上传到静态服务器
   - 配置服务器支持 SPA 路由（所有路由指向 `index.html`）

3. **Nginx 配置示例**：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

#### 方式二：GitHub Pages

1. **安装 gh-pages**：
   ```bash
   npm install --save-dev gh-pages
   ```

2. **添加部署脚本**（package.json）：
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
   - 设置构建命令：`npm run build`
   - 设置输出目录：`dist`

2. **Netlify**：
   - 连接 GitHub 仓库
   - 构建命令：`npm run build`
   - 发布目录：`dist`

---

## 🔧 常用命令

### 开发

```bash
# 启动开发服务器
npm run dev

# 检查安装环境
npm run check:install

# 代码检查
npm run lint
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 安装相关

```bash
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
   npm run check:install
   ```

2. **重新安装**：
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **修复 Rollup**：
   ```bash
   npm run fix:rollup
   ```

详细排查指南请查看：[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### 问题：页面空白

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页是否有错误
3. 查看 Network 标签页，确认资源是否加载
4. 尝试硬刷新：`Cmd + Shift + R`（Mac）或 `Ctrl + Shift + R`（Windows）

### 问题：样式不生效

1. 确认 Tailwind CSS 已正确安装
2. 检查 `src/index.css` 是否包含 `@tailwind` 指令
3. 检查 `tailwind.config.js` 的 `content` 配置

---

## 📝 开发工作流

### 1. 日常开发

```bash
# 启动开发服务器（热重载）
npm run dev

# 在浏览器中打开 http://localhost:5173
# 修改代码后自动刷新
```

### 2. 添加新文章

编辑 `src/data/posts.json`，添加新文章对象：

```json
{
  "id": "new_post_001",
  "title": "文章标题",
  "slug": "article-slug",
  "summary": "文章摘要",
  "tags": ["标签1", "标签2"],
  "created_at": "2026-01-17",
  "content": "Markdown 格式的内容"
}
```

### 3. 代码检查

```bash
# 运行 ESLint
npm run lint

# 构建检查（TypeScript 类型检查）
npm run build
```

### 4. 提交前检查

```bash
# 1. 代码检查
npm run lint

# 2. 构建测试
npm run build

# 3. 预览构建结果
npm run preview
```

---

## 🎯 快速参考

| 操作 | 命令 |
|------|------|
| 启动开发服务器 | `npm run dev` |
| 构建生产版本 | `npm run build` |
| 预览构建结果 | `npm run preview` |
| 检查安装环境 | `npm run check:install` |
| 修复 Rollup | `npm run fix:rollup` |
| 代码检查 | `npm run lint` |

---

## 📚 相关文档

- [安装说明](./INSTALL.md) - 详细的安装指南
- [故障排查](./TROUBLESHOOTING.md) - 常见问题解决方案
- [项目 README](./README.md) - 项目概述和结构说明

