/**
 * 图标生成脚本
 * 用于创建临时占位图标
 */

const fs = require('fs');
const path = require('path');

// 简单的SVG图标转换为Base64
const createIcon = (svgContent, filename) => {
  // 这里可以使用 svg2png 库或在线转换工具
  console.log(`请使用以下SVG内容创建 ${filename}:`);
  console.log(svgContent);
  console.log('\n');
};

// 首页图标（未选中）
const homeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#7A7E83" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9,22 9,12 15,12 15,22"/>
</svg>
`;

// 首页图标（选中）
const homeActiveIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="#3cc51f" stroke="#3cc51f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9,22 9,12 15,12 15,22"/>
</svg>
`;

// 应用Logo
const logoIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#3cc51f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="m9 12 2 2 4-4"/>
</svg>
`;

// 默认头像
const avatarIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#7A7E83" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</svg>
`;

// 分享默认图片
const shareIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#3cc51f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <circle cx="8.5" cy="8.5" r="1.5"/>
  <path d="m21 15-5-5L5 21"/>
</svg>
`;

console.log('=== 图标生成指南 ===\n');
console.log('请使用以下SVG内容创建对应的PNG图标：\n');

createIcon(homeIcon, 'tab-home.png');
createIcon(homeActiveIcon, 'tab-home-active.png');
createIcon(logoIcon, 'logo.png');
createIcon(avatarIcon, 'default-avatar.png');
createIcon(shareIcon, 'share-default.png');

console.log('转换步骤：');
console.log('1. 复制SVG内容到在线SVG转PNG工具（如：https://convertio.co/zh/svg-png/）');
console.log('2. 设置相应的尺寸（如81x81px）');
console.log('3. 下载PNG文件');
console.log('4. 将文件放置到 src/assets/images/ 目录下');
console.log('\n或者使用设计工具（Figma、Sketch等）创建更专业的图标');
