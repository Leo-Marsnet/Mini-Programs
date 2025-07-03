# 📋 代码优化迁移指南

## 🚀 优先级操作

### 1. 安装必要的依赖

**安装 Zustand 状态管理库：**
```bash
pnpm add zustand
# 或使用 npm
npm install zustand
```

**可选：安装 Immer 中间件（用于不可变状态更新）：**
```bash
pnpm add immer
# 或使用 npm
npm install immer
```

### 2. 已完成的修复

✅ **修复 API 未定义变量问题**
- 创建了 `src/config/constants.ts` 配置文件
- 修复了 `request.ts` 中的未定义变量

✅ **修复 getUserProfile API 废弃问题**
- 重构了认证流程，现在符合微信小程序最新规范
- 必须在用户点击按钮时调用授权

✅ **创建缺失的页面**
- 新增 `src/pages/login/` 登录页面
- 新增 `src/pages/profile/` 个人资料页面

### 3. 下一步操作

#### 安装 Zustand 后的迁移步骤：

1. **安装依赖：**
   ```bash
   pnpm add zustand immer
   ```

2. **更新页面组件，使用新的状态管理：**
   - 将 `src/pages/index/index.tsx` 中的手动订阅替换为 Zustand hooks
   - 简化组件逻辑，移除手动状态同步

3. **重构 App 组件为函数式组件：**
   - 将 `src/app.tsx` 从 Class 组件改为函数式组件
   - 移除 globalData 相关逻辑

4. **创建 useAuth Hook：**
   - 封装认证相关逻辑
   - 简化页面组件代码

## 🔧 使用示例

### 新的状态管理使用方式

```tsx
// 在组件中使用新的状态管理
import { useUserInfo, useHasLogin, useLogin } from '@/store/global'

const MyComponent = () => {
  const userInfo = useUserInfo()
  const hasLogin = useHasLogin()
  const login = useLogin()

  // 不再需要手动订阅和状态同步
  return (
    <View>
      {hasLogin ? (
        <Text>欢迎, {userInfo?.nickname}</Text>
      ) : (
        <Button onClick={handleLogin}>登录</Button>
      )}
    </View>
  )
}
```

### 认证 Hook 示例

```tsx
// 创建 useAuth Hook
import { useGlobalStore } from '@/store/global'
import { performAuthLogin, performLogout } from '@/utils/auth'

export const useAuth = () => {
  const { userInfo, hasLogin, login, logout } = useGlobalStore()

  const handleLogin = async () => {
    const result = await performAuthLogin()
    login(result.userInfo, result.openid)
  }

  const handleLogout = async () => {
    await performLogout()
    logout()
  }

  return {
    userInfo,
    hasLogin,
    login: handleLogin,
    logout: handleLogout
  }
}
```

## 🎯 架构优势

### 原有问题：
- 复杂的自定义状态管理库维护成本高
- 手动订阅模式容易出错
- Class 组件与现代 React 范式不符

### 新架构优势：
- ✅ **类型安全**: 完整的 TypeScript 支持
- ✅ **开发工具**: 支持 Redux DevTools
- ✅ **性能优化**: 精确的重渲染控制
- ✅ **代码简洁**: 大幅减少样板代码
- ✅ **社区支持**: 成熟的生态系统

## ⚠️ 注意事项

1. **安装依赖后才能使用新的状态管理**
2. **渐进式迁移**：可以先保留旧的 store.ts，逐步迁移页面
3. **测试**：每迁移一个页面后，请确保功能正常
4. **备份**：建议在迁移前备份当前代码

## 📞 技术支持

如遇到迁移问题，请参考：
- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [TypeScript 集成指南](https://github.com/pmndrs/zustand#typescript)
