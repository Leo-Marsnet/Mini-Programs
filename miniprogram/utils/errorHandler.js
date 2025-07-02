/**
 * 全局错误处理工具
 * 统一处理应用中的各种错误
 */

const config = require('../config/env');

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 10;
  }

  /**
   * 处理错误
   * @param {Error|String} error 错误对象或错误信息
   * @param {String} context 错误上下文
   */
  handleError(error, context = '') {
    const errorInfo = this.formatError(error, context);

    // 记录错误
    this.logError(errorInfo);

    // 显示用户友好的错误提示
    this.showUserFriendlyError(errorInfo);

    // 上报错误（生产环境）
    if (!config.debug) {
      this.reportError(errorInfo);
    }
  }

  /**
   * 处理网络错误
   * @param {Object} error 网络错误对象
   */
  handleNetworkError(error) {
    const errorMsg = error.errMsg || error.message || '网络请求失败';

    let userMsg = '网络异常，请稍后重试';

    if (errorMsg.includes('timeout')) {
      userMsg = '网络超时，请检查网络连接';
    } else if (errorMsg.includes('fail')) {
      userMsg = '网络连接失败，请检查网络设置';
    } else if (errorMsg.includes('abort')) {
      userMsg = '请求已取消';
    }

    wx.showToast({
      title: userMsg,
      icon: 'none',
      duration: 2000,
    });

    this.logError({
      type: 'network',
      message: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 处理API错误
   * @param {Object} response API响应
   * @param {String} apiName API名称
   */
  handleApiError(response, apiName = '') {
    const { code, message } = response;

    // 根据错误码显示不同提示
    const errorMessages = {
      401: '登录已过期，请重新登录',
      403: '没有权限执行此操作',
      404: '请求的资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务暂不可用',
    };

    const userMsg = errorMessages[code] || message || '操作失败，请重试';

    wx.showToast({
      title: userMsg,
      icon: 'none',
      duration: 2000,
    });

    this.logError({
      type: 'api',
      apiName,
      code,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 格式化错误信息
   * @param {*} error 错误对象
   * @param {String} context 上下文
   * @returns {Object} 格式化后的错误信息
   */
  formatError(error, context) {
    return {
      type: 'general',
      context,
      message: error?.message || error?.errMsg || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: wx.getSystemInfoSync().system,
      version: config.version,
    };
  }

  /**
   * 记录错误日志
   * @param {Object} errorInfo 错误信息
   */
  logError(errorInfo) {
    // 开发环境打印到控制台
    if (config.debug) {
      console.error(`[${errorInfo.context}] Error:`, errorInfo);
    }

    // 添加到错误队列
    this.errorQueue.push(errorInfo);

    // 保持队列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 写入本地日志
    try {
      const logs = wx.getStorageSync('error_logs') || [];
      logs.push(errorInfo);

      // 只保留最近50条
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }

      wx.setStorageSync('error_logs', logs);
    } catch (e) {
      console.error('保存错误日志失败:', e);
    }
  }

  /**
   * 显示用户友好的错误提示
   * @param {Object} errorInfo 错误信息
   */
  showUserFriendlyError(errorInfo) {
    // 避免重复显示相同错误
    const lastError = this.errorQueue[this.errorQueue.length - 2];
    if (lastError && lastError.message === errorInfo.message) {
      return;
    }

    let title = '操作失败';

    // 根据错误类型显示不同提示
    if (errorInfo.message.includes('网络')) {
      title = '网络异常，请检查网络连接';
    } else if (errorInfo.message.includes('登录')) {
      title = '登录失败，请重试';
    } else if (errorInfo.message.includes('权限')) {
      title = '权限不足';
    }

    wx.showToast({
      title,
      icon: 'none',
      duration: 2000,
    });
  }

  /**
   * 上报错误到服务器
   * @param {Object} errorInfo 错误信息
   */
  async reportError(errorInfo) {
    try {
      // 这里可以调用错误上报接口
      // await wx.request({
      //   url: `${config.apiBaseUrl}/error/report`,
      //   method: 'POST',
      //   data: errorInfo
      // })

      console.log('Error reported:', errorInfo);
    } catch (e) {
      console.error('上报错误失败:', e);
    }
  }

  /**
   * 获取错误日志
   * @returns {Array} 错误日志数组
   */
  getErrorLogs() {
    try {
      return wx.getStorageSync('error_logs') || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 清空错误日志
   */
  clearErrorLogs() {
    try {
      wx.removeStorageSync('error_logs');
      this.errorQueue = [];
    } catch (e) {
      console.error('清空错误日志失败:', e);
    }
  }
}

// 导出单例
const errorHandler = new ErrorHandler();

module.exports = {
  errorHandler,
  ErrorHandler,
};
