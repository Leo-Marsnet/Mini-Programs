/**
 * 工具类单元测试
 */

const request = require('../../miniprogram/utils/request')
const storage = require('../../miniprogram/utils/storage')
const errorHandler = require('../../miniprogram/utils/errorHandler')
const store = require('../../miniprogram/utils/store')

describe('工具类测试', () => {

  describe('存储工具测试', () => {
    beforeEach(() => {
      // 清空存储
      storage.clear()
    })

    test('基本存储和获取', () => {
      const testData = { name: 'test', value: 123 }
      storage.set('test_key', testData)

      const result = storage.get('test_key')
      expect(result).toEqual(testData)
    })

    test('过期时间测试', () => {
      const testData = 'test_value'
      // 设置1秒过期
      storage.set('expire_key', testData, 1000)

      // 立即获取应该有值
      expect(storage.get('expire_key')).toBe(testData)

      // 模拟时间过去
      jest.advanceTimersByTime(1500)

      // 过期后应该返回null
      expect(storage.get('expire_key')).toBeNull()
    })

    test('用户数据隔离', () => {
      const userData1 = { userId: 'user1', data: 'data1' }
      const userData2 = { userId: 'user2', data: 'data2' }

      storage.setUserData('user1', 'test_key', userData1)
      storage.setUserData('user2', 'test_key', userData2)

      expect(storage.getUserData('user1', 'test_key')).toEqual(userData1)
      expect(storage.getUserData('user2', 'test_key')).toEqual(userData2)
    })
  })

  describe('状态管理测试', () => {
    beforeEach(() => {
      // 重置状态
      store.setState({
        userInfo: null,
        isLogin: false,
        systemInfo: null
      })
    })

    test('状态设置和获取', () => {
      const userInfo = { nickname: 'test', avatar: 'test.jpg' }
      store.setState({ userInfo, isLogin: true })

      expect(store.getState('userInfo')).toEqual(userInfo)
      expect(store.getState('isLogin')).toBe(true)
    })

    test('状态订阅', () => {
      const mockCallback = jest.fn()
      const unsubscribe = store.subscribe('userInfo', mockCallback)

      const userInfo = { nickname: 'test' }
      store.setState({ userInfo })

      expect(mockCallback).toHaveBeenCalledWith(userInfo, null)

      unsubscribe()
    })

    test('状态计算', () => {
      store.setState({
        userInfo: { nickname: 'test' },
        isLogin: true
      })

      const computed = store.computed(['userInfo', 'isLogin'], (userInfo, isLogin) => {
        return isLogin ? userInfo.nickname : '未登录'
      })

      expect(computed).toBe('test')
    })
  })

  describe('错误处理测试', () => {
    test('网络错误处理', () => {
      const networkError = {
        errMsg: 'request:fail timeout',
        errno: 600001
      }

      const result = errorHandler.handleError(networkError)
      expect(result.type).toBe('network')
      expect(result.userMessage).toContain('网络')
    })

    test('API错误处理', () => {
      const apiError = {
        statusCode: 404,
        data: { message: 'Not Found' }
      }

      const result = errorHandler.handleError(apiError)
      expect(result.type).toBe('api')
      expect(result.statusCode).toBe(404)
    })

    test('错误重试机制', () => {
      let attemptCount = 0
      const mockRetryFn = jest.fn(() => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error('Network error')
        }
        return 'success'
      })

      return errorHandler.withRetry(mockRetryFn, 3, 100)
        .then(result => {
          expect(result).toBe('success')
          expect(attemptCount).toBe(3)
        })
    })
  })

  describe('网络请求测试', () => {
    beforeEach(() => {
      // Mock wx.request
      global.wx = {
        request: jest.fn()
      }
    })

    test('GET请求', () => {
      const mockResponse = { data: { success: true } }
      wx.request.mockImplementation(({ success }) => {
        success({ statusCode: 200, data: mockResponse })
      })

      return request.get('/api/test')
        .then(result => {
          expect(result).toEqual(mockResponse)
          expect(wx.request).toHaveBeenCalledWith({
            url: expect.stringContaining('/api/test'),
            method: 'GET',
            header: expect.any(Object),
            success: expect.any(Function),
            fail: expect.any(Function)
          })
        })
    })

    test('POST请求', () => {
      const postData = { name: 'test' }
      const mockResponse = { data: { id: 1 } }

      wx.request.mockImplementation(({ success }) => {
        success({ statusCode: 200, data: mockResponse })
      })

      return request.post('/api/create', postData)
        .then(result => {
          expect(result).toEqual(mockResponse)
          expect(wx.request).toHaveBeenCalledWith({
            url: expect.stringContaining('/api/create'),
            method: 'POST',
            data: postData,
            header: expect.any(Object),
            success: expect.any(Function),
            fail: expect.any(Function)
          })
        })
    })

    test('请求失败处理', () => {
      wx.request.mockImplementation(({ fail }) => {
        fail({ errMsg: 'request:fail timeout' })
      })

      return request.get('/api/test')
        .catch(error => {
          expect(error.errMsg).toBe('request:fail timeout')
        })
    })
  })
})

// Jest 配置
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  collectCoverageFrom: [
    'miniprogram/utils/**/*.js',
    '!miniprogram/utils/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
}
