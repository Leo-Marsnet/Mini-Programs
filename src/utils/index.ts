/**
 * 工具模块统一导出
 */
export { default as request } from './request'
export { default as storage } from './storage'
export { default as loading } from './loading'
export { default as store } from './store'

// 导出认证相关函数
export {
  performAuthLogin,
  performSilentLogin,
  performLogout,
  checkLoginStatus,
  getCurrentUser,
  getUserOpenId,
  getUserProfile,
  getCurrentOpenId,
  refreshToken,
  needReauthorize
} from './auth'

// 导出类型
export * from '../types/common'
