/**
 * 通用类型定义
 */

// API 响应基础类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
  success?: boolean
}

// 分页数据类型
export interface PaginationData<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 分页响应类型
export interface PaginationResponse<T = any> extends ApiResponse<PaginationData<T>> {}

// 请求配置类型
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  header?: Record<string, string>
  timeout?: number
  retryCount?: number
  retryDelay?: number
  showLoading?: boolean
  loadingText?: string
  autoHandleError?: boolean
  baseURL?: string
}

// HTTP 错误类型
export interface HttpError extends Error {
  code?: number
  statusCode?: number
  data?: any
  config?: RequestConfig
}

// 存储键枚举
export enum StorageKeys {
  TOKEN = 'token',
  USER_INFO = 'userInfo',
  OPENID = 'openid',
  THEME = 'theme',
  LANGUAGE = 'language',
  SETTINGS = 'settings'
}

// 存储项类型（带过期时间）
export interface StorageItem<T = any> {
  value: T
  expiry?: number
}

// 用户信息类型
export interface UserInfo {
  id: string
  nickname: string
  avatar?: string
  gender?: 0 | 1 | 2 // 0: 未知, 1: 男, 2: 女
  country?: string
  province?: string
  city?: string
  language?: string
  phone?: string
  email?: string
  createTime?: string
  updateTime?: string
}

// 系统信息类型
export interface SystemInfo {
  brand: string
  model: string
  pixelRatio: number
  screenWidth: number
  screenHeight: number
  windowWidth: number
  windowHeight: number
  statusBarHeight: number
  language: string
  version: string
  system: string
  platform: string
  fontSizeSetting: number
  SDKVersion: string
}

// 全局状态类型
export interface GlobalState {
  userInfo: UserInfo | null
  hasLogin: boolean
  openid: string | null
  systemInfo: SystemInfo | null
  globalData: Record<string, any>
}

// 加载状态选项
export interface LoadingOptions {
  title?: string
  mask?: boolean
  duration?: number
}

// 模态框选项
export interface ModalOptions {
  title?: string
  content?: string
  showCancel?: boolean
  cancelText?: string
  confirmText?: string
  confirmColor?: string
  cancelColor?: string
}

// 操作菜单选项
export interface ActionSheetOptions {
  itemList: string[]
  title?: string
  itemColor?: string
}

// 操作菜单结果
export interface ActionSheetResult {
  tapIndex: number
  cancel: boolean
}
