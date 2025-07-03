/**
 * 全局类型定义文件
 * 为 Taro + React 项目提供类型支持
 */

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

// 小程序API类型补充
declare namespace wx {
  interface RequestOption {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS'
    data?: any
    header?: Record<string, string>
    timeout?: number
    success?: (result: any) => void
    fail?: (error: any) => void
    complete?: () => void
  }
}

// Taro相关类型
declare namespace Taro {
  interface TaroStatic {
    getApp(): App.AppInstance
  }
}

// 应用实例类型
declare namespace App {
  interface AppInstance {
    getUserOpenId(): Promise<string>
    getGlobalData(key: string): any
    setGlobalData(key: string, value: any): void
    globalData?: Record<string, any>
  }
}

// 用户信息类型
interface UserInfo {
  nickName: string
  avatarUrl: string
  gender: number
  city: string
  province: string
  country: string
  language: string
}

// 系统信息类型
interface SystemInfo {
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
  benchmarkLevel: number
  albumAuthorized: boolean
  cameraAuthorized: boolean
  locationAuthorized: boolean
  microphoneAuthorized: boolean
  notificationAuthorized: boolean
  notificationAlertAuthorized: boolean
  notificationBadgeAuthorized: boolean
  notificationSoundAuthorized: boolean
  bluetoothEnabled: boolean
  locationEnabled: boolean
  wifiEnabled: boolean
  safeArea: {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
  }
}

// 页面配置类型
interface PageConfig {
  navigationBarTitleText?: string
  navigationBarBackgroundColor?: string
  navigationBarTextStyle?: 'black' | 'white'
  navigationStyle?: 'default' | 'custom'
  backgroundColor?: string
  backgroundTextStyle?: 'dark' | 'light'
  backgroundColorTop?: string
  backgroundColorBottom?: string
  enablePullDownRefresh?: boolean
  onReachBottomDistance?: number
  disableScroll?: boolean
  disableSwipeBack?: boolean
  usingComponents?: Record<string, string>
}

// Store状态类型
interface StoreState {
  userInfo: UserInfo | null
  hasLogin: boolean
  openid: string | null
  systemInfo: SystemInfo
  globalData: Record<string, any>
}

// API响应类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 请求配置类型
interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  timeout?: number
  showLoading?: boolean
  loadingText?: string
  autoHandleError?: boolean
}

// 分享配置类型
interface ShareConfig {
  title: string
  path: string
  imageUrl?: string
}

// 页面生命周期类型
interface PageLifecycle {
  onLoad?: (options: Record<string, string>) => void
  onShow?: () => void
  onReady?: () => void
  onHide?: () => void
  onUnload?: () => void
  onPullDownRefresh?: () => void
  onReachBottom?: () => void
  onShareAppMessage?: (object: any) => ShareConfig
  onShareTimeline?: () => ShareConfig
  onPageScroll?: (object: { scrollTop: number }) => void
  onTabItemTap?: (object: { index: number; pagePath: string; text: string }) => void
}

// 环境变量类型
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'tt' | 'qq' | 'h5' | 'rn'
    }
  }

  // 全局环境变量（通过 defineConstants 定义）
  const API_BASE_URL: string
  const API_TIMEOUT: number
  const APP_VERSION: string
  const APP_BUILD_TIME: string
  const APP_ENV: string
  const ENABLE_DEBUG: boolean
  const ENABLE_MOCK: boolean
  const ENABLE_VCONSOLE: boolean
  const ENABLE_LOGGER: boolean
  const WECHAT_APPID: string
  const SENTRY_DSN: string
  const ANALYTICS_ID: string
  const CACHE_PREFIX: string
  const CACHE_VERSION: string
  const DEFAULT_PAGE_SIZE: number
  const MAX_UPLOAD_SIZE: number
  const MAX_RETRY_COUNT: number
  const DEBUG_API: boolean
  const DEBUG_STORAGE: boolean
  const DEBUG_PERFORMANCE: boolean
}

export {}
