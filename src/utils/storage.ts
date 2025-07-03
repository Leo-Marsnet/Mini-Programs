/**
 * 本地存储工具类 (TypeScript版本)
 * 基于 Taro API 封装，支持多端使用、类型安全、存储键管理
 */
import Taro from '@tarojs/taro'
import { StorageKeys, StorageItem } from '../types/common'

class Storage {
  /**
   * 获取本地存储的数据
   * @param key 存储键名
   * @param defaultValue 默认值
   * @returns 存储的数据
   */
  get<T = any>(key: StorageKeys | string, defaultValue?: T): T | null {
    try {
      const value = Taro.getStorageSync(key)
      return value !== undefined && value !== null ? value : (defaultValue ?? null)
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue ?? null
    }
  }

  /**
   * 设置本地存储数据
   * @param key 存储键名
   * @param value 存储的数据
   * @returns 是否成功
   */
  set<T = any>(key: StorageKeys | string, value: T): boolean {
    try {
      Taro.setStorageSync(key, value)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  /**
   * 删除本地存储数据
   * @param key 存储键名
   * @returns 是否成功
   */
  remove(key: StorageKeys | string): boolean {
    try {
      Taro.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  /**
   * 清空所有本地存储数据
   * @returns 是否成功
   */
  clear(): boolean {
    try {
      Taro.clearStorageSync()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

    /**
   * 获取本地存储信息
   * @returns 存储信息
   */
  getInfo(): { keys: string[], currentSize: number, limitSize: number } {
    try {
      return Taro.getStorageInfoSync()
    } catch (error) {
      console.error('Storage getInfo error:', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    }
  }

  /**
   * 设置带过期时间的存储
   * @param key 存储键名
   * @param value 存储的数据
   * @param expiry 过期时间（毫秒）
   * @returns 是否成功
   */
  setWithExpiry<T = any>(key: StorageKeys | string, value: T, expiry: number): boolean {
    try {
      const now = Date.now()
      const item: StorageItem<T> = {
        value,
        expiry: now + expiry
      }
      return this.set(key, item)
    } catch (error) {
      console.error('Storage setWithExpiry error:', error)
      return false
    }
  }

  /**
   * 获取带过期时间的存储
   * @param key 存储键名
   * @param defaultValue 默认值
   * @returns 存储的数据
   */
  getWithExpiry<T = any>(key: StorageKeys | string, defaultValue?: T): T | null {
    try {
      const item = this.get<StorageItem<T>>(key)
      if (!item) return defaultValue ?? null

      const now = Date.now()
      if (item.expiry && now > item.expiry) {
        this.remove(key)
        return defaultValue ?? null
      }

      return item.value !== undefined ? item.value : (defaultValue ?? null)
    } catch (error) {
      console.error('Storage getWithExpiry error:', error)
      return defaultValue ?? null
    }
  }

  /**
   * 检查存储项是否存在
   * @param key 存储键名
   * @returns 是否存在
   */
  has(key: StorageKeys | string): boolean {
    try {
      const value = Taro.getStorageSync(key)
      return value !== undefined && value !== null
    } catch (error) {
      console.error('Storage has error:', error)
      return false
    }
  }

  /**
   * 获取所有存储键
   * @returns 存储键数组
   */
  keys(): string[] {
    try {
      const info = this.getInfo()
      return info.keys
    } catch (error) {
      console.error('Storage keys error:', error)
      return []
    }
  }

  /**
   * 获取存储大小（字节）
   * @returns 存储大小
   */
  size(): number {
    try {
      const info = this.getInfo()
      return info.currentSize
    } catch (error) {
      console.error('Storage size error:', error)
      return 0
    }
  }

  /**
   * 批量设置存储
   * @param items 存储项对象
   * @returns 是否全部成功
   */
  setMultiple(items: Record<string, any>): boolean {
    try {
      let allSuccess = true
      Object.entries(items).forEach(([key, value]) => {
        if (!this.set(key, value)) {
          allSuccess = false
        }
      })
      return allSuccess
    } catch (error) {
      console.error('Storage setMultiple error:', error)
      return false
    }
  }

  /**
   * 批量获取存储
   * @param keys 存储键数组
   * @returns 存储项对象
   */
  getMultiple<T = any>(keys: (StorageKeys | string)[]): Record<string, T | null> {
    try {
      const result: Record<string, T | null> = {}
      keys.forEach(key => {
        result[key] = this.get<T>(key)
      })
      return result
    } catch (error) {
      console.error('Storage getMultiple error:', error)
      return {}
    }
  }

  /**
   * 批量删除存储
   * @param keys 存储键数组
   * @returns 是否全部成功
   */
  removeMultiple(keys: (StorageKeys | string)[]): boolean {
    try {
      let allSuccess = true
      keys.forEach(key => {
        if (!this.remove(key)) {
          allSuccess = false
        }
      })
      return allSuccess
    } catch (error) {
      console.error('Storage removeMultiple error:', error)
      return false
    }
  }

  /**
   * 清理过期的存储项
   * @returns 清理的数量
   */
  cleanExpired(): number {
    try {
      const keys = this.keys()
      let cleanedCount = 0

      keys.forEach(key => {
        try {
          const item = this.get<StorageItem>(key)
          if (item && item.expiry && Date.now() > item.expiry) {
            this.remove(key)
            cleanedCount++
          }
        } catch (error) {
          // 忽略单个项的错误，继续处理其他项
        }
      })

      return cleanedCount
    } catch (error) {
      console.error('Storage cleanExpired error:', error)
      return 0
    }
  }

  /**
   * 异步获取存储数据
   * @param key 存储键名
   * @param defaultValue 默认值
   * @returns Promise<存储的数据>
   */
  async getAsync<T = any>(key: StorageKeys | string, defaultValue?: T): Promise<T | null> {
    try {
      const res = await Taro.getStorage({ key })
      return res.data !== undefined && res.data !== null ? res.data : (defaultValue ?? null)
    } catch (error) {
      console.error('Storage getAsync error:', error)
      return defaultValue ?? null
    }
  }

  /**
   * 异步设置存储数据
   * @param key 存储键名
   * @param value 存储的数据
   * @returns Promise<是否成功>
   */
  async setAsync<T = any>(key: StorageKeys | string, value: T): Promise<boolean> {
    try {
      await Taro.setStorage({ key, data: value })
      return true
    } catch (error) {
      console.error('Storage setAsync error:', error)
      return false
    }
  }

  /**
   * 异步删除存储数据
   * @param key 存储键名
   * @returns Promise<是否成功>
   */
  async removeAsync(key: StorageKeys | string): Promise<boolean> {
    try {
      await Taro.removeStorage({ key })
      return true
    } catch (error) {
      console.error('Storage removeAsync error:', error)
      return false
    }
  }

  /**
   * 异步清空所有存储数据
   * @returns Promise<是否成功>
   */
  async clearAsync(): Promise<boolean> {
    try {
      await Taro.clearStorage()
      return true
    } catch (error) {
      console.error('Storage clearAsync error:', error)
      return false
    }
  }

      /**
   * 异步获取存储信息
   * @returns Promise<存储信息>
   */
  async getInfoAsync(): Promise<{ keys: string[], currentSize: number, limitSize: number }> {
    try {
      const res = await Taro.getStorageInfo() as any
      return {
        keys: res.keys || [],
        currentSize: res.currentSize || 0,
        limitSize: res.limitSize || 0
      }
    } catch (error) {
      console.error('Storage getInfoAsync error:', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    }
  }
}

// 创建默认实例
const storage = new Storage()

export default storage
export { Storage }
export type { StorageItem }
