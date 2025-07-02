// 导入配置和工具类
const config = require('./config/env');
const store = require('./utils/store');
const { errorHandler } = require('./utils/errorHandler');

// 全局变量
global.isProduction = true;

App({
  // 应用启动
  onLaunch(options) {
    console.log('App Launch', options);

    // 初始化系统信息
    this.initSystemInfo();

    // 初始化云开发
    this.initCloud();

    // 初始化主题
    this.initTheme();

    // 设置全局错误处理
    this.setupErrorHandler();

    // 处理启动参数
    this.handleLaunchOptions(options);
  },

  // 应用显示
  onShow(options) {
    console.log('App Show', options);

    // 更新全局数据
    this.updateGlobalData();

    // 检查更新
    this.checkUpdate();
  },

  // 应用隐藏
  onHide() {
    console.log('App Hide');

    // 保存必要数据
    this.saveImportantData();
  },

  // 错误处理
  onError(error) {
    console.error('App Error:', error);
    errorHandler.handleError(error, 'App');
  },

  // 页面未找到
  onPageNotFound(res) {
    console.log('Page Not Found:', res);
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },

  // 主题变化
  onThemeChange(res) {
    console.log('Theme Change:', res.theme);
    this.globalData.theme = res.theme;
    store.setState({ theme: res.theme });
  },

  // 初始化系统信息
  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      store.setState({ systemInfo });

      // 设置状态栏高度等全局样式变量
      this.setGlobalStyles(systemInfo);
    } catch (error) {
      errorHandler.handleError(error, 'initSystemInfo');
    }
  },

  // 初始化云开发
  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }

    try {
      wx.cloud.init({
        env: config.cloudEnvId,
        traceUser: true,
      });
      console.log('云开发初始化成功');
    } catch (error) {
      errorHandler.handleError(error, 'initCloud');
    }
  },

  // 初始化主题
  initTheme() {
    const theme = wx.getSystemInfoSync().theme || 'light';
    this.globalData.theme = theme;
    store.setState({ theme });
  },

  // 设置全局错误处理
  setupErrorHandler() {
    // 监听未处理的Promise rejection
    wx.onUnhandledRejection(res => {
      console.error('Unhandled Promise Rejection:', res);
      errorHandler.handleError(res.reason, 'UnhandledPromiseRejection');
    });
  },

  // 处理启动参数
  handleLaunchOptions(options) {
    // 处理分享进入
    if (options.scene === 1007 || options.scene === 1008) {
      this.globalData.shareTicket = options.shareTicket;
    }

    // 处理扫码进入
    if (options.scene === 1011) {
      this.globalData.qrCode = options.query;
    }
  },

  // 更新全局数据
  updateGlobalData() {
    // 更新网络状态
    wx.getNetworkType({
      success: res => {
        this.globalData.networkType = res.networkType;
        store.setState({ networkType: res.networkType });
      },
    });
  },

  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: res => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          },
        });
      });

      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败');
      });
    }
  },

  // 保存重要数据
  saveImportantData() {
    try {
      // 保存用户数据
      if (this.globalData.userInfo) {
        wx.setStorageSync('userInfo', this.globalData.userInfo);
      }
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  },

  // 设置全局样式变量
  setGlobalStyles(systemInfo) {
    // 计算安全区域
    const safeArea = systemInfo.safeArea || {};
    const statusBarHeight = systemInfo.statusBarHeight || 0;

    this.globalData.safeAreaTop = safeArea.top || statusBarHeight;
    this.globalData.safeAreaBottom = safeArea.bottom || systemInfo.windowHeight;
  },

  // 获取用户OpenID
  async getUserOpenId() {
    if (this.globalData.openid) {
      return this.globalData.openid;
    }

    try {
      const loginRes = await wx.login();
      const cloudRes = await wx.cloud.callFunction({
        name: 'login',
        data: { code: loginRes.code },
      });

      this.globalData.openid = cloudRes.result.openid;
      store.setState({ openid: cloudRes.result.openid });

      return cloudRes.result.openid;
    } catch (error) {
      errorHandler.handleError(error, 'getUserOpenId');
      throw error;
    }
  },

  // 全局数据
  globalData: {
    // 用户信息
    userInfo: null,
    openid: null,
    hasLogin: false,

    // 系统信息
    systemInfo: {},
    theme: 'light',
    networkType: 'unknown',

    // 安全区域
    safeAreaTop: 0,
    safeAreaBottom: 0,

    // 分享相关
    shareTicket: null,
    qrCode: null,

    // 应用状态
    isFirstLaunch: true,
  },
});
