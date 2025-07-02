# 微信小程序开发模板

这是一个生产级的微信小程序开发模板，采用**关注点分离**架构设计。

## 🏗️ 项目架构

本项目采用双目录架构，实现开发工具和小程序代码的完全分离：

```
YOUR-PROJECT-NAME/             # 主项目目录 (Cursor)
├── .cursor/                   # Cursor配置和文档
├── scripts/                   # 辅助脚本
├── test/                      # 测试文件
├── package.json               # 主项目依赖管理
├── README.md                  # 项目说明文档
└── miniprogram/               # 小程序根目录 ⭐
    ├── app.js                 # 应用入口
    ├── app.json               # 应用配置
    ├── app.wxss               # 全局样式
    ├── project.config.json    # 微信项目配置
    ├── pages/                 # 页面目录
    ├── components/            # 自定义组件
    ├── utils/                 # 工具函数
    ├── config/                # 配置文件
    ├── assets/                # 静态资源
    └── cloud/functions/       # 云函数
```

## ✨ 特性

- 🏗️ **架构分离** - 开发工具与小程序代码完全分离
- 🛠️ **丰富工具类** - 网络请求、存储管理、错误处理等
- 🎨 **现代化UI** - 微信设计规范，响应式布局
- 📱 **生产就绪** - 完整的错误处理和性能优化
- 🔧 **开发友好** - TypeScript支持，完善的开发工具配置
- ☁️ **云开发支持** - 集成微信云开发功能

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd <your-project-name>
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境

编辑 `miniprogram/config/env.js`，配置你的环境信息：

```javascript
const configs = {
  develop: {
    cloudEnvId: 'your-dev-env-id',
    apiBaseUrl: 'https://your-dev-api.com'
  },
  release: {
    cloudEnvId: 'your-prod-env-id',
    apiBaseUrl: 'https://your-api.com'
  }
}
```

### 4. 配置小程序信息

在 `miniprogram/project.config.json` 中配置你的 appid：

```json
{
  "appid": "your-miniprogram-appid"
}
```

### 5. 开始开发

1. **用Cursor打开主目录** - 进行代码编辑和项目管理
2. **用微信开发者工具打开 `miniprogram` 目录** - 进行小程序调试

这样两个工具互不冲突，各司其职！

## 🛠️ 核心工具类

项目内置了丰富的工具类，开箱即用：

### 网络请求 (utils/request.js)

```javascript
const { request } = require('../utils/request')

// 基础请求
const data = await request.get('/api/users')
const result = await request.post('/api/login', { username, password })

// 文件上传
const uploadResult = await request.upload('/api/upload', filePath)
```

### 微信API封装 (utils/wx-utils.js)

```javascript
const wxUtils = require('../utils/wx-utils')

// UI反馈
await wxUtils.showToast('操作成功')
await wxUtils.showConfirm('确定删除吗？')

// 页面跳转
await wxUtils.navigateTo('/pages/detail/detail', { id: 123 })

// 权限管理
const hasPermission = await wxUtils.requestPermission('camera')

// 媒体功能
const tempFilePath = await wxUtils.chooseImage()
```

### 本地存储 (utils/storage.js)

```javascript
const storage = require('../utils/storage')

// 普通存储
storage.set('userToken', 'abc123')
const token = storage.get('userToken')

// 带过期时间
storage.setWithExpiry('tempData', data, 24 * 60 * 60 * 1000) // 24小时过期

// 用户相关数据
storage.setUserData('preferences', { theme: 'dark' }, userId)
```

### 全局状态管理 (utils/store.js)

```javascript
const store = require('../utils/store')

// 设置状态
store.setState({ userInfo: { name: 'John' } })

// 获取状态
const userInfo = store.getState('userInfo')

// 订阅状态变化
const unsubscribe = store.subscribe((state) => {
  console.log('状态更新:', state)
})
```

### 格式化工具 (utils/format.js)

```javascript
const format = require('../utils/format')

// 时间格式化
const timeStr = format.formatTime(new Date()) // "2024-01-01 12:00:00"
const relativeTime = format.getRelativeTime(timestamp) // "2小时前"

// 数字处理
const price = format.formatPrice(1234.5) // "¥1,234.50"
const fileSize = format.formatFileSize(1024000) // "1.02 MB"

// 隐私保护
const maskedPhone = format.maskPhone('13812345678') // "138****5678"
```

## 🧩 内置组件

### UI按钮 (components/ui-button)

```xml
<ui-button type="primary" size="large" bind:tap="handleClick">
  确认
</ui-button>
```

### 弹出层 (components/popup)

```xml
<popup show="{{showPopup}}" bind:close="onPopupClose">
  <view class="popup-content">弹出内容</view>
</popup>
```

## 📖 开发指南

### 页面开发

创建新页面的标准结构：

```javascript
// pages/example/example.js
Page({
  data: {
    title: 'Example Page'
  },

  onLoad(options) {
    // 页面加载
  },

  async handleSubmit() {
    try {
      const result = await this.request.post('/api/submit', this.data)
      wx.showToast({ title: '提交成功' })
    } catch (error) {
      this.handleError(error)
    }
  }
})
```

### 组件开发

```javascript
// components/custom-component/index.js
Component({
  properties: {
    title: String,
    visible: Boolean
  },

  data: {
    loading: false
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { data: 'custom-data' })
    }
  }
})
```

## 🔧 开发工具

- **ESLint + Prettier** - 代码规范
- **TypeScript** - 类型检查
- **Less** - CSS预处理
- **Jest** - 单元测试

## 📦 云开发

项目集成微信云开发，支持：

- 云函数 (`miniprogram/cloud/functions/`)
- 云数据库
- 云存储
- 云调用

## 🤝 贡献指南

1. Fork 本项目
2. 创建新的功能分支
3. 提交你的更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🔗 相关链接

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/cloud/)
- [项目更新日志](CHANGELOG.md)
