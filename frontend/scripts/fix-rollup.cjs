#!/usr/bin/env node

/**
 * 修复 Rollup 可选依赖问题
 * 解决 @rollup/rollup-darwin-arm64 缺失的问题
 */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

console.log('🔧 修复 Rollup 可选依赖...\n');

const platform = os.platform();
const arch = os.arch();

let rollupPackage = '';

if (platform === 'darwin') {
  if (arch === 'arm64') {
    rollupPackage = '@rollup/rollup-darwin-arm64';
  } else if (arch === 'x64') {
    rollupPackage = '@rollup/rollup-darwin-x64';
  }
} else if (platform === 'linux') {
  if (arch === 'arm64') {
    rollupPackage = '@rollup/rollup-linux-arm64';
  } else if (arch === 'x64') {
    rollupPackage = '@rollup/rollup-linux-x64';
  }
} else if (platform === 'win32') {
  if (arch === 'x64') {
    rollupPackage = '@rollup/rollup-win32-x64';
  } else if (arch === 'ia32') {
    rollupPackage = '@rollup/rollup-win32-ia32';
  }
}

if (!rollupPackage) {
  console.log(`⚠️  无法识别平台: ${platform} ${arch}`);
  console.log('💡 请手动安装对应的 @rollup/rollup-* 包');
  process.exit(1);
}

console.log(`📦 安装 ${rollupPackage}...`);

try {
  execSync(
    `npm install ${rollupPackage} --save-optional --legacy-peer-deps`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    }
  );
  console.log('\n✅ 修复完成！');
} catch (error) {
  console.error('\n❌ 安装失败:', error.message);
  process.exit(1);
}

