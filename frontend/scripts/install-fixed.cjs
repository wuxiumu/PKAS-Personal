#!/usr/bin/env node

/**
 * 固定版本号安装脚本（优化版）
 * 使用国内镜像源和优化选项加速安装
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

console.log('📦 开始安装固定版本的依赖（使用国内镜像源）...\n');

// 检查是否已配置镜像源
try {
  const registry = execSync('npm config get registry', { encoding: 'utf-8' }).trim();
  console.log(`📡 当前镜像源: ${registry}\n`);
} catch (e) {
  console.log('⚠️  无法检测镜像源配置\n');
}

// 合并所有依赖
const allDeps = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {})
};

// 构建安装命令 - 一次性安装所有依赖
const depsList = Object.entries(allDeps)
  .map(([name, version]) => `${name}@${version}`)
  .join(' ');

// 优化选项：
// --prefer-offline: 优先使用缓存
// --no-audit: 跳过安全审计（加速）
// --no-fund: 跳过资金信息（加速）
// --legacy-peer-deps: 兼容旧版依赖解析
// --loglevel=error: 只显示错误（减少输出）
const installOptions = [
  '--save-exact',
  '--legacy-peer-deps',
  '--prefer-offline',
  '--no-audit',
  '--no-fund',
  '--loglevel=error'
].join(' ');

try {
  console.log('📥 正在安装所有依赖（一次性安装，更快）...\n');

  // 先安装生产依赖
  const prodDeps = Object.entries(packageJson.dependencies || {})
    .map(([name, version]) => `${name}@${version}`)
    .join(' ');

  if (prodDeps) {
    console.log('📦 安装生产依赖...');
    execSync(`npm install ${installOptions} ${prodDeps}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, npm_config_progress: 'false' }
    });
  }

  // 再安装开发依赖
  const devDeps = Object.entries(packageJson.devDependencies || {})
    .map(([name, version]) => `${name}@${version}`)
    .join(' ');

  if (devDeps) {
    console.log('\n📦 安装开发依赖...');
    execSync(`npm install ${installOptions} --save-dev ${devDeps}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, npm_config_progress: 'false' }
    });
  }

  console.log('\n✅ 所有依赖安装完成！');
  console.log('\n💡 提示：如果安装仍然很慢，可以尝试：');
  console.log('   1. 使用 cnpm: npm install -g cnpm --registry=https://registry.npmmirror.com');
  console.log('   2. 使用 yarn: npm install -g yarn && yarn install');
} catch (error) {
  console.error('\n❌ 安装失败:', error.message);
  console.error('\n💡 建议：');
  console.error('   1. 检查网络连接');
  console.error('   2. 清除缓存: npm cache clean --force');
  console.error('   3. 删除 node_modules 和 package-lock.json 后重试');
  process.exit(1);
}
