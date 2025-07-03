/**
 * TypeScript 测试环境设置
 */

// 模拟 Taro API
const mockTaro = {
  // 存储相关
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),
  getStorageInfoSync: jest.fn(),

  // 异步存储
  getStorage: jest.fn(),
  setStorage: jest.fn(),
  removeStorage: jest.fn(),
  clearStorage: jest.fn(),
  getStorageInfo: jest.fn(),

  // 系统信息
  getSystemInfoSync: jest.fn(() => ({
    model: 'iPhone 13',
    system: 'iOS 15.0',
    version: '8.0.0',
    platform: 'ios',
    language: 'zh_CN',
    screenWidth: 375,
    screenHeight: 812,
    windowWidth: 375,
    windowHeight: 812,
    pixelRatio: 2,
    statusBarHeight: 44,
    safeArea: {
      top: 44,
      bottom: 812,
      left: 0,
      right: 375,
      width: 375,
      height: 768
    }
  })),

  // 网络请求
  request: jest.fn(),
  downloadFile: jest.fn(),
  uploadFile: jest.fn(),

  // UI相关
  showToast: jest.fn(),
  showModal: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showActionSheet: jest.fn(),

  // 导航相关
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  redirectTo: jest.fn(),
  switchTab: jest.fn(),
  reLaunch: jest.fn(),

  // 用户信息
  getUserProfile: jest.fn(),
  getUserInfo: jest.fn(),

  // 登录相关
  login: jest.fn(),
  checkSession: jest.fn(),

  // 环境判断
  getEnv: jest.fn(() => 'WEAPP'),
  ENV_TYPE: {
    WEAPP: 'WEAPP',
    H5: 'H5',
    APP: 'APP'
  },

  // 其他
  canIUse: jest.fn(() => true),
  getUpdateManager: jest.fn(() => ({
    onCheckForUpdate: jest.fn(),
    onUpdateReady: jest.fn(),
    onUpdateFailed: jest.fn(),
    applyUpdate: jest.fn(),
  })),
}

// 模拟 Taro 模块
jest.mock('@tarojs/taro', () => mockTaro)

// 全局变量
global.process = {
  ...global.process,
  env: {
    ...global.process?.env,
    NODE_ENV: 'test',
    TARO_ENV: 'weapp'
  }
}

// 模拟 window 对象（H5环境）
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com',
    origin: 'https://example.com',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
})

// 模拟 navigator 对象
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  writable: true
})

// 测试工具函数
declare global {
  namespace NodeJS {
    interface Global {
      mockTaro: typeof mockTaro
      testUtils: {
        createMockResponse: (data: any, statusCode?: number) => any
        createMockError: (message: string, statusCode?: number) => any
        waitForPromise: (promise: Promise<any>) => Promise<any>
      }
    }
  }
}

global.mockTaro = mockTaro
global.testUtils = {
  /**
   * 创建模拟的HTTP响应
   */
  createMockResponse: (data: any, statusCode: number = 200) => ({
    statusCode,
    data,
    header: {
      'content-type': 'application/json'
    }
  }),

  /**
   * 创建模拟的错误响应
   */
  createMockError: (message: string, statusCode: number = 400) => ({
    statusCode,
    errMsg: message,
    data: { message }
  }),

  /**
   * 等待Promise完成
   */
  waitForPromise: async (promise: Promise<any>) => {
    try {
      return await promise
    } catch (error) {
      throw error
    }
  }
}

// 设置测试超时
jest.setTimeout(10000)

// 每个测试前的清理
beforeEach(() => {
  jest.clearAllMocks()

  // 重置模拟数据
  mockTaro.getStorageSync.mockReturnValue(null)
  mockTaro.getStorageInfoSync.mockReturnValue({
    keys: [],
    currentSize: 0,
    limitSize: 10240
  })
})

// 每个测试后的清理
afterEach(() => {
  jest.restoreAllMocks()
})

export { mockTaro }
