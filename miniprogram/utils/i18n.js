/**
 * 国际化(i18n)支持工具
 * 支持多语言切换和文本本地化
 */

const storage = require('./storage');

class I18n {
  constructor() {
    this.currentLocale = 'zh-CN';
    this.fallbackLocale = 'zh-CN';
    this.messages = {};
    this.listeners = [];

    // 初始化
    this.init();
  }

  /**
   * 初始化国际化
   */
  init() {
    // 从存储中获取用户设置的语言
    const savedLocale = storage.get('locale');
    if (savedLocale) {
      this.currentLocale = savedLocale;
    } else {
      // 获取系统语言
      try {
        const systemInfo = wx.getSystemInfoSync();
        const systemLanguage = systemInfo.language || 'zh-CN';
        this.currentLocale = this.normalizeLocale(systemLanguage);
      } catch (error) {
        console.error('获取系统语言失败:', error);
      }
    }

    // 加载默认语言包
    this.loadMessages();
  }

  /**
   * 标准化语言代码
   * @param {String} locale 语言代码
   * @returns {String} 标准化后的语言代码
   */
  normalizeLocale(locale) {
    const localeMap = {
      zh: 'zh-CN',
      'zh-cn': 'zh-CN',
      'zh-tw': 'zh-TW',
      'zh-hk': 'zh-HK',
      en: 'en-US',
      'en-us': 'en-US',
      'en-gb': 'en-GB',
      ja: 'ja-JP',
      ko: 'ko-KR',
    };

    const normalizedLocale = locale.toLowerCase();
    return localeMap[normalizedLocale] || locale;
  }

  /**
   * 加载语言包
   */
  loadMessages() {
    // 这里可以从本地文件或远程API加载语言包
    this.messages = {
      'zh-CN': {
        // 通用
        'common.confirm': '确定',
        'common.cancel': '取消',
        'common.ok': '好的',
        'common.loading': '加载中...',
        'common.success': '成功',
        'common.error': '错误',
        'common.retry': '重试',
        'common.back': '返回',
        'common.next': '下一步',
        'common.previous': '上一步',
        'common.save': '保存',
        'common.edit': '编辑',
        'common.delete': '删除',
        'common.search': '搜索',
        'common.refresh': '刷新',

        // 首页
        'home.title': '首页',
        'home.welcome': '欢迎使用小程序模板',
        'home.morning': '早上好！',
        'home.afternoon': '下午好！',
        'home.evening': '晚上好！',
        'home.night': '夜深了，注意休息',
        'home.login_tip': '登录后享受更多功能',
        'home.login': '立即登录',
        'home.logout': '退出',
        'home.welcome_back': '欢迎回来！',

        // 功能
        'function.network_request': '网络请求',
        'function.profile': '个人中心',
        'function.refresh': '刷新数据',
        'function.settings': '设置',

        // 系统信息
        'system.device_model': '设备型号',
        'system.system_version': '系统版本',
        'system.wechat_version': '微信版本',
        'system.sdk_version': '基础库版本',
        'system.unknown': '未知',

        // 错误信息
        'error.network': '网络异常，请检查网络连接',
        'error.timeout': '网络超时，请检查网络连接',
        'error.request_failed': '请求失败，请稍后重试',
        'error.login_failed': '登录失败',
        'error.logout_failed': '退出失败',
        'error.operation_failed': '操作失败',

        // 成功信息
        'success.login': '登录成功',
        'success.logout': '已退出登录',
        'success.refresh': '刷新成功',
        'success.operation': '操作成功',

        // 确认对话框
        'confirm.logout': '确定要退出登录吗？',
        'confirm.delete': '确定要删除吗？',
        'confirm.clear': '确定要清空吗？',
      },

      'en-US': {
        // Common
        'common.confirm': 'Confirm',
        'common.cancel': 'Cancel',
        'common.ok': 'OK',
        'common.loading': 'Loading...',
        'common.success': 'Success',
        'common.error': 'Error',
        'common.retry': 'Retry',
        'common.back': 'Back',
        'common.next': 'Next',
        'common.previous': 'Previous',
        'common.save': 'Save',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.search': 'Search',
        'common.refresh': 'Refresh',

        // Home
        'home.title': 'Home',
        'home.welcome': 'Welcome to Mini Program Template',
        'home.morning': 'Good Morning!',
        'home.afternoon': 'Good Afternoon!',
        'home.evening': 'Good Evening!',
        'home.night': "It's late, please rest",
        'home.login_tip': 'Login to enjoy more features',
        'home.login': 'Login Now',
        'home.logout': 'Logout',
        'home.welcome_back': 'Welcome Back!',

        // Functions
        'function.network_request': 'Network Request',
        'function.profile': 'Profile',
        'function.refresh': 'Refresh Data',
        'function.settings': 'Settings',

        // System Info
        'system.device_model': 'Device Model',
        'system.system_version': 'System Version',
        'system.wechat_version': 'WeChat Version',
        'system.sdk_version': 'SDK Version',
        'system.unknown': 'Unknown',

        // Error Messages
        'error.network': 'Network error, please check your connection',
        'error.timeout': 'Network timeout, please check your connection',
        'error.request_failed': 'Request failed, please try again',
        'error.login_failed': 'Login failed',
        'error.logout_failed': 'Logout failed',
        'error.operation_failed': 'Operation failed',

        // Success Messages
        'success.login': 'Login successful',
        'success.logout': 'Logged out successfully',
        'success.refresh': 'Refresh successful',
        'success.operation': 'Operation successful',

        // Confirm Dialogs
        'confirm.logout': 'Are you sure you want to logout?',
        'confirm.delete': 'Are you sure you want to delete?',
        'confirm.clear': 'Are you sure you want to clear?',
      },
    };
  }

  /**
   * 获取翻译文本
   * @param {String} key 翻译键
   * @param {Object} params 参数对象
   * @returns {String} 翻译后的文本
   */
  t(key, params = {}) {
    let message = this.getMessage(key, this.currentLocale);

    // 如果当前语言没有找到，尝试回退语言
    if (!message && this.currentLocale !== this.fallbackLocale) {
      message = this.getMessage(key, this.fallbackLocale);
    }

    // 如果还是没有找到，返回键名
    if (!message) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    // 替换参数
    return this.interpolate(message, params);
  }

  /**
   * 获取指定语言的消息
   * @param {String} key 消息键
   * @param {String} locale 语言代码
   * @returns {String} 消息内容
   */
  getMessage(key, locale) {
    const messages = this.messages[locale];
    if (!messages) return null;

    // 支持嵌套键名，如 'home.title'
    const keys = key.split('.');
    let result = messages;

    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        return null;
      }
    }

    return typeof result === 'string' ? result : null;
  }

  /**
   * 插值替换
   * @param {String} message 消息模板
   * @param {Object} params 参数对象
   * @returns {String} 替换后的消息
   */
  interpolate(message, params) {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * 设置当前语言
   * @param {String} locale 语言代码
   */
  setLocale(locale) {
    const normalizedLocale = this.normalizeLocale(locale);

    if (this.messages[normalizedLocale]) {
      this.currentLocale = normalizedLocale;
      storage.set('locale', normalizedLocale);

      // 通知监听器
      this.notifyListeners(normalizedLocale);
    } else {
      console.warn(`Locale ${normalizedLocale} not supported`);
    }
  }

  /**
   * 获取当前语言
   * @returns {String} 当前语言代码
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * 获取支持的语言列表
   * @returns {Array} 支持的语言列表
   */
  getSupportedLocales() {
    return Object.keys(this.messages).map(locale => ({
      code: locale,
      name: this.getLocaleName(locale),
    }));
  }

  /**
   * 获取语言显示名称
   * @param {String} locale 语言代码
   * @returns {String} 语言显示名称
   */
  getLocaleName(locale) {
    const names = {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'zh-HK': '繁體中文(香港)',
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'ja-JP': '日本語',
      'ko-KR': '한국어',
    };

    return names[locale] || locale;
  }

  /**
   * 添加语言包
   * @param {String} locale 语言代码
   * @param {Object} messages 消息对象
   */
  addMessages(locale, messages) {
    if (!this.messages[locale]) {
      this.messages[locale] = {};
    }

    Object.assign(this.messages[locale], messages);
  }

  /**
   * 监听语言变化
   * @param {Function} listener 监听函数
   * @returns {Function} 取消监听函数
   */
  onLocaleChange(listener) {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 通知监听器
   * @param {String} locale 新的语言代码
   */
  notifyListeners(locale) {
    this.listeners.forEach(listener => {
      try {
        listener(locale);
      } catch (error) {
        console.error('I18n listener error:', error);
      }
    });
  }

  /**
   * 格式化数字
   * @param {Number} number 数字
   * @param {Object} options 格式化选项
   * @returns {String} 格式化后的数字
   */
  formatNumber(number, options = {}) {
    try {
      return new Intl.NumberFormat(this.currentLocale, options).format(number);
    } catch (error) {
      return String(number);
    }
  }

  /**
   * 格式化日期
   * @param {Date} date 日期对象
   * @param {Object} options 格式化选项
   * @returns {String} 格式化后的日期
   */
  formatDate(date, options = {}) {
    try {
      return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  /**
   * 格式化货币
   * @param {Number} amount 金额
   * @param {String} currency 货币代码
   * @returns {String} 格式化后的货币
   */
  formatCurrency(amount, currency = 'CNY') {
    try {
      return new Intl.NumberFormat(this.currentLocale, {
        style: 'currency',
        currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount}`;
    }
  }
}

// 导出单例
module.exports = new I18n();
