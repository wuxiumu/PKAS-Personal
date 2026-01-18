# 安装说明

## 快速安装

### 方式一：使用优化脚本（推荐）

```bash
npm run install:fixed
```

### 方式二：直接安装（最简单）

```bash
npm install --legacy-peer-deps
```

### 方式三：使用国内镜像 + 优化选项

```bash
npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund
```

## 环境检查

在安装前，可以运行诊断脚本检查环境：

```bash
npm run check:install
```

## 已配置的优化

项目已配置 `.npmrc` 文件，包含以下优化：

- ✅ 使用国内镜像源（npmmirror.com）
- ✅ 优先使用缓存（prefer-offline）
- ✅ 跳过安全审计（no-audit，加速）
- ✅ 跳过资金信息（no-fund，加速）
- ✅ 兼容旧版依赖（legacy-peer-deps）

## 如果安装仍然很慢

1. **清除缓存后重试**：
   ```bash
   npm cache clean --force
   npm install --legacy-peer-deps
   ```

2. **使用 cnpm**（更快）：
   ```bash
   npm install -g cnpm --registry=https://registry.npmmirror.com
   cnpm install
   ```

3. **使用 yarn**：
   ```bash
   npm install -g yarn
   yarn install
   ```

4. **检查网络**：
   - 确保可以访问 registry.npmmirror.com
   - 检查防火墙/代理设置

## 常见问题

### 问题：启动时提示 `Cannot find module @rollup/rollup-darwin-arm64`

这是 npm 处理可选依赖的已知 bug。解决方法：

1. **使用修复脚本（推荐）**：
   ```bash
   npm run fix:rollup
   ```

2. **手动修复**：
   ```bash
   # 删除 node_modules 和 package-lock.json
   rm -rf node_modules package-lock.json

   # 重新安装
   npm install --legacy-peer-deps

   # 手动安装 Rollup 平台包
   npm install @rollup/rollup-darwin-arm64 --save-optional --legacy-peer-deps
   ```

## 验证安装

安装完成后，运行：

```bash
npm run dev
```

如果看到开发服务器启动（显示 `Local: http://localhost:5173/`），说明安装成功。

