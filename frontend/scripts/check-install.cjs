#!/usr/bin/env node

/**
 * 安装环境诊断脚本
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 检查安装环境...\n');

// 检查 npm 版本
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm 版本: ${npmVersion}`);
} catch (e) {
  console.log('❌ npm 未安装');
  process.exit(1);
}

// 检查镜像源
try {
  const registry = execSync('npm config get registry', { encoding: 'utf-8' }).trim();
  console.log(`📡 镜像源: ${registry}`);
  if (registry.includes('npmmirror.com') || registry.includes('taobao.org')) {
    console.log('   ✅ 已使用国内镜像源');
  } else {
    console.log('   ⚠️  建议切换到国内镜像源以加速安装');
    console.log('   执行: npm config set registry https://registry.npmmirror.com/');
  }
} catch (e) {
  console.log('⚠️  无法检测镜像源');
}

// 检查缓存
try {
  const cachePath = execSync('npm config get cache', { encoding: 'utf-8' }).trim();
  console.log(`💾 缓存路径: ${cachePath}`);

  // 检查缓存大小
  try {
    const cacheSize = execSync(`du -sh "${cachePath}" 2>/dev/null | cut -f1`, { encoding: 'utf-8' }).trim();
    console.log(`   缓存大小: ${cacheSize}`);
  } catch (e) {
    // 忽略错误
  }
} catch (e) {
  console.log('⚠️  无法检测缓存');
}

// 检查网络连接
console.log('\n🌐 测试网络连接...');
try {
  execSync('ping -c 1 registry.npmmirror.com > /dev/null 2>&1', { timeout: 5000 });
  console.log('✅ 可以连接到镜像源');
} catch (e) {
  console.log('❌ 无法连接到镜像源，请检查网络');
}

// 检查 node_modules
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const stats = fs.statSync(nodeModulesPath);
  if (stats.isDirectory()) {
    try {
      const dirs = fs.readdirSync(nodeModulesPath);
      console.log(`\n📦 node_modules 已存在，包含 ${dirs.length} 个包`);
    } catch (e) {
      console.log('\n📦 node_modules 目录存在但无法读取');
    }
  }
} else {
  console.log('\n📦 node_modules 不存在，需要安装依赖');
}

console.log('\n💡 优化建议：');
console.log('   1. 如果安装慢，确保使用国内镜像源');
console.log('   2. 清除缓存: npm cache clean --force');
console.log('   3. 使用脚本安装: npm run install:fixed');
console.log('   4. 或直接使用: npm install --legacy-peer-deps');

