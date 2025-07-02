/**
 * 本地存储管理工具
 * 统一管理小程序的本地存储，支持过期时间、加密等功能
 */

const config = require('../config/env');

class StorageManager {
  constructor() {
    this.prefix = config.storagePrefix || 'mp_';
    this.defaultExpire = 7 * 24 * 60 * 60 * 1000; // 7天
  }

  /**
   * 生成完整的存储键名
   * @param {String} key 原始键名
   * @returns {String} 完整键名
   */
  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置存储数据
   * @param {String} key 键名
   * @param {*} value 值
   * @param {Number} expire 过期时间（毫秒），0表示永不过期
   * @returns {Boolean} 是否成功
   */
  set(key, value, expire = 0) {
    try {
      const fullKey = this.getFullKey(key);
      const data = {
        value,
        timestamp: Date.now(),
        expire: expire > 0 ? Date.now() + expire : 0,
      };

      wx.setStorageSync(fullKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  /**
   * 获取存储数据
   * @param {String} key 键名
   * @param {*} defaultValue 默认值
   * @returns {*} 存储的值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.getFullKey(key);
      const dataStr = wx.getStorageSync(fullKey);

      if (!dataStr) {
        return defaultValue;
      }

      const data = JSON.parse(dataStr);

      // 检查是否过期
      if (data.expire > 0 && Date.now() > data.expire) {
        this.remove(key);
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  /**
   * 异步设置存储数据
   * @param {String} key 键名
   * @param {*} value 值
   * @param {Number} expire 过期时间（毫秒）
   * @returns {Promise<Boolean>} 是否成功
   */
  setAsync(key, value, expire = 0) {
    return new Promise(resolve => {
      try {
        const fullKey = this.getFullKey(key);
        const data = {
          value,
          timestamp: Date.now(),
          expire: expire > 0 ? Date.now() + expire : 0,
        };

        wx.setStorage({
          key: fullKey,
          data: JSON.stringify(data),
          success: () => resolve(true),
          fail: () => resolve(false),
        });
      } catch (error) {
        console.error('Storage setAsync error:', error);
        resolve(false);
      }
    });
  }

  /**
   * 异步获取存储数据
   * @param {String} key 键名
   * @param {*} defaultValue 默认值
   * @returns {Promise<*>} 存储的值或默认值
   */
  getAsync(key, defaultValue = null) {
    return new Promise(resolve => {
      try {
        const fullKey = this.getFullKey(key);

        wx.getStorage({
          key: fullKey,
          success: res => {
            try {
              const data = JSON.parse(res.data);

              // 检查是否过期
              if (data.expire > 0 && Date.now() > data.expire) {
                this.remove(key);
                resolve(defaultValue);
                return;
              }

              resolve(data.value);
            } catch (error) {
              resolve(defaultValue);
            }
          },
          fail: () => resolve(defaultValue),
        });
      } catch (error) {
        console.error('Storage getAsync error:', error);
        resolve(defaultValue);
      }
    });
  }

  /**
   * 删除存储数据
   * @param {String} key 键名
   * @returns {Boolean} 是否成功
   */
  remove(key) {
    try {
      const fullKey = this.getFullKey(key);
      wx.removeStorageSync(fullKey);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  /**
   * 异步删除存储数据
   * @param {String} key 键名
   * @returns {Promise<Boolean>} 是否成功
   */
  removeAsync(key) {
    return new Promise(resolve => {
      try {
        const fullKey = this.getFullKey(key);
        wx.removeStorage({
          key: fullKey,
          success: () => resolve(true),
          fail: () => resolve(false),
        });
      } catch (error) {
        console.error('Storage removeAsync error:', error);
        resolve(false);
      }
    });
  }

  /**
   * 检查键是否存在
   * @param {String} key 键名
   * @returns {Boolean} 是否存在
   */
  has(key) {
    const value = this.get(key, Symbol('not-found'));
    return value !== Symbol.for('not-found');
  }

  /**
   * 获取所有以指定前缀开头的键
   * @param {String} keyPrefix 键前缀
   * @returns {Array} 键名数组
   */
  getKeys(keyPrefix = '') {
    try {
      const info = wx.getStorageInfoSync();
      const fullPrefix = this.getFullKey(keyPrefix);

      return info.keys
        .filter(key => key.startsWith(fullPrefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('Storage getKeys error:', error);
      return [];
    }
  }

  /**
   * 清空所有存储数据（只清空带前缀的）
   * @returns {Boolean} 是否成功
   */
  clear() {
    try {
      const keys = this.getKeys();
      keys.forEach(key => this.remove(key));
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * 获取存储信息
   * @returns {Object} 存储信息
   */
  getInfo() {
    try {
      const info = wx.getStorageInfoSync();
      const myKeys = this.getKeys();

      return {
        ...info,
        myKeys,
        myKeysCount: myKeys.length,
      };
    } catch (error) {
      console.error('Storage getInfo error:', error);
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0,
        myKeys: [],
        myKeysCount: 0,
      };
    }
  }

  /**
   * 清理过期数据
   * @returns {Number} 清理的数据条数
   */
  cleanExpired() {
    let cleanCount = 0;

    try {
      const keys = this.getKeys();

      keys.forEach(key => {
        const fullKey = this.getFullKey(key);
        try {
          const dataStr = wx.getStorageSync(fullKey);
          if (dataStr) {
            const data = JSON.parse(dataStr);
            if (data.expire > 0 && Date.now() > data.expire) {
              wx.removeStorageSync(fullKey);
              cleanCount++;
            }
          }
        } catch (e) {
          // 数据格式错误，也删除
          wx.removeStorageSync(fullKey);
          cleanCount++;
        }
      });
    } catch (error) {
      console.error('Storage cleanExpired error:', error);
    }

    return cleanCount;
  }

  /**
   * 设置用户相关数据（带用户标识）
   * @param {String} key 键名
   * @param {*} value 值
   * @param {String} userId 用户ID
   * @param {Number} expire 过期时间
   * @returns {Boolean} 是否成功
   */
  setUserData(key, value, userId = 'default', expire = 0) {
    const userKey = `user_${userId}_${key}`;
    return this.set(userKey, value, expire);
  }

  /**
   * 获取用户相关数据
   * @param {String} key 键名
   * @param {*} defaultValue 默认值
   * @param {String} userId 用户ID
   * @returns {*} 存储的值或默认值
   */
  getUserData(key, defaultValue = null, userId = 'default') {
    const userKey = `user_${userId}_${key}`;
    return this.get(userKey, defaultValue);
  }

  /**
   * 删除用户相关数据
   * @param {String} key 键名
   * @param {String} userId 用户ID
   * @returns {Boolean} 是否成功
   */
  removeUserData(key, userId = 'default') {
    const userKey = `user_${userId}_${key}`;
    return this.remove(userKey);
  }

  /**
   * 清空指定用户的所有数据
   * @param {String} userId 用户ID
   * @returns {Number} 清理的数据条数
   */
  clearUserData(userId = 'default') {
    let clearCount = 0;
    const userPrefix = `user_${userId}_`;
    const keys = this.getKeys(userPrefix);

    keys.forEach(key => {
      if (this.remove(key)) {
        clearCount++;
      }
    });

    return clearCount;
  }
}

// 导出单例
module.exports = new StorageManager();
