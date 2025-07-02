/**
 * 简单的全局状态管理
 * 用于在页面和组件间共享状态
 */

class Store {
  constructor() {
    this.state = {
      // 用户信息
      userInfo: null,
      openid: null,
      hasLogin: false,

      // 系统信息
      systemInfo: {},
      theme: 'light',
      networkType: 'unknown',

      // 应用状态
      loading: false,
      error: null,
    };

    this.listeners = [];
  }

  /**
   * 设置状态
   * @param {Object} newState 新状态
   */
  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // 通知所有监听器
    this.listeners.forEach(listener => {
      try {
        listener(this.state, oldState);
      } catch (error) {
        console.error('Store listener error:', error);
      }
    });
  }

  /**
   * 获取状态
   * @param {String} key 状态键名，不传则返回全部状态
   * @returns {*} 状态值
   */
  getState(key) {
    return key ? this.state[key] : this.state;
  }

  /**
   * 订阅状态变化
   * @param {Function} listener 监听函数
   * @returns {Function} 取消订阅函数
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    this.listeners.push(listener);

    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 清空状态
   */
  clear() {
    this.setState({
      userInfo: null,
      openid: null,
      hasLogin: false,
      loading: false,
      error: null,
    });
  }

  /**
   * 设置用户信息
   * @param {Object} userInfo 用户信息
   */
  setUserInfo(userInfo) {
    this.setState({
      userInfo,
      hasLogin: !!userInfo,
    });
  }

  /**
   * 设置加载状态
   * @param {Boolean} loading 是否加载中
   */
  setLoading(loading) {
    this.setState({ loading });
  }

  /**
   * 设置错误信息
   * @param {String|Object} error 错误信息
   */
  setError(error) {
    this.setState({ error });
  }
}

// 导出单例
module.exports = new Store();
