/**
 * 首页
 */

const app = getApp();
const store = require('../../utils/store');
const { request } = require('../../utils/request');
const loading = require('../../utils/loading');
const storage = require('../../utils/storage');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasLogin: false,
    systemInfo: {},
    greeting: '欢迎使用小程序模板',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('Index page onLoad', options);

    // 初始化页面数据
    this.initPageData();

    // 订阅全局状态变化
    this.subscribeStore();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('Index page onShow');

    // 页面显示时刷新数据
    this.refreshData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('Index page onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('Index page onUnload');

    // 取消订阅
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('Index page onPullDownRefresh');

    // 刷新数据
    this.refreshData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '推荐一个好用的小程序',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share-default.png',
    };
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '推荐一个好用的小程序',
      imageUrl: '/assets/images/share-default.png',
    };
  },

  /**
   * 初始化页面数据
   */
  initPageData() {
    // 获取系统信息
    const systemInfo = app.globalData.systemInfo;
    this.setData({ systemInfo });

    // 设置问候语
    this.setGreeting();

    // 检查登录状态
    this.checkLoginStatus();
  },

  /**
   * 订阅全局状态
   */
  subscribeStore() {
    this.unsubscribe = store.subscribe(state => {
      this.setData({
        userInfo: state.userInfo,
        hasLogin: state.hasLogin,
      });
    });
  },

  /**
   * 设置问候语
   */
  setGreeting() {
    const hour = new Date().getHours();
    let greeting = '欢迎使用小程序模板';

    if (hour < 6) {
      greeting = '夜深了，注意休息';
    } else if (hour < 12) {
      greeting = '早上好！';
    } else if (hour < 18) {
      greeting = '下午好！';
    } else {
      greeting = '晚上好！';
    }

    this.setData({ greeting });
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const userInfo = storage.get('userInfo');
    if (userInfo) {
      store.setUserInfo(userInfo);
      this.setData({
        userInfo,
        hasLogin: true,
      });
    }
  },

  /**
   * 刷新数据
   */
  async refreshData() {
    try {
      loading.show('刷新中...');

      // 这里可以调用API获取最新数据
      // const data = await request.get('/api/home')

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新问候语
      this.setGreeting();

      loading.showSuccess('刷新成功');
    } catch (error) {
      console.error('刷新数据失败:', error);
      loading.showError('刷新失败');
    } finally {
      loading.hide();
    }
  },

  /**
   * 登录
   */
  async handleLogin() {
    try {
      loading.show('登录中...');

      // 获取用户授权
      const userInfo = await this.getUserProfile();
      if (!userInfo) {
        return;
      }

      // 获取登录凭证
      const openid = await app.getUserOpenId();

      // 保存用户信息
      storage.set('userInfo', userInfo);
      store.setUserInfo(userInfo);
      store.setState({ openid });

      this.setData({
        userInfo,
        hasLogin: true,
      });

      loading.showSuccess('登录成功');
    } catch (error) {
      console.error('登录失败:', error);
      loading.showError('登录失败');
    } finally {
      loading.hide();
    }
  },

  /**
   * 获取用户信息
   */
  getUserProfile() {
    return new Promise(resolve => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: res => {
          resolve(res.userInfo);
        },
        fail: () => {
          loading.showWarning('取消登录');
          resolve(null);
        },
      });
    });
  },

  /**
   * 退出登录
   */
  async handleLogout() {
    const confirm = await loading.showConfirm('确定要退出登录吗？');
    if (!confirm) {
      return;
    }

    try {
      // 清除本地数据
      storage.remove('userInfo');
      storage.remove('token');

      // 清除全局状态
      store.clear();

      this.setData({
        userInfo: null,
        hasLogin: false,
      });

      loading.showSuccess('已退出登录');
    } catch (error) {
      console.error('退出登录失败:', error);
      loading.showError('退出失败');
    }
  },

  /**
   * 跳转到个人中心
   */
  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile',
    });
  },

  /**
   * 示例API调用
   */
  async testApiCall() {
    try {
      loading.show('请求中...');

      // 示例API调用
      // const result = await request.get('/api/test')
      // console.log('API结果:', result)

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      loading.showSuccess('请求成功');
    } catch (error) {
      console.error('API调用失败:', error);
      loading.showError('请求失败');
    } finally {
      loading.hide();
    }
  },
});
