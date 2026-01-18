# 故障排查指南

## 问题：页面启动但没有内容

### ✅ 已修复的问题

1. **TypeScript 类型导入错误** - 已修复为 `import type`
2. **tsconfig 配置错误** - 已移除不存在的 `erasableSyntaxOnly` 选项
3. **样式冲突** - 已清理 `App.css` 中的默认样式

### 🔍 排查步骤

#### 1. 检查开发服务器

```bash
cd frontend
npm run dev
```

应该看到：
```
VITE v6.0.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

#### 2. 检查浏览器控制台

打开浏览器开发者工具（F12 或 Cmd+Option+I），查看：

- **Console 标签页**：是否有红色错误信息？
- **Network 标签页**：CSS 和 JS 文件是否成功加载（状态码 200）？

#### 3. 检查页面元素

在浏览器中：
1. 右键点击页面 → "检查元素"
2. 查看 `<div id="root">` 是否有内容
3. 查看是否有 Tailwind CSS 类名（如 `bg-gray-50`, `text-gray-900` 等）

#### 4. 常见问题

**问题 A：页面空白，控制台有错误**

- 检查错误信息
- 确认所有依赖已安装：`npm install --legacy-peer-deps`
- 清除缓存：`rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`

**问题 B：页面有内容但样式不对**

- 确认 Tailwind CSS 已正确加载
- 检查 `src/index.css` 是否包含 `@tailwind` 指令
- 检查 `tailwind.config.js` 的 `content` 配置

**问题 C：JSON 数据加载失败**

- 检查 `src/data/posts.json` 文件是否存在
- 检查 JSON 格式是否正确（可以使用 JSON 验证器）
- 查看 Network 标签页，确认 JSON 文件是否加载

#### 5. 硬刷新浏览器

- **Windows/Linux**: `Ctrl + Shift + R`
- **macOS**: `Cmd + Shift + R`

#### 6. 清除浏览器缓存

1. 打开开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

### 🛠️ 快速修复命令

```bash
# 1. 停止开发服务器（Ctrl+C）

# 2. 清除并重新安装依赖
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 3. 修复 Rollup（如果遇到 Rollup 错误）
npm run fix:rollup

# 4. 重新启动
npm run dev
```

### 📋 验证清单

- [ ] 开发服务器正常启动（无错误）
- [ ] 浏览器控制台无错误
- [ ] Network 标签页所有资源加载成功
- [ ] `<div id="root">` 有内容
- [ ] Tailwind CSS 样式生效
- [ ] 能看到 "PKAS Blog" 标题
- [ ] 能看到文章列表

### 🆘 仍然无法解决？

1. 检查 Node.js 版本：`node --version`（建议 18+）
2. 检查 npm 版本：`npm --version`
3. 查看完整错误日志
4. 尝试重新构建：`npm run build`

