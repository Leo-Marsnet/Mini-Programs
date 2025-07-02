/**
 * 性能监控工具
 * 监控页面性能、API响应时间、用户行为等
 */

const config = require('../config/env');

class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.maxMetrics = 100;
    this.reportInterval = 30000; // 30秒上报一次
    this.isReporting = false;

    // 启动监控
    this.startMonitoring();
  }

  /**
   * 启动性能监控
   */
  startMonitoring() {
    // 监控页面性能
    this.monitorPagePerformance();

    // 监控网络请求
    this.monitorNetworkRequests();

    // 定时上报
    this.startReporting();
  }

  /**
   * 监控页面性能
   */
  monitorPagePerformance() {
    const originalPage = Page;
    const self = this;

    Page = function (options) {
      const originalOnLoad = options.onLoad;
      const originalOnShow = options.onShow;
      const originalOnReady = options.onReady;

      // 监控页面加载时间
      options.onLoad = function (...args) {
        const startTime = Date.now();
        this._pageLoadStart = startTime;

        if (originalOnLoad) {
          originalOnLoad.apply(this, args);
        }

        // 记录页面加载指标
        self.recordMetric({
          type: 'page_load_start',
          page: this.route || 'unknown',
          timestamp: startTime,
        });
      };

      // 监控页面显示时间
      options.onShow = function (...args) {
        const showTime = Date.now();

        if (originalOnShow) {
          originalOnShow.apply(this, args);
        }

        self.recordMetric({
          type: 'page_show',
          page: this.route || 'unknown',
          timestamp: showTime,
        });
      };

      // 监控页面渲染完成时间
      options.onReady = function (...args) {
        const readyTime = Date.now();
        const loadTime = this._pageLoadStart ? readyTime - this._pageLoadStart : 0;

        if (originalOnReady) {
          originalOnReady.apply(this, args);
        }

        self.recordMetric({
          type: 'page_ready',
          page: this.route || 'unknown',
          timestamp: readyTime,
          loadTime,
        });
      };

      return originalPage(options);
    };
  }

  /**
   * 监控网络请求性能
   */
  monitorNetworkRequests() {
    const originalRequest = wx.request;
    const self = this;

    wx.request = function (options) {
      const startTime = Date.now();
      const originalSuccess = options.success;
      const originalFail = options.fail;

      options.success = function (res) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        self.recordMetric({
          type: 'api_request',
          url: options.url,
          method: options.method || 'GET',
          duration,
          statusCode: res.statusCode,
          timestamp: endTime,
          success: true,
        });

        if (originalSuccess) {
          originalSuccess(res);
        }
      };

      options.fail = function (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        self.recordMetric({
          type: 'api_request',
          url: options.url,
          method: options.method || 'GET',
          duration,
          error: error.errMsg,
          timestamp: endTime,
          success: false,
        });

        if (originalFail) {
          originalFail(error);
        }
      };

      return originalRequest(options);
    };
  }

  /**
   * 记录性能指标
   * @param {Object} metric 性能指标
   */
  recordMetric(metric) {
    this.metrics.push({
      ...metric,
      id: this.generateId(),
      sessionId: this.getSessionId(),
    });

    // 保持队列大小
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // 开发环境下打印
    if (config.debug) {
      console.log('Performance Metric:', metric);
    }
  }

  /**
   * 记录用户行为
   * @param {String} action 行为类型
   * @param {Object} data 行为数据
   */
  recordUserAction(action, data = {}) {
    this.recordMetric({
      type: 'user_action',
      action,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 记录错误信息
   * @param {Object} error 错误对象
   * @param {String} context 错误上下文
   */
  recordError(error, context) {
    this.recordMetric({
      type: 'error',
      message: error.message || error.errMsg || String(error),
      stack: error.stack,
      context,
      timestamp: Date.now(),
    });
  }

  /**
   * 开始定时上报
   */
  startReporting() {
    if (this.isReporting) return;

    this.isReporting = true;
    this.reportTimer = setInterval(() => {
      this.reportMetrics();
    }, this.reportInterval);
  }

  /**
   * 停止上报
   */
  stopReporting() {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
    this.isReporting = false;
  }

  /**
   * 上报性能数据
   */
  async reportMetrics() {
    if (this.metrics.length === 0) return;

    try {
      const metricsToReport = [...this.metrics];
      this.metrics = [];

      // 这里可以调用上报接口
      if (!config.debug) {
        // await wx.request({
        //   url: `${config.apiBaseUrl}/analytics/performance`,
        //   method: 'POST',
        //   data: {
        //     metrics: metricsToReport,
        //     deviceInfo: this.getDeviceInfo()
        //   }
        // })
      }

      console.log('Performance metrics reported:', metricsToReport.length);
    } catch (error) {
      console.error('Failed to report metrics:', error);
      // 失败的数据重新加入队列
      this.metrics.unshift(...metricsToReport.slice(-50));
    }
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      return {
        model: systemInfo.model,
        system: systemInfo.system,
        version: systemInfo.version,
        platform: systemInfo.platform,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
      };
    } catch (error) {
      return {};
    }
  }

  /**
   * 获取会话ID
   */
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    const stats = {
      totalMetrics: this.metrics.length,
      pageMetrics: this.metrics.filter(m => m.type.startsWith('page_')).length,
      apiMetrics: this.metrics.filter(m => m.type === 'api_request').length,
      errorMetrics: this.metrics.filter(m => m.type === 'error').length,
      userActionMetrics: this.metrics.filter(m => m.type === 'user_action').length,
    };

    // 计算平均响应时间
    const apiMetrics = this.metrics.filter(m => m.type === 'api_request' && m.success);
    if (apiMetrics.length > 0) {
      stats.avgApiResponseTime =
        apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length;
    }

    // 计算平均页面加载时间
    const pageMetrics = this.metrics.filter(m => m.type === 'page_ready' && m.loadTime);
    if (pageMetrics.length > 0) {
      stats.avgPageLoadTime =
        pageMetrics.reduce((sum, m) => sum + m.loadTime, 0) / pageMetrics.length;
    }

    return stats;
  }

  /**
   * 清空指标数据
   */
  clearMetrics() {
    this.metrics = [];
  }
}

// 导出单例
module.exports = new PerformanceMonitor();
