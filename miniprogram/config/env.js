/**
 * 环境配置文件
 * 根据不同环境返回不同配置
 */

// 获取当前环境
const envVersion = __wxConfig.envVersion || 'develop';

// 配置映射
const configs = {
  // 开发版
  develop: {
    cloudEnvId: 'dev-env-id',
    apiBaseUrl: 'https://dev-api.example.com',
    cdnBaseUrl: 'https://dev-cdn.example.com',
    debug: true,
    logLevel: 'debug',
  },

  // 体验版
  trial: {
    cloudEnvId: 'trial-env-id',
    apiBaseUrl: 'https://trial-api.example.com',
    cdnBaseUrl: 'https://trial-cdn.example.com',
    debug: true,
    logLevel: 'info',
  },

  // 正式版
  release: {
    cloudEnvId: 'release-b86096',
    apiBaseUrl: 'https://api.example.com',
    cdnBaseUrl: 'https://cdn.example.com',
    debug: false,
    logLevel: 'error',
  },
};

// 导出当前环境配置
module.exports = {
  ...configs[envVersion],
  envVersion,

  // 通用配置
  appName: '小程序模板',
  version: '1.0.0',

  // 请求配置
  requestTimeout: 10000,
  maxRetry: 3,

  // 存储配置
  storagePrefix: 'mp_template_',

  // 分享配置
  defaultShareTitle: '推荐一个好用的小程序',
  defaultShareImageUrl: '/assets/images/share-default.png',
};
