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
- 删除不需要的示例页面（`miniprogram/packageAPI/`、`miniprogram/packageComponent/` 等）
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
4. 点击【工具 → 构建 npm】

## 开发工作流

### 日常开发
1. **在 Cursor 中编写代码**
   - 享受 AI 智能补全
   - 实时错误检测和修复建议
   - 代码重构和优化

2. **在微信开发者工具中预览**
   - 实时查看页面效果
   - 使用调试器调试逻辑
   - 真机预览和测试

3. **云开发（可选）**
   - 在微信开发者工具中管理云函数
   - 使用 Cursor 编写云函数代码
   - 云数据库和存储管理

### 代码规范
项目已配置 ESLint 和 Prettier：
```bash
# 检查代码规范
npm run lint

# 自动修复格式问题
npm run lint -- --fix
```

## 项目结构

```
your-project/                    # 主项目目录 (Cursor开发环境)
├── .cursor/                     # Cursor配置和文档
├── scripts/                     # 辅助脚本
├── test/                        # 测试文件
├── package.json                 # 主项目依赖管理
├── project.config.json          # Cursor开发环境配置
├── README.md                    # 项目说明文档
└── miniprogram/                 # 小程序根目录 ⭐
    ├── app.js                   # 小程序入口
    ├── app.json                 # 小程序配置
    ├── project.config.json      # 微信开发者工具配置
    ├── pages/                   # 页面目录
    ├── components/              # 组件目录
    ├── utils/                   # 工具类
    ├── assets/                  # 静态资源
    └── cloud/functions/         # 云函数
```

## 最佳实践

### 1. 目录组织
- `pages/`: 按功能模块组织页面
- `components/`: 可复用组件
- `utils/`: 通用工具函数
- `assets/`: 图片、字体等静态资源

### 2. 代码风格
- 使用 TypeScript 获得更好的类型安全
- 遵循 ESLint 规则
- 组件和页面使用 Less 编写样式

### 3. 性能优化
- 合理使用分包加载
- 图片资源压缩和懒加载
- 避免过度渲染

### 4. 云开发集成
- 云函数统一放在 `miniprogram/cloud/functions/` 目录
- 使用环境变量管理不同环境配置
- 数据库设计遵循小程序最佳实践

## 部署发布

### 1. 构建项目
```bash
# 构建 npm 包
npm run build

# 代码检查
npm run lint
```

### 2. 上传代码
在微信开发者工具中：
1. 点击【上传】
2. 填写版本号和项目备注
3. 上传到微信后台

### 3. 发布流程
1. 登录微信公众平台
2. 提交审核
3. 审核通过后发布

## 常见问题

### Q: 如何添加新页面？
1. 在 `miniprogram/pages/` 下创建页面目录
2. 在 `app.json` 的 `pages` 数组中添加页面路径
3. Cursor 会自动创建对应的 `.js`、`.wxml`、`.wxss` 文件

### Q: 如何调试云函数？
1. 在 Cursor 中打开云函数文件
2. 使用 F5 启动调试，选择"云函数调试"配置
3. 或在微信开发者工具中右键云函数进行本地调试

### Q: 扩展推荐安装失败？
确保 Cursor 已连接到互联网，可以手动搜索安装以下关键扩展：
- `minapp-vscode`: 微信小程序开发支持
- `prettier-vscode`: 代码格式化
- `vscode-less`: Less 语法支持

## 技术栈

- **框架**: 微信小程序原生框架
- **语言**: TypeScript/JavaScript
- **样式**: Less/WXSS
- **构建**: 微信开发者工具 + npm
- **代码质量**: ESLint + Prettier
- **云服务**: 微信云开发
- **IDE**: Cursor (主要) + 微信开发者工具

## 参考资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [Cursor 官网](https://cursor.sh/)

---

**提示**: 这个模板已经为你配置好了最佳的开发环境，开始编写你的第一个页面吧！
