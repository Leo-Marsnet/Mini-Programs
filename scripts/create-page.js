#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('📄 小程序页面创建工具');
console.log('====================');

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function createPage() {
  try {
    const pageName = await askQuestion('📝 页面名称 (如: profile, order, settings): ');
    const pageTitle = await askQuestion('🏷️  页面标题 (如: 个人中心, 订单列表): ');

    if (!pageName) {
      console.log('❌ 页面名称不能为空');
      return;
    }

    const pageDir = path.join(process.cwd(), 'miniprogram', 'pages', pageName);

    // 检查页面是否已存在
    if (fs.existsSync(pageDir)) {
      console.log(`❌ 页面 ${pageName} 已存在`);
      return;
    }

    // 创建页面目录
    fs.mkdirSync(pageDir, { recursive: true });

    // 创建 .js 文件
    const jsContent = `/**
 * ${pageTitle || pageName} 页面
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '${pageTitle || pageName}'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('${pageName} 页面加载', options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('${pageName} 页面初次渲染完成');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('${pageName} 页面显示');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('${pageName} 页面隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('${pageName} 页面卸载');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('${pageName} 页面下拉刷新');
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('${pageName} 页面上拉触底');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '${pageTitle || pageName}',
      path: '/pages/${pageName}/${pageName}'
    };
  }
});`;

    // 创建 .wxml 文件
    const wxmlContent = `<!--${pageTitle || pageName}页面-->
<view class="${pageName}-container">
  <view class="header">
    <text class="title">{{title}}</text>
  </view>

  <view class="content">
    <text class="description">欢迎来到${pageTitle || pageName}页面</text>
    <!-- 在这里添加页面内容 -->
  </view>
</view>`;

    // 创建 .wxss 文件
    const wxssContent = `/* ${pageTitle || pageName}页面样式 */
.${pageName}-container {
  padding: var(--spacing-md);
  min-height: 100vh;
  background-color: var(--color-bg-default);
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.content {
  padding: var(--spacing-md);
  background-color: var(--color-bg-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  text-align: center;
  display: block;
}`;

    // 创建 .json 文件
    const jsonContent = {
      'navigationBarTitleText': pageTitle || pageName,
      'enablePullDownRefresh': false,
      'usingComponents': {},
    };

    // 写入文件
    fs.writeFileSync(path.join(pageDir, `${pageName}.js`), jsContent);
    fs.writeFileSync(path.join(pageDir, `${pageName}.wxml`), wxmlContent);
    fs.writeFileSync(path.join(pageDir, `${pageName}.wxss`), wxssContent);
    fs.writeFileSync(path.join(pageDir, `${pageName}.json`), JSON.stringify(jsonContent, null, 2));

    // 更新 app.json
    const appJsonPath = path.join(process.cwd(), 'miniprogram', 'app.json');
    if (fs.existsSync(appJsonPath)) {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      const newPagePath = `pages/${pageName}/${pageName}`;

      if (!appJson.pages.includes(newPagePath)) {
        appJson.pages.push(newPagePath);
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
        console.log('✅ 已更新 app.json 页面路径');
      }
    }

    console.log('\n🎉 页面创建成功！');
    console.log(`📁 创建位置: miniprogram/pages/${pageName}/`);
    console.log('📄 包含文件:');
    console.log(`   - ${pageName}.js    (页面逻辑)`);
    console.log(`   - ${pageName}.wxml  (页面结构)`);
    console.log(`   - ${pageName}.wxss  (页面样式)`);
    console.log(`   - ${pageName}.json  (页面配置)`);
    console.log('\n🚀 现在可以在微信开发者工具中预览新页面了！');

  } catch (error) {
    console.error('❌ 创建页面失败:', error.message);
  } finally {
    rl.close();
  }
}

// 运行脚本
createPage();
