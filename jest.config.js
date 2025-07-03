module.exports = {
  // 测试环境
  testEnvironment: 'node',

  // 测试文件匹配模式
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/test/**/*.spec.js',
  ],

  // 忽略的测试文件
  testPathIgnorePatterns: [
    '/node_modules/',
    '/miniprogram/packageAPI/',
    '/miniprogram/packageCloud/',
    '/miniprogram/packageComponent/',
    '/miniprogram/packageExtend/',
    '/miniprogram/packageSkyline/',
    '/miniprogram/packageXRFrame/',
  ],

  // 覆盖率收集配置
  collectCoverageFrom: [
    'miniprogram/utils/**/*.js',
    'miniprogram/config/**/*.js',
    'miniprogram/components/**/*.js',
    '!miniprogram/utils/index.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // 覆盖率报告格式
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
  ],

  // 覆盖率输出目录
  coverageDirectory: 'coverage',

  // 模块路径映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/miniprogram/$1',
    '^@utils/(.*)$': '<rootDir>/miniprogram/utils/$1',
    '^@config/(.*)$': '<rootDir>/miniprogram/config/$1',
  },

  // 测试前的设置文件
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.js',
  ],

  // 全局变量
  globals: {
    wx: {},
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    __wxConfig: { envVersion: 'develop' },
  },

  // 转换配置
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  // 模拟文件扩展名
  moduleFileExtensions: [
    'js',
    'json',
  ],

  // 测试超时时间
  testTimeout: 10000,

  // 详细输出
  verbose: true,

  // 清除模拟
  clearMocks: true,

  // 重置模拟
  resetMocks: true,

  // 恢复模拟
  restoreMocks: true,
};
