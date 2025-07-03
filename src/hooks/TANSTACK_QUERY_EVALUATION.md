# TanStack Query 评估报告

## 📊 当前状况分析

### 现有 use-request.ts 状况
- **代码量**: 529行复杂实现
- **功能覆盖**: 缓存、重试、轮询、分页、乐观更新等
- **实际使用**: ❌ **0次使用** - 完全没有被项目使用
- **问题**: 过度设计，增加了代码复杂性但无实际价值

### 项目网络请求现状
- **当前使用**: 仅使用基础的 `request.get/post` 方法
- **复杂度**: 低 - 主要是简单的API调用
- **数据管理**: 通过 Zustand 管理状态，无复杂的服务端状态同步需求

## 🎯 建议方案

### 短期建议（立即执行）
1. **删除冗余代码**: 移除未使用的 `use-request.ts` 文件
2. **保持简洁**: 继续使用简单的 request 工具 + Zustand 组合
3. **代码清理**: 减少项目复杂性，提高维护性

### 长期考虑（按需引入）
当项目出现以下需求时，再考虑引入 TanStack Query：
- 复杂的数据获取和缓存需求
- 频繁的服务端状态同步
- 需要后台数据更新、重新验证
- 复杂的分页、无限滚动
- 乐观更新、数据同步冲突处理

## 📈 TanStack Query vs 自定义Hook对比

| 特性 | TanStack Query | 自定义 use-request.ts | 当前项目需求 |
|-----|----------------|---------------------|-------------|
| 代码维护 | ✅ 社区维护 | ❌ 需要自己维护 | 🎯 简单最佳 |
| 学习成本 | 📚 中等 | 📖 需要理解实现 | 🎯 低成本优先 |
| 包大小 | 📦 ~13KB | 📦 自定义代码 | 🎯 轻量优先 |
| 功能完整性 | ✅ 非常完善 | ⚠️ 功能有限 | 🎯 够用就好 |
| 类型安全 | ✅ 完善 | ⚠️ 需要完善 | 🎯 必需 |
| 生态系统 | ✅ 丰富 | ❌ 无 | 🎯 暂不需要 |

## 💡 实施建议

### Phase 1: 代码清理（本次优化）
```bash
# 删除未使用的文件
rm src/hooks/use-request.ts

# 从 index.ts 中移除导出
# export { useRequest, useGet, usePost, usePut, useDelete, usePagination } from './use-request'
```

### Phase 2: 监控需求变化
在以下情况下重新评估：
- API调用频率显著增加
- 需要复杂的数据缓存策略
- 出现数据同步问题
- 用户反馈性能问题

### Phase 3: 渐进式迁移（如需要）
如果未来引入 TanStack Query：
```typescript
// 安装依赖
pnpm add @tanstack/react-query

// 简单的迁移示例
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => request.get(`/api/user/${userId}`)
})
```

## 🎯 结论

**当前阶段不建议引入 TanStack Query**

**理由：**
1. 项目网络请求需求简单
2. 现有复杂Hook未被使用，说明过度设计
3. 保持代码简洁性和可维护性更重要
4. Zustand + 基础request已满足当前需求

**行动计划：**
- ✅ 删除未使用的复杂Hook代码
- ✅ 继续使用现有简洁方案
- 📝 建立需求监控机制，按需引入
