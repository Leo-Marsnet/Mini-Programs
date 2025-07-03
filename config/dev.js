/**
 * 开发环境配置
 * 包含开发时的调试、代理、热更新等配置
 */
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },

  // 定义全局常量，可在代码中直接使用
  defineConstants: {
    // API 配置
    API_BASE_URL: '"https://api-dev.example.com"',
    API_TIMEOUT: 10000,

    // 应用信息
    APP_VERSION: '"1.0.0-dev"',
    APP_BUILD_TIME: `"${new Date().toISOString()}"`,
    APP_ENV: '"development"',

    // 功能开关
    ENABLE_DEBUG: true,
    ENABLE_MOCK: true,
    ENABLE_VCONSOLE: true,
    ENABLE_LOGGER: true,

    // 微信小程序配置
    WECHAT_APPID: '"wx1234567890abcdef"',

    // 第三方服务（开发环境通常为空或测试账号）
    SENTRY_DSN: '""',
    ANALYTICS_ID: '""',

    // 缓存配置
    CACHE_PREFIX: '"miniapp_dev_"',
    CACHE_VERSION: '"1.0.0"',

    // 业务配置
    DEFAULT_PAGE_SIZE: 10,
    MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_RETRY_COUNT: 3,

    // 调试配置
    DEBUG_API: true,
    DEBUG_STORAGE: true,
    DEBUG_PERFORMANCE: true
  },

  // 小程序开发配置
  mini: {
    // 开发时启用热更新
    hot: true,

    // 启用 source map
    enableSourceMap: true,

    // 调试配置
    debugReact: true,

    // 模拟器端口
    port: 8082,

    // 开发服务器配置
    devServer: {
      port: 8080,
      host: 'localhost'
    }
  },

  // H5开发配置
  h5: {
    // 开发服务器配置
    devServer: {
      port: 10086,
      host: 'localhost',
      open: true,
      // API代理配置
      proxy: {
        '/api': {
          target: 'https://api-dev.example.com',
          changeOrigin: true,
          secure: false,
          logLevel: 'debug'
        }
      }
    },

    // 启用 source map
    enableSourceMap: true,

    // 启用热更新
    hot: true
  }
}
