/**
 * 网络请求封装
 * 统一处理请求和响应，包含重试、错误处理等功能
 */

const config = require('../config/env');
const { errorHandler } = require('./errorHandler');
const loadingManager = require('./loading');

class Request {
  constructor() {
    this.baseURL = config.apiBaseUrl;
    this.timeout = config.requestTimeout;
    this.maxRetry = config.maxRetry;

    // 请求拦截器
    this.requestInterceptors = [];
    // 响应拦截器
    this.responseInterceptors = [];

    // 添加默认拦截器
    this.addDefaultInterceptors();
  }

  /**
   * 添加默认拦截器
   */
  addDefaultInterceptors() {
    // 请求拦截器：添加token
    this.addRequestInterceptor(config => {
      const token = wx.getStorageSync('token');
      if (token) {
        config.header = {
          ...config.header,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    });

    // 响应拦截器：统一处理响应
    this.addResponseInterceptor(
      response => {
        const { data } = response;

        // 业务成功
        if (data.code === 0 || data.success) {
          return data.data || data;
        }

        // 业务失败
        errorHandler.handleApiError(data);
        return Promise.reject(data);
      },
      error => {
        errorHandler.handleNetworkError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 添加请求拦截器
   * @param {Function} fulfilled 成功回调
   * @param {Function} rejected 失败回调
   */
  addRequestInterceptor(fulfilled, rejected) {
    this.requestInterceptors.push({ fulfilled, rejected });
  }

  /**
   * 添加响应拦截器
   * @param {Function} fulfilled 成功回调
   * @param {Function} rejected 失败回调
   */
  addResponseInterceptor(fulfilled, rejected) {
    this.responseInterceptors.push({ fulfilled, rejected });
  }

  /**
   * 基础请求方法
   * @param {Object} options 请求配置
   * @returns {Promise} 请求Promise
   */
  async request(options) {
    // 合并默认配置
    let config = {
      url: this.baseURL + options.url,
      method: 'GET',
      timeout: this.timeout,
      header: {
        'content-type': 'application/json',
      },
      ...options,
    };

    // 执行请求拦截器
    for (const interceptor of this.requestInterceptors) {
      try {
        if (interceptor.fulfilled) {
          config = interceptor.fulfilled(config) || config;
        }
      } catch (error) {
        if (interceptor.rejected) {
          config = interceptor.rejected(error) || config;
        }
      }
    }

    // 发起请求（带重试机制）
    return this.requestWithRetry(config);
  }

  /**
   * 带重试机制的请求
   * @param {Object} config 请求配置
   * @param {Number} retryCount 重试次数
   * @returns {Promise} 请求Promise
   */
  async requestWithRetry(config, retryCount = 0) {
    try {
      const response = await this.wxRequest(config);

      // 执行响应拦截器
      let result = response;
      for (const interceptor of this.responseInterceptors) {
        try {
          if (interceptor.fulfilled) {
            result = interceptor.fulfilled(result) || result;
          }
        } catch (error) {
          if (interceptor.rejected) {
            result = interceptor.rejected(error);
          }
          throw error;
        }
      }

      return result;
    } catch (error) {
      // 网络错误且未达到最大重试次数
      if (this.shouldRetry(error) && retryCount < this.maxRetry) {
        console.log(`请求失败，正在重试 ${retryCount + 1}/${this.maxRetry}`);
        await this.delay(1000 * (retryCount + 1)); // 递增延迟
        return this.requestWithRetry(config, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * 微信请求封装
   * @param {Object} config 请求配置
   * @returns {Promise} 请求Promise
   */
  wxRequest(config) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...config,
        success: res => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusText || 'Request failed'}`));
          }
        },
        fail: reject,
      });
    });
  }

  /**
   * 判断是否应该重试
   * @param {Object} error 错误对象
   * @returns {Boolean} 是否应该重试
   */
  shouldRetry(error) {
    const retryableErrors = ['timeout', 'fail', 'network error', 'connection refused'];

    const errorMsg = (error.errMsg || error.message || '').toLowerCase();
    return retryableErrors.some(keyword => errorMsg.includes(keyword));
  }

  /**
   * 延迟函数
   * @param {Number} ms 延迟毫秒数
   * @returns {Promise} 延迟Promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET请求
   * @param {String} url 请求地址
   * @param {Object} params 请求参数
   * @param {Object} options 其他配置
   * @returns {Promise} 请求Promise
   */
  get(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...options,
    });
  }

  /**
   * POST请求
   * @param {String} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object} options 其他配置
   * @returns {Promise} 请求Promise
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options,
    });
  }

  /**
   * PUT请求
   * @param {String} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object} options 其他配置
   * @returns {Promise} 请求Promise
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options,
    });
  }

  /**
   * DELETE请求
   * @param {String} url 请求地址
   * @param {Object} params 请求参数
   * @param {Object} options 其他配置
   * @returns {Promise} 请求Promise
   */
  delete(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data: params,
      ...options,
    });
  }

  /**
   * 文件上传
   * @param {String} url 上传地址
   * @param {String} filePath 文件路径
   * @param {Object} data 额外数据
   * @param {Object} options 其他配置
   * @returns {Promise} 上传Promise
   */
  upload(url, filePath, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: this.baseURL + url,
        filePath,
        name: 'file',
        formData: data,
        header: {
          Authorization: `Bearer ${wx.getStorageSync('token') || ''}`,
        },
        ...options,
        success: res => {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 0 || data.success) {
              resolve(data.data || data);
            } else {
              reject(data);
            }
          } catch (error) {
            reject(new Error('上传响应解析失败'));
          }
        },
        fail: reject,
      });

      // 返回上传任务，支持进度监听
      if (options.onProgress) {
        uploadTask.onProgressUpdate(options.onProgress);
      }
    });
  }
}

// 创建实例
const request = new Request();

// 导出实例和类
module.exports = {
  request,
  Request,
};
