/**
 * 微信小程序常用工具函数
 * 封装微信API，提供更便捷的使用方式
 */

/**
 * Promise化的微信API调用
 * @param {String} method 微信API方法名
 * @param {Object} options 参数对象
 * @returns {Promise} 返回Promise对象
 */
function promisify(method, options = {}) {
  return new Promise((resolve, reject) => {
    wx[method]({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
}

/**
 * 设置导航栏标题
 * @param {String} title 标题
 * @returns {Promise}
 */
function setNavigationBarTitle(title) {
  return promisify('setNavigationBarTitle', { title });
}

/**
 * 显示加载提示
 * @param {String} title 提示文字
 * @param {Boolean} mask 是否显示透明蒙层
 * @returns {Promise}
 */
function showLoading(title = '加载中...', mask = true) {
  return promisify('showLoading', { title, mask });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 * @param {String} title 提示文字
 * @param {Number} duration 显示时长(ms)
 * @returns {Promise}
 */
function showSuccess(title, duration = 1500) {
  return promisify('showToast', {
    title,
    icon: 'success',
    duration,
  });
}

/**
 * 显示错误提示
 * @param {String} title 提示文字
 * @param {Number} duration 显示时长(ms)
 * @returns {Promise}
 */
function showError(title, duration = 2000) {
  return promisify('showToast', {
    title,
    icon: 'error',
    duration,
  });
}

/**
 * 显示纯文本提示
 * @param {String} title 提示文字
 * @param {Number} duration 显示时长(ms)
 * @returns {Promise}
 */
function showToast(title, duration = 1500) {
  return promisify('showToast', {
    title,
    icon: 'none',
    duration,
  });
}

/**
 * 显示确认对话框
 * @param {String} content 内容
 * @param {String} title 标题
 * @returns {Promise<Boolean>} 返回用户是否确认
 */
async function showConfirm(content, title = '提示') {
  try {
    const res = await promisify('showModal', {
      title,
      content,
      showCancel: true,
    });
    return res.confirm;
  } catch (error) {
    return false;
  }
}

/**
 * 显示操作菜单
 * @param {Array} itemList 菜单项列表
 * @returns {Promise<Number>} 返回用户选择的索引
 */
function showActionSheet(itemList) {
  return promisify('showActionSheet', { itemList });
}

/**
 * 页面跳转 - 保留当前页面
 * @param {String} url 页面路径
 * @param {Object} params 参数对象
 * @returns {Promise}
 */
function navigateTo(url, params = {}) {
  const query = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const fullUrl = query ? `${url}?${query}` : url;
  return promisify('navigateTo', { url: fullUrl });
}

/**
 * 页面跳转 - 替换当前页面
 * @param {String} url 页面路径
 * @param {Object} params 参数对象
 * @returns {Promise}
 */
function redirectTo(url, params = {}) {
  const query = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const fullUrl = query ? `${url}?${query}` : url;
  return promisify('redirectTo', { url: fullUrl });
}

/**
 * 页面回退
 * @param {Number} delta 回退层数
 * @returns {Promise}
 */
function navigateBack(delta = 1) {
  return promisify('navigateBack', { delta });
}

/**
 * 切换到指定Tab页面
 * @param {String} url Tab页面路径
 * @returns {Promise}
 */
function switchTab(url) {
  return promisify('switchTab', { url });
}

/**
 * 获取用户授权状态
 * @param {String} scope 权限范围
 * @returns {Promise<Boolean>} 是否已授权
 */
async function checkAuth(scope) {
  try {
    const res = await promisify('getSetting');
    return !!res.authSetting[scope];
  } catch (error) {
    return false;
  }
}

/**
 * 请求用户授权
 * @param {String} scope 权限范围
 * @returns {Promise<Boolean>} 是否授权成功
 */
async function requestAuth(scope) {
  try {
    await promisify('authorize', { scope });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 获取用户位置信息
 * @param {String} type 坐标类型
 * @returns {Promise} 位置信息
 */
function getLocation(type = 'gcj02') {
  return promisify('getLocation', { type });
}

/**
 * 选择图片
 * @param {Number} count 最多可选择的图片张数
 * @param {Array} sizeType 图片尺寸类型
 * @param {Array} sourceType 图片来源
 * @returns {Promise} 图片信息
 */
function chooseImage(count = 9, sizeType = ['compressed'], sourceType = ['album', 'camera']) {
  return promisify('chooseImage', {
    count,
    sizeType,
    sourceType,
  });
}

/**
 * 预览图片
 * @param {Array} urls 图片链接数组
 * @param {String} current 当前显示图片的链接
 * @returns {Promise}
 */
function previewImage(urls, current = urls[0]) {
  return promisify('previewImage', {
    urls,
    current,
  });
}

/**
 * 保存图片到相册
 * @param {String} filePath 图片文件路径
 * @returns {Promise}
 */
function saveImageToPhotosAlbum(filePath) {
  return promisify('saveImageToPhotosAlbum', { filePath });
}

/**
 * 复制到剪贴板
 * @param {String} data 要复制的内容
 * @returns {Promise}
 */
function setClipboardData(data) {
  return promisify('setClipboardData', { data });
}

/**
 * 获取剪贴板内容
 * @returns {Promise} 剪贴板内容
 */
function getClipboardData() {
  return promisify('getClipboardData');
}

/**
 * 振动反馈
 * @param {String} type 振动类型 ('short' | 'long')
 */
function vibrateShort(type = 'short') {
  if (type === 'long') {
    wx.vibrateLong();
  } else {
    wx.vibrateShort();
  }
}

/**
 * 获取网络状态
 * @returns {Promise} 网络状态信息
 */
function getNetworkType() {
  return promisify('getNetworkType');
}

/**
 * 监听网络状态变化
 * @param {Function} callback 回调函数
 */
function onNetworkStatusChange(callback) {
  wx.onNetworkStatusChange(callback);
}

/**
 * 格式化分享参数
 * @param {String} title 分享标题
 * @param {String} path 分享路径
 * @param {String} imageUrl 分享图片
 * @returns {Object} 分享配置对象
 */
function formatShareParams(title, path = '/pages/index/index', imageUrl = '') {
  return {
    title,
    path,
    imageUrl,
  };
}

/**
 * 检查小程序更新
 */
function checkForUpdate() {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        console.log('发现新版本');
      }
    });

    updateManager.onUpdateReady(() => {
      showConfirm('新版本已经准备好，是否重启应用？', '更新提示').then(confirmed => {
        if (confirmed) {
          updateManager.applyUpdate();
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      showError('新版本下载失败');
    });
  }
}

module.exports = {
  promisify,
  setNavigationBarTitle,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showToast,
  showConfirm,
  showActionSheet,
  navigateTo,
  redirectTo,
  navigateBack,
  switchTab,
  checkAuth,
  requestAuth,
  getLocation,
  chooseImage,
  previewImage,
  saveImageToPhotosAlbum,
  setClipboardData,
  getClipboardData,
  vibrateShort,
  getNetworkType,
  onNetworkStatusChange,
  formatShareParams,
  checkForUpdate,
};
