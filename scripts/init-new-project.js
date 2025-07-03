#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('🚀 微信小程序项目初始化工具');
console.log('==================================');

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function initProject() {
  try {
    // 收集项目信息
    const projectName = await askQuestion('📦 项目名称: ');
    const projectDescription = await askQuestion('📝 项目描述: ');
    const appId = await askQuestion('🔑 小程序 AppID: ');
    const author = await askQuestion('👤 作者姓名: ');
    const gitUrl = await askQuestion('🔗 Git 仓库地址 (可选): ');

    console.log('\n⚙️  正在配置项目...\n');

    // 更新 package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.name = projectName || packageJson.name;
      packageJson.description = projectDescription || packageJson.description;
      packageJson.author = author || packageJson.author;

      if (gitUrl) {
        packageJson.repository = {
          type: 'git',
          url: gitUrl,
        };
        packageJson.homepage = gitUrl.replace('.git', '#readme');
        packageJson.bugs = {
          url: gitUrl.replace('.git', '/issues'),
        };
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ 更新 package.json');
    }

    // 更新 project.config.json
    const projectConfigPath = path.join(process.cwd(), 'project.config.json');
    if (fs.existsSync(projectConfigPath)) {
      const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
      projectConfig.projectname = projectName || projectConfig.projectname;
      if (appId) {
        projectConfig.appid = appId;
      }

      fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2));
      console.log('✅ 更新 project.config.json');
    }

    // 更新 project.private.config.json
    const projectPrivateConfigPath = path.join(process.cwd(), 'project.private.config.json');
    if (fs.existsSync(projectPrivateConfigPath)) {
      const projectPrivateConfig = JSON.parse(fs.readFileSync(projectPrivateConfigPath, 'utf8'));
      projectPrivateConfig.projectname = projectName || projectPrivateConfig.projectname;

      fs.writeFileSync(projectPrivateConfigPath, JSON.stringify(projectPrivateConfig, null, 2));
      console.log('✅ 更新 project.private.config.json');
    }

    // 更新 .cursor 文档中的项目名占位符
    if (projectName) {
      updateCursorDocs(projectName, gitUrl);
    }

    // 创建基础页面结构（可选）
    const createBasicPages = await askQuestion('\n🏗️  是否创建基础页面结构？ (y/N): ');
    if (createBasicPages.toLowerCase() === 'y' || createBasicPages.toLowerCase() === 'yes') {
      createBasicPageStructure();
    }

    console.log('\n🎉 项目初始化完成！');
    console.log('\n📋 接下来的步骤:');
    console.log('1. npm run init         # 安装依赖');
    console.log('2. 在微信开发者工具中导入项目');
    console.log('3. 点击【工具 → 构建 npm】');
    console.log('4. 开始开发你的小程序！\n');

  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
  } finally {
    rl.close();
  }
}

function updateCursorDocs(projectName, gitUrl) {
  const cursorFiles = [
    '.cursor/rules/00-project-overview.mdc',
    '.cursor/docs/project-architecture.md',
    'template.cursorrules',
    'README.md',
    'DEVELOPMENT.md',
    '.cursorrules',
  ];

  cursorFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // 替换所有项目名占位符
      content = content.replace(/YOUR-PROJECT-NAME/g, projectName);
      content = content.replace(/<your-project-name>/g, projectName);
      content = content.replace(/your-project-name/g, projectName);
      content = content.replace(/MINIPROGRAM-DEMO/g, projectName);

      // 如果提供了Git URL，替换Git相关占位符
      if (gitUrl) {
        content = content.replace(/<your-repo-url>/g, gitUrl);
        content = content.replace(/<your-template-repo>/g, gitUrl);
      }

      fs.writeFileSync(fullPath, content);
      console.log(`✅ 更新 ${filePath} 中的项目信息`);
    }
  });
}

function createBasicPageStructure() {
  const pagesDir = path.join(process.cwd(), 'miniprogram', 'pages');
  const basicPages = ['home', 'profile', 'settings'];

  basicPages.forEach(pageName => {
    const pageDir = path.join(pagesDir, pageName);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });

      // 创建 .js 文件
      const jsContent = `Page({
  data: {},
  onLoad() {},
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {}
});`;
      fs.writeFileSync(path.join(pageDir, `${pageName}.js`), jsContent);

      // 创建 .wxml 文件
      const wxmlContent = `<view class="${pageName}-container">
  <text>欢迎来到 ${pageName} 页面</text>
</view>`;
      fs.writeFileSync(path.join(pageDir, `${pageName}.wxml`), wxmlContent);

      // 创建 .wxss 文件
      const wxssContent = `.${pageName}-container {
  padding: 20px;
  text-align: center;
}`;
      fs.writeFileSync(path.join(pageDir, `${pageName}.wxss`), wxssContent);

      // 创建 .json 文件
      const jsonContent = {
        'navigationBarTitleText': pageName.charAt(0).toUpperCase() + pageName.slice(1),
      };
      fs.writeFileSync(path.join(pageDir, `${pageName}.json`), JSON.stringify(jsonContent, null, 2));
    }
  });

  // 更新 app.json 中的页面路径
  const appJsonPath = path.join(process.cwd(), 'miniprogram', 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    const newPages = basicPages.map(page => `pages/${page}/${page}`);

    // 将新页面添加到现有页面列表的开头
    appJson.pages = [...newPages, ...appJson.pages];

    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    console.log('✅ 创建基础页面结构');
    console.log('   - home (首页)');
    console.log('   - profile (个人中心)');
    console.log('   - settings (设置)');
  }
}

// 运行脚本
initProject();
