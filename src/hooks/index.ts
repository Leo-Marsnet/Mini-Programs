/**
 * 自定义 Hooks 统一导出
 */
export {
  useLoading,
  useAsyncData,
  useFormSubmit,
  useBatchOperation
} from './use-loading'

export {
  useAuth
} from './use-auth'

export {
  usePerformance,
  usePagePerformance,
  getGlobalPerformanceData,
  clearPerformanceData,
  exportPerformanceData
} from './use-performance'

// use-request.ts 已删除
// 如需复杂数据获取功能，建议使用 TanStack Query
// 详见：./TANSTACK_QUERY_EVALUATION.md
