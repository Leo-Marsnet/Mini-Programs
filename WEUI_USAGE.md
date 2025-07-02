# WeUI 使用指南

本项目已完整集成 WeUI v2.3.0 组件库，本文档展示如何使用这些组件。

## 🎨 WeUI 样式变量

### 颜色系统
```css
/* 背景色 */
var(--weui-BG-0)  /* 页面背景 */
var(--weui-BG-1)  /* 容器背景 */
var(--weui-BG-2)  /* 卡片背景 */

/* 文字色 */
var(--weui-FG-0)  /* 主要文字 */
var(--weui-FG-1)  /* 次要文字 */
var(--weui-FG-2)  /* 辅助文字 */

/* 品牌色 */
var(--weui-BRAND) /* 微信绿 #07c160 */
var(--weui-LINK)  /* 链接色 */
var(--weui-RED)   /* 错误/警告 */
```

### 主题切换
```xml
<!-- 支持深色模式 -->
<view class="page" data-weui-theme="{{theme}}">
  <!-- 页面内容 -->
</view>
```

## 📦 常用组件使用

### 1. 列表组件 (Cell)

**页面配置 (.json)**
```json
{
  "usingComponents": {
    "mp-cells": "../../../packageExtend/components/cells/cells",
    "mp-cell": "../../../packageExtend/components/cell/cell"
  }
}
```

**模板文件 (.wxml)**
```xml
<mp-cells title="设置列表">
  <mp-cell
    title="个人信息"
    value="查看详情"
    show-arrow
    bind:tap="onCellTap">
  </mp-cell>

  <mp-cell
    title="通知设置"
    show-arrow
    bind:tap="onNotificationTap">
  </mp-cell>

  <mp-cell
    title="关于我们"
    show-arrow>
  </mp-cell>
</mp-cells>
```

### 2. 按钮组件

**WXML**
```xml
<!-- 主要按钮 -->
<button class="weui-btn weui-btn_primary">确认</button>

<!-- 次要按钮 -->
<button class="weui-btn weui-btn_default">取消</button>

<!-- 警告按钮 -->
<button class="weui-btn weui-btn_warn">删除</button>
```

### 3. 表单组件

**页面配置**
```json
{
  "usingComponents": {
    "mp-form": "../../../packageExtend/components/form/form",
    "mp-form-page": "../../../packageExtend/components/form-page/form-page",
    "mp-cells": "../../../packageExtend/components/cells/cells",
    "mp-cell": "../../../packageExtend/components/cell/cell"
  }
}
```

**WXML**
```xml
<mp-form-page title="用户信息">
  <mp-cells>
    <mp-cell title="姓名">
      <input placeholder="请输入姓名" />
    </mp-cell>

    <mp-cell title="手机号">
      <input type="number" placeholder="请输入手机号" />
    </mp-cell>

    <mp-cell title="邮箱">
      <input type="email" placeholder="请输入邮箱" />
    </mp-cell>
  </mp-cells>

  <view class="weui-btn-area">
    <button class="weui-btn weui-btn_primary">提交</button>
  </view>
</mp-form-page>
```

### 4. 对话框组件

**页面配置**
```json
{
  "usingComponents": {
    "mp-dialog": "../../../packageExtend/components/dialog/dialog"
  }
}
```

**WXML**
```xml
<mp-dialog
  show="{{showDialog}}"
  title="确认删除"
  content="删除后无法恢复，确定要删除吗？"
  show-cancel="{{true}}"
  cancel-text="取消"
  confirm-text="删除"
  bind:cancel="onDialogCancel"
  bind:confirm="onDialogConfirm">
</mp-dialog>

<button class="weui-btn weui-btn_warn" bind:tap="showDeleteDialog">
  删除数据
</button>
```

**JS逻辑**
```javascript
Page({
  data: {
    showDialog: false
  },

  showDeleteDialog() {
    this.setData({ showDialog: true });
  },

  onDialogCancel() {
    this.setData({ showDialog: false });
  },

  onDialogConfirm() {
    // 执行删除逻辑
    console.log('确认删除');
    this.setData({ showDialog: false });
  }
});
```

### 5. 图标组件

**页面配置**
```json
{
  "usingComponents": {
    "mp-icon": "../../../packageExtend/components/icon/icon"
  }
}
```

**WXML**
```xml
<!-- 使用WeUI图标 -->
<mp-icon icon="success" color="#07c160" size="24"></mp-icon>
<mp-icon icon="info" color="#10aeff" size="24"></mp-icon>
<mp-icon icon="warn" color="#fa5151" size="24"></mp-icon>

<!-- 直接使用CSS类 -->
<view class="weui-icon-success"></view>
<view class="weui-icon-info"></view>
<view class="weui-icon-download"></view>
```

### 6. 搜索栏组件

**页面配置**
```json
{
  "usingComponents": {
    "mp-searchbar": "../../../packageExtend/components/searchbar/searchbar"
  }
}
```

**WXML**
```xml
<mp-searchbar
  placeholder="搜索内容"
  value="{{searchValue}}"
  bind:input="onSearchInput"
  bind:confirm="onSearchConfirm"
  bind:clear="onSearchClear">
</mp-searchbar>
```

## 🎯 最佳实践

### 1. 页面布局
```xml
<view class="page" data-weui-theme="{{theme}}">
  <!-- 页面头部 -->
  <view class="page__hd">
    <view class="page__title">页面标题</view>
    <view class="page__desc">页面描述信息</view>
  </view>

  <!-- 页面内容 -->
  <view class="page__bd">
    <!-- WeUI组件内容 -->
  </view>

  <!-- 页面底部 -->
  <view class="page__ft">
    <view class="weui-btn-area">
      <button class="weui-btn weui-btn_primary">主要操作</button>
    </view>
  </view>
</view>
```

### 2. 样式继承
```css
/* 使用WeUI变量保持主题一致性 */
.custom-container {
  background-color: var(--weui-BG-2);
  border: 1px solid var(--weui-FG-3);
  border-radius: 8px;
  padding: 16px;
}

.custom-text {
  color: var(--weui-FG-0);
  font-size: 16px;
}

.custom-link {
  color: var(--weui-LINK);
}
```

### 3. 响应式设计
```css
/* 支持深色模式 */
[data-weui-theme="dark"] .custom-element {
  background-color: var(--weui-BG-1);
}

/* 适配不同屏幕 */
@media screen and (min-width: 1024px) {
  .page__bd {
    max-width: 800px;
    margin: 0 auto;
  }
}
```

## 📚 更多资源

- [WeUI 官方文档](https://weui.io/)
- [微信小程序组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/)
- [项目中的 WeUI 示例页面](../miniprogram/page/extend/)

## ⚡ 快速上手

1. 查看 `miniprogram/page/extend/` 目录下的示例代码
2. 复制需要的组件配置到你的页面
3. 根据需求修改组件属性和样式
4. 使用 WeUI 变量保持设计一致性

---

**提示**: 所有组件都已预置在项目中，直接引用即可使用！
