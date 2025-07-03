/**
 * 生产环境配置
 * 包含代码压缩、优化、分包等生产环境专用配置
 */
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },

  defineConstants: {
    // API 配置
    API_BASE_URL: '"https://api.example.com"',
    API_TIMEOUT: 15000,

    // 应用信息
    APP_VERSION: '"1.0.0"',
    APP_BUILD_TIME: `"${new Date().toISOString()}"`,
    APP_ENV: '"production"',

    // 功能开关（生产环境关闭调试功能）
    ENABLE_DEBUG: false,
    ENABLE_MOCK: false,
    ENABLE_VCONSOLE: false,
    ENABLE_LOGGER: false,

    // 微信小程序配置
    WECHAT_APPID: '"wxPRODUCTION_APPID"',

    // 第三方服务（生产环境使用真实配置）
    SENTRY_DSN: '"https://your-sentry-dsn@sentry.io/project-id"',
    ANALYTICS_ID: '"your-analytics-id"',

    // 缓存配置
    CACHE_PREFIX: '"miniapp_"',
    CACHE_VERSION: '"1.0.0"',

    // 业务配置
    DEFAULT_PAGE_SIZE: 20,
    MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB (生产环境限制更严格)
    MAX_RETRY_COUNT: 2,

    // 调试配置（生产环境全部关闭）
    DEBUG_API: false,
    DEBUG_STORAGE: false,
    DEBUG_PERFORMANCE: false
  },

  // 小程序配置
  mini: {
    // 代码压缩配置
    optimizeMainPackage: {
      enable: true,
      exclude: ['@tarojs/taro', 'react', 'react-dom']
    },

    // 代码分割配置
    commonChunks: ['runtime', 'vendors', 'taro', 'common'],

    // 添加编译过程中的一些优化配置
    addChunkPages(pages, pagesNames) {
      // 这里可以自定义分包逻辑
    },

    // CSS 优化
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['weui-']
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 小于1KB的图片转base64
        }
      },
      cssModules: {
        enable: false
      },
      // CSS压缩
      autoprefixer: {
        enable: true
      }
    },

    // Webpack优化配置
    webpackChain(chain) {
      // 代码分割优化
      chain.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all'
          },
          taro: {
            test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
            name: 'taro',
            priority: 20,
            chunks: 'all'
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true
          }
        }
      })

      // 生产环境的一些优化
      chain.optimization.minimize(true)

      // 代码压缩选项通过 compress 配置项处理（见下面的配置）
    },

    // 启用 tree-shaking
    sideEffects: false,

    // 压缩配置
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  },

  // H5配置
  h5: {
    // 静态资源配置
    staticDirectory: 'static',
    publicPath: '/',

    // 路由配置
    router: {
      mode: 'hash'
    },

    // 代码压缩
    devtool: false,

    // webpack配置
    webpackChain(chain) {
      // 生产环境优化
      chain.optimization.minimize(true)

      // 代码分割
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          taro: {
            test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
            name: 'taro',
            chunks: 'all'
          }
        }
      })

      // 长期缓存配置
      chain.output.filename('[name].[contenthash:8].js')
      chain.output.chunkFilename('[name].[contenthash:8].chunk.js')
    },

    // PostCSS配置
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      pxtransform: {
        enable: true,
        config: {
          platform: 'h5'
        }
      },
      cssModules: {
        enable: false
      }
    },

    // 打包配置
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]'
    },

    // 图片优化
    imageUrlLoaderOption: {
      limit: 5000,
      name: 'images/[name].[contenthash:8].[ext]'
    },

    // 媒体文件配置
    mediaUrlLoaderOption: {
      limit: 5000,
      name: 'media/[name].[contenthash:8].[ext]'
    },

    // 字体文件配置
    fontUrlLoaderOption: {
      limit: 5000,
      name: 'fonts/[name].[contenthash:8].[ext]'
    },

    // 启用 PWA
    pwa: {
      enable: false, // 可根据需求开启
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
      }
    }
  },

  // 插件配置
  plugins: [
    // 可以添加一些生产环境专用的插件
  ],

  // 性能预算配置
  performance: {
    hints: 'warning',
    maxAssetSize: 500000, // 500KB
    maxEntrypointSize: 500000 // 500KB
  }
}
