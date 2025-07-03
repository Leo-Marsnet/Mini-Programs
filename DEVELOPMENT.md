# 微信小程序开发指南

## 项目模板化说明

本项目已配置为微信小程序开发的通用起始模板，采用**关注点分离**的双目录架构，支持 **Cursor + 微信开发者工具** 双工具协作开发。

## 🏗️ 双目录架构说明

- **主目录**: Cursor开发环境，负责代码编辑、项目管理、测试
- **miniprogram目录**: 微信小程序根目录，供微信开发者工具调试预览
- **完全分离**: 两个工具互不冲突，各司其职

## 快速开始新项目

### 1. 复制模板项目
```bash
# 克隆或下载此项目
git clone <your-template-repo>
cd your-new-project

# 重新初始化 git（可选）
rm -rf .git
git init
```

### 2. 配置新项目信息
编辑以下文件，替换为你的项目信息：

**package.json**
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "你的项目描述",
  "repository": {
    "type": "git",
    "url": "你的仓库地址"
  },
  "author": "你的名字"
}
```

**project.config.json**
```json
{
  "appid": "你的小程序AppID",
  "projectname": "你的项目名称"
}
```

**miniprogram/app.json**
根据需要修改小程序的基本配置。

### 3. 安装依赖
```bash
npm run init
```

### 4. 清理示例代码
- 删除不需要的示例页面
- 保留核心文件结构和配置
- 根据需要修改 `miniprogram/app.json` 中的页面路由

## 开发环境配置

### Cursor 配置
项目已预配置 `.vscode/` 目录，包含：
- `settings.json`: 项目特定设置
- `extensions.json`: 推荐扩展列表
- `launch.json`: 调试配置

首次打开项目时，Cursor 会提示安装推荐扩展。

### 微信开发者工具配置
1. 打开微信开发者工具
2. 导入项目，选择项目根目录
3. 确保 AppID 已正确配置

## 开发流程

### 代码开发
使用 **Cursor** 进行代码编辑，支持：
- 智能代码补全
- ESLint 实时检查
- 代码格式化
- Git 版本控制

### 调试测试
使用 **微信开发者工具** 进行调试：
- 实时预览
- 真机调试
- 性能分析
- 代码上传发布

## 技术规范

### JavaScript 编码规范
- 使用 ES2021+ 语法特性
- 优先使用 `const` 和 `let`，避免 `var`
- 使用箭头函数和解构赋值
- 异步操作使用 `async/await`

```javascript
// ✅ 推荐写法
const { request } = require('../utils/request');

const fetchUserData = async (userId) => {
  try {
    const response = await request.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
};
```

### 小程序开发规范
- 页面和组件使用小驼峰命名
- 文件夹使用短横线分隔
- 合理使用 `setData()` 更新数据
- 避免在 `wxml` 中写复杂逻辑

### 工具类使用
- 网络请求统一使用 `utils/request.js`
- 数据存储使用 `utils/storage.js`
- 状态管理使用 `utils/store.js`
- 错误处理使用 `utils/errorHandler.js`

## 项目结构详解

### 核心目录
```
miniprogram/
├── app.js                 # 应用入口，全局生命周期
├── app.json               # 全局配置，页面路由
├── app.wxss               # 全局样式
├── pages/                 # 页面目录
│   └── index/
│       ├── index.js       # 页面逻辑
│       ├── index.json     # 页面配置
│       ├── index.wxml     # 页面结构
│       └── index.wxss     # 页面样式
├── components/            # 自定义组件
├── utils/                 # 工具函数库
├── config/                # 环境配置
├── assets/                # 静态资源
└── cloud/                 # 云开发相关
```

### 工具类说明
- `request.js`: HTTP 请求封装，支持拦截器和重试
- `storage.js`: 本地存储管理，支持过期时间
- `store.js`: 全局状态管理
- `wx-utils.js`: 微信 API 封装
- `format.js`: 数据格式化工具
- `errorHandler.js`: 统一错误处理

## 开发技巧

### 1. 环境切换
```javascript
// config/env.js
const envVersion = __wxConfig.envVersion || 'develop';
const config = configs[envVersion];
```

### 2. 页面生命周期
```javascript
Page({
  onLoad(options) {
    // 页面加载时调用
  },
  onReady() {
    // 页面初次渲染完成时调用
  },
  onShow() {
    // 页面显示/切入前台时触发
  }
});
```

### 3. 组件通信
```javascript
// 父组件向子组件传递数据
<custom-component prop-data="{{data}}" />

// 子组件向父组件传递事件
this.triggerEvent('customEvent', { data: 'value' });
```

### 4. 异步数据加载
```javascript
async loadData() {
  try {
    wx.showLoading({ title: '加载中...' });
    const data = await request.get('/api/data');
    this.setData({ data });
  } catch (error) {
    wx.showToast({ title: '加载失败', icon: 'error' });
  } finally {
    wx.hideLoading();
  }
}
```

## 性能优化

### 1. 数据更新优化
- 只更新变化的数据
- 避免频繁调用 `setData()`
- 使用数据路径更新

### 2. 图片优化
- 使用合适的图片格式和大小
- 实现图片懒加载
- 使用 CDN 加速

### 3. 代码分包
- 合理使用分包加载
- 按功能模块分包
- 预加载重要分包

## 调试技巧

### 1. 真机调试
```bash
# 启用真机调试模式
npm run dev:remote
```

### 2. 性能监控
```javascript
// 使用微信提供的性能监控
wx.reportPerformance(1001, 100); // 上报性能数据
```

### 3. 日志管理
```javascript
// 开发环境输出详细日志
if (config.debug) {
  console.log('调试信息:', data);
}
```

## 发布流程

### 1. 代码检查
```bash
npm run lint        # ESLint 检查
npm run test        # 运行测试
npm run build       # 构建检查
```

### 2. 版本发布
```bash
npm run release     # 发布新版本
```

### 3. 上传代码
使用微信开发者工具上传代码到微信后台

## 常见问题

### 1. 环境配置问题
- 确保 Node.js 版本 >= 14
- 检查 npm 依赖是否完整安装
- 确认微信开发者工具版本兼容

### 2. 代码规范问题
- 运行 `npm run lint:fix` 自动修复
- 检查 ESLint 配置是否正确
- 确保代码符合小程序规范

### 3. 调试问题
- 清除微信开发者工具缓存
- 检查真机网络环境
- 确认 AppID 和权限配置

## 扩展资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [小程序云开发指南](https://developers.weixin.qq.com/miniprogram/dev/cloud/)
- [JavaScript 现代语法指南](https://es6.ruanyifeng.com/)
- [ESLint 配置指南](https://eslint.org/docs/user-guide/configuring)

---

**提示**: 这个模板已经为你配置好了最佳的开发环境，开始编写你的第一个页面吧！
