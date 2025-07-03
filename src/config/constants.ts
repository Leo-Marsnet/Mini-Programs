/**
 * 全局常量配置
 */

// API 配置
export const API_BASE_URL = process.env.TARO_ENV === 'h5'
  ? 'https://api.example.com'
  : 'https://api.example.com'

export const API_TIMEOUT = 10000 // 10秒超时

export const MAX_RETRY_COUNT = 3 // 最大重试次数

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  OPENID: 'openid'
} as const

// 页面路径
export const PAGE_PATHS = {
  LOGIN: '/pages/login/index',
  PROFILE: '/pages/profile/index',
  HOME: '/pages/index/index'
} as const

// 业务状态码
export const BUSINESS_CODE = {
  SUCCESS: 0,
  SUCCESS_ALT: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const

// 微信小程序相关常量
export const WECHAT_CONFIG = {
  // 用户信息授权描述
  AUTH_DESC: '用于完善会员资料',
  // 获取用户信息的场景值
  AUTH_SCENE: 'getUserProfile'
} as const

// 缓存配置
export const CACHE_CONFIG = {
  // 默认缓存时间（5分钟）
  DEFAULT_TTL: 5 * 60 * 1000,
  // 用户信息缓存时间（30分钟）
  USER_INFO_TTL: 30 * 60 * 1000,
  // 系统信息缓存时间（1小时）
  SYSTEM_INFO_TTL: 60 * 60 * 1000
} as const

// 网络配置
export const NETWORK_CONFIG = {
  // 请求超时时间
  TIMEOUT: API_TIMEOUT,
  // 最大重试次数
  MAX_RETRY: MAX_RETRY_COUNT,
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000,
  // 请求并发限制
  CONCURRENT_LIMIT: 10
} as const

// 环境配置
export const ENV_CONFIG = {
  // 是否为开发环境
  IS_DEV: process.env.NODE_ENV === 'development',
  // 是否为生产环境
  IS_PROD: process.env.NODE_ENV === 'production',
  // 当前平台
  PLATFORM: process.env.TARO_ENV || 'unknown'
} as const
