# 📋 微信小程序项目模板使用指南

这是一个生产级微信小程序开发模板，采用双目录架构设计。

## 🚀 快速开始

### 1. 基于此模板创建新项目

```bash
# 方法1: 复制模板文件夹
cp -r miniprogram-demo my-new-project
cd my-new-project

# 方法2: 或者 fork/clone 后重命名
git clone <this-template-repo>
cd your-project-name
rm -rf .git  # 移除原有git历史
git init     # 重新初始化git
```

### 2. 运行项目初始化向导 ⭐

```bash
npm run init-project
```

**这个命令会交互式地帮你：**
- ✅ 设置项目名称和描述
- ✅ 配置小程序 AppID
- ✅ 设置作者信息和Git仓库
- ✅ **自动替换所有文档中的占位符**
- ✅ 更新所有配置文件
- ✅ 可选创建基础页面结构

### 3. 安装依赖

```bash
npm run init
```

### 4. 开始开发

1. **Cursor** 打开项目主目录 - 用于代码编辑
2. **微信开发者工具** 打开 `miniprogram/` 目录 - 用于调试预览

## 📝 占位符说明

运行 `npm run init-project` 后，以下占位符会被自动替换：

| 占位符 | 说明 | 替换为 |
|-------|-----|--------|
| `YOUR-PROJECT-NAME` | 项目主目录名称 | 你输入的项目名称 |
| `<your-project-name>` | 命令行中的项目名 | 你输入的项目名称 |
| `your-project-name` | package.json中的项目名 | 你输入的项目名称 |
| `<your-repo-url>` | Git仓库地址 | 你输入的仓库URL |
| `<your-template-repo>` | 模板仓库地址 | 你输入的仓库URL |
| `MINIPROGRAM-DEMO` | 旧的硬编码项目名 | 你输入的项目名称 |

## 🔧 可用的脚本命令

```bash
# 项目初始化（必须先运行）
npm run init-project

# 安装依赖
npm run init

# 快速创建新页面
npm run create-page

# 代码检查和格式化
npm run lint
npm run lint:fix
npm run format

# 测试
npm run test
npm run test:watch
npm run test:coverage
```

## 📁 项目结构（初始化后）

```
your-project-name/             # 你的项目名（主目录）
├── .cursor/                   # Cursor AI配置
│   ├── docs/                  # 架构文档
│   ├── rules/                 # 开发规则
│   └── agents/                # AI代理配置
├── scripts/                   # 辅助脚本
│   ├── init-new-project.js    # 项目初始化脚本
│   └── create-page.js         # 页面生成器
├── test/                      # 测试文件
├── package.json               # 项目配置（已更新）
├── .cursorrules               # Cursor规则（已更新）
└── miniprogram/               # 小程序根目录
    ├── app.js                 # 应用入口
    ├── app.json               # 应用配置
    ├── app.wxss               # 全局样式（微信设计风格）
    ├── project.config.json    # 小程序项目配置（已更新）
    ├── pages/                 # 页面目录
    ├── components/            # 组件库
    ├── utils/                 # 工具函数库
    ├── config/                # 环境配置
    ├── assets/                # 静态资源
    └── cloud/functions/       # 云函数
```

## ⚠️ 重要提醒

### 必须运行初始化脚本
如果不运行 `npm run init-project`，项目文档中会保留占位符，这会造成：
- 文档中显示错误的项目名称
- AI助手可能产生困惑
- 团队成员理解困难

### 双目录架构
- **主目录**: 用Cursor打开，进行代码编辑、测试、项目管理
- **miniprogram/**: 用微信开发者工具打开，进行调试、预览、发布

### 不要混用工具
- ❌ 不要用微信开发者工具编辑主目录文件
- ❌ 不要在主目录下直接创建小程序页面/组件
- ✅ 严格按照双目录架构分工使用

## 🎯 开发流程

1. **创建新功能页面**:
   ```bash
   npm run create-page
   ```

2. **在Cursor中编写业务逻辑**:
   - 页面逻辑: `miniprogram/pages/`
   - 工具函数: `miniprogram/utils/`
   - 组件开发: `miniprogram/components/`

3. **在微信开发者工具中调试**:
   - 实时预览
   - 真机测试
   - 云函数部署

4. **代码提交前检查**:
   ```bash
   npm run lint
   npm run test
   ```

## 🤝 模板贡献

如果你改进了这个模板，欢迎贡献回来：
1. Fork 原模板仓库
2. 在你的项目中测试改进
3. 提交 Pull Request 到模板仓库

---

**🎉 开始你的微信小程序开发之旅吧！**

有问题？查看 `DEVELOPMENT.md` 获取详细的开发指南。
