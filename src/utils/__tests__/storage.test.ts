/**
 * 存储工具类单元测试
 */

import storage from '../storage'
import { StorageKeys } from '../../types/common'

// 模拟 Taro
const mockTaro = {
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),
  getStorageInfoSync: jest.fn(),
}

jest.mock('@tarojs/taro', () => mockTaro)

describe('Storage 工具类测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // 重置模拟实现
    mockTaro.getStorageSync.mockReturnValue(null)
    mockTaro.getStorageInfoSync.mockReturnValue({
      keys: [],
      currentSize: 0,
      limitSize: 10240
    })
  })

  describe('基本存储操作', () => {
    test('应该能够存储和获取数据', () => {
      const testData = { name: 'test', value: 123 }
      const testKey = 'test_key'

      // 模拟存储成功
      mockTaro.setStorageSync.mockImplementation(() => {})
      mockTaro.getStorageSync.mockReturnValue(testData)

      // 存储数据
      const setResult = storage.set(testKey, testData)
      expect(setResult).toBe(true)
      expect(mockTaro.setStorageSync).toHaveBeenCalledWith(testKey, testData)

      // 获取数据
      const result = storage.get(testKey)
      expect(result).toEqual(testData)
      expect(mockTaro.getStorageSync).toHaveBeenCalledWith(testKey)
    })

    test('应该能够删除数据', () => {
      const testKey = 'test_key'

      // 模拟删除成功
      mockTaro.removeStorageSync.mockImplementation(() => {})

      const result = storage.remove(testKey)
      expect(result).toBe(true)
      expect(mockTaro.removeStorageSync).toHaveBeenCalledWith(testKey)
    })

    test('应该能够清空所有数据', () => {
      // 模拟清空成功
      mockTaro.clearStorageSync.mockImplementation(() => {})

      const result = storage.clear()
      expect(result).toBe(true)
      expect(mockTaro.clearStorageSync).toHaveBeenCalled()
    })

    test('应该能够检查数据是否存在', () => {
      const testKey = 'test_key'

      // 测试存在的情况
      mockTaro.getStorageSync.mockReturnValue('test_value')
      expect(storage.has(testKey)).toBe(true)

      // 测试不存在的情况
      mockTaro.getStorageSync.mockReturnValue(null)
      expect(storage.has(testKey)).toBe(false)

      // 测试undefined的情况
      mockTaro.getStorageSync.mockReturnValue(undefined)
      expect(storage.has(testKey)).toBe(false)
    })
  })

  describe('默认值处理', () => {
    test('当数据不存在时应该返回默认值', () => {
      const testKey = 'nonexistent_key'
      const defaultValue = 'default'

      mockTaro.getStorageSync.mockReturnValue(null)

      const result = storage.get(testKey, defaultValue)
      expect(result).toBe(defaultValue)
    })

    test('当数据不存在且无默认值时应该返回null', () => {
      const testKey = 'nonexistent_key'

      mockTaro.getStorageSync.mockReturnValue(null)

      const result = storage.get(testKey)
      expect(result).toBeNull()
    })

    test('当数据存在时应该返回实际数据而不是默认值', () => {
      const testKey = 'existing_key'
      const actualValue = 'actual'
      const defaultValue = 'default'

      mockTaro.getStorageSync.mockReturnValue(actualValue)

      const result = storage.get(testKey, defaultValue)
      expect(result).toBe(actualValue)
    })
  })

  describe('带过期时间的存储', () => {
    test('应该能够设置带过期时间的数据', () => {
      const testKey = 'expiry_key'
      const testValue = 'test_value'
      const expiry = 3600000 // 1小时

      mockTaro.setStorageSync.mockImplementation(() => {})

      const result = storage.setWithExpiry(testKey, testValue, expiry)
      expect(result).toBe(true)

      // 验证存储的数据结构
      const [key, value] = mockTaro.setStorageSync.mock.calls[0]
      expect(key).toBe(testKey)
      expect(value).toMatchObject({
        value: testValue,
        expiry: expect.any(Number)
      })
      expect(value.expiry).toBeGreaterThan(Date.now())
    })

    test('应该能够获取未过期的数据', () => {
      const testKey = 'expiry_key'
      const testValue = 'test_value'
      const futureExpiry = Date.now() + 3600000 // 1小时后过期

      const storedItem = {
        value: testValue,
        expiry: futureExpiry
      }

      mockTaro.getStorageSync.mockReturnValue(storedItem)

      const result = storage.getWithExpiry(testKey)
      expect(result).toBe(testValue)
    })

    test('应该能够处理已过期的数据', () => {
      const testKey = 'expired_key'
      const testValue = 'test_value'
      const pastExpiry = Date.now() - 1000 // 1秒前过期

      const storedItem = {
        value: testValue,
        expiry: pastExpiry
      }

      mockTaro.getStorageSync.mockReturnValue(storedItem)
      mockTaro.removeStorageSync.mockImplementation(() => {})

      const result = storage.getWithExpiry(testKey)
      expect(result).toBeNull()
      expect(mockTaro.removeStorageSync).toHaveBeenCalledWith(testKey)
    })

    test('过期数据应该返回默认值', () => {
      const testKey = 'expired_key'
      const testValue = 'test_value'
      const defaultValue = 'default'
      const pastExpiry = Date.now() - 1000

      const storedItem = {
        value: testValue,
        expiry: pastExpiry
      }

      mockTaro.getStorageSync.mockReturnValue(storedItem)
      mockTaro.removeStorageSync.mockImplementation(() => {})

      const result = storage.getWithExpiry(testKey, defaultValue)
      expect(result).toBe(defaultValue)
    })
  })

  describe('批量操作', () => {
    test('应该能够批量设置数据', () => {
      const testData = {
        key1: 'value1',
        key2: { name: 'test' },
        key3: 123
      }

      mockTaro.setStorageSync.mockImplementation(() => {})

      const result = storage.setMultiple(testData)
      expect(result).toBe(true)
      expect(mockTaro.setStorageSync).toHaveBeenCalledTimes(3)
    })

    test('应该能够批量获取数据', () => {
      const keys = ['key1', 'key2', 'key3']
      const values = ['value1', 'value2', 'value3']

      mockTaro.getStorageSync
        .mockReturnValueOnce(values[0])
        .mockReturnValueOnce(values[1])
        .mockReturnValueOnce(values[2])

      const result = storage.getMultiple(keys)
      expect(result).toEqual({
        key1: values[0],
        key2: values[1],
        key3: values[2]
      })
    })

    test('应该能够批量删除数据', () => {
      const keys = ['key1', 'key2', 'key3']

      mockTaro.removeStorageSync.mockImplementation(() => {})

      const result = storage.removeMultiple(keys)
      expect(result).toBe(true)
      expect(mockTaro.removeStorageSync).toHaveBeenCalledTimes(3)
    })
  })

  describe('错误处理', () => {
    test('存储操作失败时应该返回false', () => {
      const testKey = 'test_key'
      const testValue = 'test_value'

      mockTaro.setStorageSync.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const result = storage.set(testKey, testValue)
      expect(result).toBe(false)
    })

    test('获取操作失败时应该返回默认值', () => {
      const testKey = 'test_key'
      const defaultValue = 'default'

      mockTaro.getStorageSync.mockImplementation(() => {
        throw new Error('Storage access failed')
      })

      const result = storage.get(testKey, defaultValue)
      expect(result).toBe(defaultValue)
    })

    test('删除操作失败时应该返回false', () => {
      const testKey = 'test_key'

      mockTaro.removeStorageSync.mockImplementation(() => {
        throw new Error('Storage access failed')
      })

      const result = storage.remove(testKey)
      expect(result).toBe(false)
    })
  })

  describe('存储信息', () => {
    test('应该能够获取存储信息', () => {
      const mockInfo = {
        keys: ['key1', 'key2'],
        currentSize: 1024,
        limitSize: 10240
      }

      mockTaro.getStorageInfoSync.mockReturnValue(mockInfo)

      const result = storage.getInfo()
      expect(result).toEqual(mockInfo)
    })

    test('应该能够获取所有存储键', () => {
      const mockKeys = ['key1', 'key2', 'key3']

      mockTaro.getStorageInfoSync.mockReturnValue({
        keys: mockKeys,
        currentSize: 0,
        limitSize: 10240
      })

      const result = storage.keys()
      expect(result).toEqual(mockKeys)
    })

    test('应该能够获取存储大小', () => {
      const mockSize = 2048

      mockTaro.getStorageInfoSync.mockReturnValue({
        keys: [],
        currentSize: mockSize,
        limitSize: 10240
      })

      const result = storage.size()
      expect(result).toBe(mockSize)
    })
  })
})
