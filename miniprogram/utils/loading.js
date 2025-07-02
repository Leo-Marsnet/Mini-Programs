/**
 * 加载状态管理工具
 * 统一管理应用中的加载状态，避免重复显示/隐藏
 */

class LoadingManager {
  constructor() {
    this.loadingCount = 0;
    this.loadingTitle = '加载中...';
    this.isShowing = false;
  }

  /**
   * 显示加载提示
   * @param {String} title 加载提示文本
   * @param {Object} options 其他配置
   */
  show(title = '加载中...', options = {}) {
    this.loadingCount++;
    this.loadingTitle = title;

    // 只在第一次调用时显示loading
    if (this.loadingCount === 1 && !this.isShowing) {
      this.isShowing = true;
      wx.showLoading({
        title,
        mask: true, // 默认显示透明蒙层
        ...options,
      });
    }
  }

  /**
   * 隐藏加载提示
   */
  hide() {
    this.loadingCount--;

    // 确保计数不为负数
    if (this.loadingCount < 0) {
      this.loadingCount = 0;
    }

    // 只在所有请求完成时隐藏loading
    if (this.loadingCount === 0 && this.isShowing) {
      this.isShowing = false;
      wx.hideLoading();
    }
  }

  /**
   * 强制隐藏加载提示
   */
  forceHide() {
    this.loadingCount = 0;
    this.isShowing = false;
    wx.hideLoading();
  }

  /**
   * 获取当前加载状态
   * @returns {Boolean} 是否正在加载
   */
  isLoading() {
    return this.isShowing;
  }

  /**
   * 获取当前加载计数
   * @returns {Number} 加载计数
   */
  getLoadingCount() {
    return this.loadingCount;
  }

  /**
   * 显示Toast提示
   * @param {String} title 提示内容
   * @param {String} icon 图标类型
   * @param {Number} duration 显示时长
   * @param {Object} options 其他配置
   */
  showToast(title, icon = 'success', duration = 1500, options = {}) {
    wx.showToast({
      title,
      icon,
      duration,
      mask: false,
      ...options,
    });
  }

  /**
   * 显示成功提示
   * @param {String} title 提示内容
   * @param {Number} duration 显示时长
   */
  showSuccess(title = '操作成功', duration = 1500) {
    this.showToast(title, 'success', duration);
  }

  /**
   * 显示错误提示
   * @param {String} title 提示内容
   * @param {Number} duration 显示时长
   */
  showError(title = '操作失败', duration = 2000) {
    this.showToast(title, 'error', duration);
  }

  /**
   * 显示警告提示
   * @param {String} title 提示内容
   * @param {Number} duration 显示时长
   */
  showWarning(title = '操作警告', duration = 2000) {
    this.showToast(title, 'none', duration);
  }

  /**
   * 显示确认对话框
   * @param {String} content 对话框内容
   * @param {String} title 对话框标题
   * @param {Object} options 其他配置
   * @returns {Promise<Boolean>} 用户选择结果
   */
  showConfirm(content, title = '提示', options = {}) {
    return new Promise(resolve => {
      wx.showModal({
        title,
        content,
        showCancel: true,
        confirmText: '确定',
        cancelText: '取消',
        ...options,
        success: res => {
          resolve(res.confirm);
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  }

  /**
   * 显示操作菜单
   * @param {Array} itemList 菜单项列表
   * @param {Object} options 其他配置
   * @returns {Promise<Number>} 用户选择的菜单项索引
   */
  showActionSheet(itemList, options = {}) {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList,
        ...options,
        success: res => {
          resolve(res.tapIndex);
        },
        fail: error => {
          // 用户取消不算错误
          if (error.errMsg.includes('cancel')) {
            resolve(-1);
          } else {
            reject(error);
          }
        },
      });
    });
  }

  /**
   * 包装异步操作，自动显示/隐藏加载状态
   * @param {Promise} promise 异步操作
   * @param {String} loadingText 加载提示文本
   * @returns {Promise} 包装后的Promise
   */
  async wrapWithLoading(promise, loadingText = '加载中...') {
    try {
      this.show(loadingText);
      const result = await promise;
      return result;
    } finally {
      this.hide();
    }
  }

  /**
   * 延迟执行，带加载状态
   * @param {Function} fn 要执行的函数
   * @param {Number} delay 延迟时间（毫秒）
   * @param {String} loadingText 加载提示文本
   * @returns {Promise} 执行结果
   */
  async delayWithLoading(fn, delay = 1000, loadingText = '处理中...') {
    this.show(loadingText);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await fn();
          this.hide();
          resolve(result);
        } catch (error) {
          this.hide();
          reject(error);
        }
      }, delay);
    });
  }
}

// 导出单例
module.exports = new LoadingManager();
