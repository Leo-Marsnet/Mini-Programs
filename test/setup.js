/**
 * Jest 测试环境设置
 */

// 模拟微信小程序全局对象
global.wx = {
  // 网络请求
  request: jest.fn(),

  // 存储相关
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),

  // 系统信息
  getSystemInfoSync: jest.fn(() => ({
    model: 'iPhone 12',
    system: 'iOS 14.0',
    version: '8.0.0',
    platform: 'ios',
    language: 'zh_CN',
    screenWidth: 375,
    screenHeight: 812,
  })),

  // 用户信息
  getUserInfo: jest.fn(),
  getUserProfile: jest.fn(),

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

  // 登录相关
  login: jest.fn(),
  checkSession: jest.fn(),

  // 支付相关
  requestPayment: jest.fn(),

  // 分享相关
  updateShareMenu: jest.fn(),
  showShareMenu: jest.fn(),
  hideShareMenu: jest.fn(),

  // 文件相关
  downloadFile: jest.fn(),
  uploadFile: jest.fn(),

  // 位置相关
  getLocation: jest.fn(),
  chooseLocation: jest.fn(),

  // 设备相关
  getNetworkType: jest.fn(),
  onNetworkStatusChange: jest.fn(),

  // 其他
  canIUse: jest.fn(() => true),
  getUpdateManager: jest.fn(() => ({
    onCheckForUpdate: jest.fn(),
    onUpdateReady: jest.fn(),
    onUpdateFailed: jest.fn(),
    applyUpdate: jest.fn(),
  })),
};

// 模拟小程序全局函数
global.App = jest.fn();
global.Page = jest.fn();
global.Component = jest.fn();
global.getApp = jest.fn(() => ({
  globalData: {},
  onLaunch: jest.fn(),
  onShow: jest.fn(),
  onHide: jest.fn(),
  onError: jest.fn(),
}));
global.getCurrentPages = jest.fn(() => []);

// 模拟控制台方法（在测试中可能需要）
global.console = {
  ...console,
  // 可以在这里添加自定义的日志处理
};

// 设置测试超时
jest.setTimeout(10000);

// 清理定时器
beforeEach(() => {
  jest.clearAllTimers();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

// 全局测试工具函数
global.testUtils = {
  /**
   * 创建模拟的页面实例
   */
  createMockPage: (options = {}) => {
    return {
      data: {},
      setData: jest.fn(),
      route: 'pages/test/test',
      options: {},
      onLoad: jest.fn(),
      onShow: jest.fn(),
      onReady: jest.fn(),
      onHide: jest.fn(),
      onUnload: jest.fn(),
      ...options,
    };
  },

  /**
   * 创建模拟的组件实例
   */
  createMockComponent: (options = {}) => {
    return {
      data: {},
      properties: {},
      setData: jest.fn(),
      triggerEvent: jest.fn(),
      selectComponent: jest.fn(),
      createSelectorQuery: jest.fn(),
      ...options,
    };
  },

  /**
   * 创建模拟的应用实例
   */
  createMockApp: (options = {}) => {
    return {
      globalData: {},
      onLaunch: jest.fn(),
      onShow: jest.fn(),
      onHide: jest.fn(),
      onError: jest.fn(),
      ...options,
    };
  },

  /**
   * 等待异步操作完成
   */
  waitFor: (fn, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          const result = fn();
          if (result) {
            resolve(result);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, 10);
          }
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },
};

// 错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
