# Taro + React 多端开发项目

基于 **Taro 3.x + React 18** 的跨端应用开发框架，支持小程序、H5、APP等多平台。

## 🚀 项目特性

- **🔧 技术栈**: Taro 3.x + React 18 + TypeScript
- **📱 多端支持**: 微信小程序、H5、React Native
- **🎨 现代化UI**: 原子化CSS + SCSS预处理器
- **📦 模块化架构**: 清晰的目录结构和关注点分离
- **⚡ 开发体验**: TypeScript类型支持、ESLint代码规范
- **🔄 状态管理**: 内置轻量级状态管理方案
- **🌐 网络请求**: 完整的请求封装，支持拦截器和错误处理
- **💾 本地存储**: 统一的存储API，支持过期时间

## 📁 项目结构

```
├── src/                    # 源代码目录
│   ├── app.tsx            # 应用入口文件
│   ├── app.config.ts      # 全局配置文件
│   ├── app.scss          # 全局样式文件
│   ├── pages/            # 页面目录
│   │   └── index/        # 首页
│   │       ├── index.tsx # 页面组件
│   │       ├── index.config.ts # 页面配置
│   │       └── index.scss # 页面样式
│   ├── components/       # 公共组件
│   ├── utils/           # 工具函数
│   │   ├── storage.ts   # 本地存储工具
│   │   ├── request.ts   # 网络请求工具
│   │   ├── loading.ts   # 加载状态管理
│   │   ├── store.ts     # 状态管理
│   │   └── auth.ts      # 用户认证工具
│   ├── assets/          # 静态资源
│   └── config/          # 配置文件
├── config/              # 构建配置
│   ├── index.js        # 基础配置
│   ├── dev.js          # 开发环境配置
│   └── prod.js         # 生产环境配置
├── miniprogram/         # 编译输出目录 (小程序)
├── dist/               # 编译输出目录 (H5)
├── tsconfig.json       # TypeScript 配置
├── global.d.ts         # 全局类型定义
└── package.json        # 项目依赖
```

## 🛠️ 开发环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0
- 微信开发者工具 (小程序开发)

## 📦 安装

### 🔧 权限配置（Windows用户）

> **MAC用户跳过本段**

Windows 可能会遇到权限问题，可以先运行以下指令来避免权限问题：
```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 📥 安装步骤

```bash
# 克隆项目
git clone <project-url>
cd Mini-Programs

# 安装依赖
npm install
# 或
yarn install
```

## 🚀 快速开始

### 开发命令

```bash
# 微信小程序开发模式
npm run dev:weapp

# H5开发模式
npm run dev:h5

# 生产构建 - 微信小程序
npm run build:weapp

# 生产构建 - H5
npm run build:h5
```

### 开发工具配置

1. **Cursor/VSCode** - 主要开发环境
   - 用于代码编辑、版本控制、项目管理
   - 运行构建命令: `npm run dev:weapp`

2. **微信开发者工具** - 小程序调试
   - 导入 `miniprogram` 目录 (编译输出)
   - 用于预览、调试、真机测试、发布

## 📝 开发指南

### 创建新页面

1. 在 `src/pages/` 下创建页面目录
2. 创建页面文件 `index.tsx`
3. 创建页面配置 `index.config.ts`
4. 创建页面样式 `index.scss`
5. 在 `src/app.config.ts` 中注册页面路径

```typescript
// src/pages/example/index.tsx
import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

const Example: React.FC = () => {
  return (
    <View className="container">
      <Text>新页面</Text>
    </View>
  )
}

export default Example
```

```typescript
// src/pages/example/index.config.ts
import { PageConfig } from '@tarojs/taro'

const config: PageConfig = {
  navigationBarTitleText: '示例页面'
}

export default config
```

### 状态管理

```typescript
import store from '../../utils/store'

// 设置用户信息
store.setUserInfo(userInfo)

// 获取用户信息
const userInfo = store.getUserInfo()

// 订阅状态变化
const unsubscribe = store.subscribe((state) => {
  console.log('状态更新:', state)
})

// 取消订阅
unsubscribe()
```

### 网络请求

```typescript
import request from '../../utils/request'

// GET请求
const data = await request.get('/api/users')

// POST请求
const result = await request.post('/api/login', {
  username: 'user',
  password: 'password'
})

// 带加载状态的请求
const result = await request.post('/api/data', {}, {
  showLoading: true,
  loadingText: '提交中...'
})
```

### 本地存储

```typescript
import storage from '../../utils/storage'

// 基础存储
storage.set('key', 'value')
const value = storage.get('key')

// 带过期时间的存储
storage.setWithExpiry('key', data, 24 * 60 * 60 * 1000) // 24小时
const data = storage.getWithExpiry('key')
```

### 用户认证

```typescript
import {
  performLogin,
  performLogout,
  checkLoginStatus
} from '../../utils/auth'

// 执行登录
try {
  const { userInfo, openid } = await performLogin()
  console.log('登录成功:', userInfo)
} catch (error) {
  console.error('登录失败:', error)
}

// 检查登录状态
const isLoggedIn = checkLoginStatus()

// 退出登录
await performLogout()
```

## 🎨 样式开发

### 响应式单位

```scss
.container {
  width: 750px;        // 自动转换为 rpx
  padding: 20px;       // 自动转换为 rpx
  font-size: 32px;     // 自动转换为 rpx
}
```

### 原子化CSS类

```scss
// 间距
.p-10 { padding: 10px; }
.m-20 { margin: 20px; }

// 文字
.text-center { text-align: center; }
.text-bold { font-weight: bold; }

// 布局
.flex { display: flex; }
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## 🔧 配置说明

### 环境变量

```typescript
// 开发环境
process.env.NODE_ENV === 'development'
process.env.TARO_ENV === 'weapp' // 当前编译平台

// 在 config/prod.js 中配置
defineConstants: {
  API_BASE_URL: '"https://api.yourproject.com"',
  VERSION: '"1.0.0"',
  DEBUG: false
}
```

### 平台差异处理

```typescript
import Taro from '@tarojs/taro'

// 获取当前平台
const platform = Taro.getEnv()

if (platform === Taro.ENV_TYPE.WEAPP) {
  // 微信小程序特有逻辑
} else if (platform === Taro.ENV_TYPE.H5) {
  // H5特有逻辑
}

// 条件编译
if (process.env.TARO_ENV === 'weapp') {
  // 小程序代码
}
```

## 📱 多端发布

### 微信小程序

1. 运行 `npm run build:weapp`
2. 打开微信开发者工具
3. 导入 `miniprogram` 目录
4. 点击"上传"按钮发布

### H5版本

1. 运行 `npm run build:h5`
2. 将 `dist` 目录部署到服务器
3. 配置正确的域名和路径

## 🧪 测试

```bash
# 运行测试
npm test

# 运行测试覆盖率
npm run test:coverage
```

## 📚 相关文档

- [Taro 官方文档](https://taro-docs.jd.com/docs/)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 License

[MIT License](LICENSE)

---

**🎯 记住: 源代码在 `src/` 目录，`miniprogram/` 是编译输出目录**

# 微信小程序现代化开发模板

<div align="center">
  <img src="https://img.shields.io/badge/Taro-3.6.21-blue.svg" alt="Taro版本" />
  <img src="https://img.shields.io/badge/React-18.0.0-blue.svg" alt="React版本" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.4-blue.svg" alt="TypeScript版本" />
  <img src="https://img.shields.io/badge/状态-生产就绪-green.svg" alt="项目状态" />
</div>

一个基于 **Taro 3.x + React + TypeScript** 的现代化小程序开发模板，采用**双目录架构**设计，支持多端开发。

## 🏗️ 双目录架构设计

本项目采用**关注点分离**的双目录架构：

```
Mini-Programs/                    # 主目录 (Cursor开发环境)
├── .cursor/                      # Cursor配置
├── src/                          # 源代码目录
│   ├── app.tsx                   # 应用入口
│   ├── pages/                    # 页面目录
│   ├── components/               # 组件目录
│   └── utils/                    # 工具函数
├── config/                       # 配置文件
├── package.json                  # 依赖管理
├── tsconfig.json                 # TypeScript配置
└── miniprogram/                  # 小程序目录 (编译输出)
    ├── app.js                    # 编译后的应用入口
    ├── app.json                  # 应用配置
    ├── pages/                    # 编译后的页面
    ├── project.config.json       # 微信开发者工具配置
    └── sitemap.json              # 搜索配置
```

## 📋 双架构工作流程

### 开发阶段 (主目录)
1. **使用Cursor进行开发**
   ```bash
   # 在主目录下开发
   cd Mini-Programs
   pnpm install

   # 开发模式 (自动编译到miniprogram目录)
   pnpm run dev:weapp
   ```

2. **文件编辑**
   - 在 `src/` 目录下编写源代码
   - 使用 TypeScript + React 语法
   - 享受完整的IDE支持和类型检查

### 调试阶段 (miniprogram目录)
1. **使用微信开发者工具**
   - 打开微信开发者工具
   - 导入项目：选择 `miniprogram/` 目录
   - 进行真机调试和预览

2. **编译输出**
   ```bash
   # 生产环境编译
   NODE_OPTIONS="--openssl-legacy-provider" pnpm run build:weapp

   # 开发环境编译(带watch)
   NODE_OPTIONS="--openssl-legacy-provider" pnpm run dev:weapp
   ```

### 架构优势
- 🔧 **开发体验**：在主目录享受现代化开发工具
- 🚀 **调试便捷**：微信开发者工具直接读取完整项目
- 📁 **关注点分离**：源码与编译产物完全分离
- 🔄 **实时同步**：代码修改自动编译到miniprogram目录

## 🚀 快速开始

### 环境要求
- Node.js 16+ (推荐使用 18.x)
- pnpm 8+
- 微信开发者工具

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd Mini-Programs
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发
```bash
# 开发模式
NODE_OPTIONS="--openssl-legacy-provider" pnpm run dev:weapp

# 生产构建
NODE_OPTIONS="--openssl-legacy-provider" pnpm run build:weapp
```

### 4. 微信开发者工具配置
1. 打开微信开发者工具
2. 导入项目 → 选择 `miniprogram/` 目录
3. 开始调试和真机预览

## 📂 项目结构

### 源代码结构 (`src/`)
```
src/
├── app.tsx                    # 应用入口
├── app.config.ts             # 应用配置
├── app.scss                  # 全局样式
├── pages/                    # 页面目录
│   └── index/
│       ├── index.tsx         # 页面组件
│       ├── index.config.ts   # 页面配置
│       └── index.scss        # 页面样式
├── components/               # 组件目录
├── utils/                    # 工具函数
│   ├── auth.ts              # 认证工具
│   ├── loading.ts           # 加载工具
│   ├── request.ts           # 网络请求
│   └── storage.ts           # 存储工具
└── types/                   # TypeScript类型定义
```

### 工具函数使用

#### 网络请求
```typescript
import { request } from '@/utils/request'

// GET请求
const userData = await request.get('/api/user')

// POST请求
const result = await request.post('/api/login', {
  username: 'admin',
  password: '123456'
})
```

#### 本地存储
```typescript
import storage from '@/utils/storage'

// 存储数据
storage.set('userInfo', { name: '张三', age: 25 })

// 获取数据
const userInfo = storage.get('userInfo')

// 带过期时间的存储
storage.setWithExpiry('token', 'abc123', 24 * 60 * 60 * 1000) // 24小时过期
```

#### 全局状态管理
```typescript
import { useGlobalStore } from '@/utils/store'

const Component = () => {
  const { user, setUser } = useGlobalStore()

  return (
    <View>
      <Text>用户名: {user?.name}</Text>
    </View>
  )
}
```

## 🎯 技术栈

### 核心技术
- **框架**: Taro 3.6.21
- **视图层**: React 18.0.0
- **语言**: TypeScript 5.0.4
- **样式**: SCSS + PostCSS

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **构建工具**: Webpack 5
- **类型检查**: TypeScript

### 工具链
- **状态管理**: Zustand (轻量级)
- **网络请求**: 封装的 Taro.request
- **UI组件**: Taro内置组件
- **样式处理**: 支持 rpx 单位

## 🔧 开发配置

### 环境变量
```bash
# 开发环境
NODE_ENV=development

# 生产环境
NODE_ENV=production
```

### 构建配置
- **开发环境**: `config/dev.js`
- **生产环境**: `config/prod.js`
- **通用配置**: `config/index.js`

## 📱 多端支持

### 小程序平台
- ✅ 微信小程序
- ⚡ 支付宝小程序 (需配置)
- 🎯 字节跳动小程序 (需配置)

### H5平台
```bash
# H5开发
pnpm run dev:h5

# H5构建
pnpm run build:h5
```

## 🚀 部署发布

### 小程序发布
1. 在微信开发者工具中上传代码
2. 在微信公众平台提交审核
3. 审核通过后发布

### H5部署
```bash
# 构建H5版本
pnpm run build:h5

# 部署到服务器
# 产物在 dist/ 目录
```

## 📋 开发规范

### 代码规范
- 使用 ESLint + Prettier 自动格式化
- 遵循 TypeScript 严格模式
- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

### 提交规范
```bash
# 功能开发
git commit -m "feat: 新增用户登录功能"

# 问题修复
git commit -m "fix: 修复登录状态丢失问题"

# 样式调整
git commit -m "style: 调整首页布局"
```

## 🔍 常见问题

### Node.js版本问题
如果遇到 `ERR_OSSL_EVP_UNSUPPORTED` 错误：
```bash
# Windows
$env:NODE_OPTIONS="--openssl-legacy-provider"

# macOS/Linux
export NODE_OPTIONS="--openssl-legacy-provider"
```

### 编译缓存问题
```bash
# 清除编译缓存
rm -rf node_modules/.cache
rm -rf dist/
rm -rf miniprogram/
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者！

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给个Star支持一下！</p>
  <p>📧 有问题或建议？欢迎提交 Issue 或 PR</p>
</div>
