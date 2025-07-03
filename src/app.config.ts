/**
 * 应用全局配置
 * Taro 3.x 配置文件
 */
export default {
  // 页面路径列表，第一个页面是首页
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/profile/index'
  ],

  // 全局窗口配置
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro应用',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5',
    enablePullDownRefresh: false,
    onReachBottomDistance: 50
  },

  // TabBar配置（可选）
  tabBar: {
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'assets/images/tab-home.png',
        selectedIconPath: 'assets/images/tab-home-active.png',
        text: '首页'
      }
    ]
  },

  // 网络超时配置
  networkTimeout: {
    request: 10000,
    downloadFile: 10000
  },

  // 是否开启debug模式
  debug: process.env.NODE_ENV === 'development',

  // 分包配置（可选）
  subPackages: [
    // {
    //   root: 'pages/sub',
    //   pages: [
    //     'profile/index',
    //     'settings/index'
    //   ]
    // }
  ],

  // 预加载配置（可选）
  preloadRule: {
    // 'pages/index/index': {
    //   network: 'all',
    //   packages: ['sub-package-name']
    // }
  },

  // 云开发配置（可选）
  cloud: true,

  // 权限描述（可选）
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于提供更好的服务'
    }
  },

  // 小程序接口权限相关设置（可选）
  requiredPrivateInfos: [
    'getLocation'
  ],

  // 地理位置相关接口（可选）
  requiredBackgroundModes: [
    'location'
  ],

  // 插件配置（可选）
  plugins: {
    // 'plugin-name': {
    //   version: '1.0.0',
    //   provider: 'plugin-provider'
    // }
  },

  // 样式隔离配置
  styleIsolation: 'isolated',

  // 单页模式相关配置（可选）
  singlePage: {
    navigationBarFit: 'float'
  },

  // 支持DarkMode
  darkmode: true,
  themeLocation: 'theme.json',

  // 小程序启动时是否校验更新
  checkSiteMap: false,

  // 是否启用分享朋友圈功能
  "mp-weixin": {
    appid: 'your-appid-here'
  },

  // H5配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui']
  }
}
