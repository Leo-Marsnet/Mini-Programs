# 项目架构指南

## 🏗️ 双目录架构

本项目采用**关注点分离**的双目录架构设计：

```
YOUR-PROJECT-NAME/             # 主项目目录 (Cursor开发环境)
├── .cursor/                   # Cursor配置和文档
├── scripts/                   # 辅助脚本
├── test/                      # 测试文件
├── package.json               # 主项目依赖管理
├── project.config.json        # Cursor开发环境配置
├── README.md                  # 项目说明文档
└── miniprogram/               # 小程序根目录 ⭐⭐⭐
    ├── app.js                 # 应用入口
    ├── app.json               # 应用配置
    ├── app.wxss               # 全局样式
    ├── project.config.json    # 微信开发者工具配置
    ├── sitemap.json           # 搜索配置
    ├── pages/                 # 页面目录
    ├── components/            # 自定义组件
    ├── utils/                 # 工具函数
    ├── config/                # 配置文件
    ├── assets/                # 静态资源
    └── cloud/functions/       # 云函数
```

## 🎯 核心规则

### ⚠️ 关键：所有小程序开发都在 miniprogram 目录下

当用户要求开发小程序功能时，**必须**在 `miniprogram/` 目录下操作：

- ✅ **页面文件**: `miniprogram/pages/`
- ✅ **组件文件**: `miniprogram/components/`
- ✅ **工具类**: `miniprogram/utils/`
- ✅ **配置文件**: `miniprogram/config/`
- ✅ **静态资源**: `miniprogram/assets/`
- ✅ **云函数**: `miniprogram/cloud/functions/`

### ❌ 绝对不要在主目录下创建小程序文件

- ❌ 不要在主目录创建 `pages/`
- ❌ 不要在主目录创建 `components/`
- ❌ 不要修改主目录的 `app.js` 等文件

## 🔧 开发工具分工

### Cursor (主目录)
- 代码编辑和项目管理
- 运行测试和脚本
- 版本控制操作
- 文档编写

### 微信开发者工具 (miniprogram目录)
- 小程序调试和预览
- 真机测试
- 代码上传发布
- 云函数部署

## 📝 文件操作示例

### ✅ 正确操作
```javascript
// 创建新页面
创建文件: miniprogram/pages/profile/profile.js
创建文件: miniprogram/pages/profile/profile.wxml
创建文件: miniprogram/pages/profile/profile.wxss
创建文件: miniprogram/pages/profile/profile.json

// 创建工具函数
创建文件: miniprogram/utils/helpers.js

// 创建组件
创建文件: miniprogram/components/user-card/index.js
```

### ❌ 错误操作
```javascript
// 千万不要这样做！
创建文件: pages/profile/profile.js  ❌
创建文件: utils/helpers.js         ❌
创建文件: components/user-card/index.js  ❌
```

## 🚀 快速检查

开发小程序功能时，请确认：

1. ✅ 文件路径以 `miniprogram/` 开头
2. ✅ 页面已在 `miniprogram/app.json` 中注册
3. ✅ 组件已在相应页面的 `.json` 中引入
4. ✅ 静态资源路径正确引用

## 💡 记忆要点

**⭐ 核心记忆：miniprogram 是小程序的根目录**

- 所有 `.js/.wxml/.wxss/.json` 小程序文件都在此目录下
- 主目录只负责项目管理，不包含小程序源码
- 这样确保两个开发工具完全分离，互不冲突
