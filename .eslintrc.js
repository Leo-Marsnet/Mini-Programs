module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // JavaScript 最佳实践
    'no-console': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'warn',
    'arrow-spacing': 'error',
    'no-trailing-spaces': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // 微信小程序特定规则
    'no-undef': 'error',
    'no-implicit-globals': 'error',
    'consistent-return': 'warn',
    'eqeqeq': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-script-url': 'error',

    // 异步处理
    'no-async-promise-executor': 'error',
    'require-await': 'warn',
    'no-await-in-loop': 'warn',

    // 对象和数组
    'no-prototype-builtins': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-destructuring': ['warn', { object: true, array: false }],

    // 函数相关
    'func-names': ['warn', 'as-needed'],
    'no-empty-function': 'warn',
    'consistent-this': ['warn', 'that'],
  },
  globals: {
    // 微信小程序全局变量
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    Behavior: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',

    // 微信小程序生命周期和配置
    __wxConfig: 'readonly',

    // 云开发相关
    cloud: 'readonly',

    // 常用工具函数
    requirePlugin: 'readonly',

    // Node.js 环境变量（用于构建脚本）
    process: 'readonly',
    global: 'readonly',
    Buffer: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    module: 'readonly',
    exports: 'readonly',
    require: 'readonly',
  },
  overrides: [
    {
      // 针对云函数的特殊配置
      files: ['**/cloud/functions/**/*.js'],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        'no-console': 'off', // 云函数中允许使用 console
      },
    },
    {
      // 针对测试文件的特殊配置
      files: ['**/*.test.js', '**/*.spec.js', '**/test/**/*.js'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      // 针对构建脚本的特殊配置
      files: ['**/scripts/**/*.js', '**/build/**/*.js', '*.config.js'],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
