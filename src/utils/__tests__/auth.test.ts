/**
 * 认证工具类单元测试
 */

import * as auth from '../auth'
import storage from '../storage'
import store from '../store'
import loading from '../loading'
import { UserInfo } from '../../types/common'

// 模拟依赖模块
jest.mock('../storage')
jest.mock('../store')
jest.mock('../loading')

// 模拟 Taro
const mockTaro = {
  getUserProfile: jest.fn(),
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
}

jest.mock('@tarojs/taro', () => mockTaro)

describe('Auth 认证工具测试', () => {
  // 模拟的存储和状态管理
  const mockStorage = storage as jest.Mocked<typeof storage>
  const mockStore = store as jest.Mocked<typeof store>
  const mockLoading = loading as jest.Mocked<typeof loading>

  beforeEach(() => {
    jest.clearAllMocks()

    // 重置模拟实现
    mockStorage.get.mockReturnValue(null)
    mockStorage.set.mockReturnValue(true)
    mockStorage.remove.mockReturnValue(true)
    mockLoading.show.mockImplementation(() => Promise.resolve())
    mockLoading.hide.mockImplementation(() => Promise.resolve())
    mockLoading.showSuccess.mockImplementation(() => Promise.resolve())
    mockLoading.showError.mockImplementation(() => Promise.resolve())
    mockLoading.showWarning.mockImplementation(() => Promise.resolve())
  })

  describe('getUserOpenId', () => {
    test('应该能够获取缓存的OpenID', async () => {
      const cachedOpenId = 'cached_openid_123'
      mockStorage.get.mockReturnValue(cachedOpenId)

      const result = await auth.getUserOpenId()
      expect(result).toBe(cachedOpenId)
      expect(mockStorage.get).toHaveBeenCalledWith('openid')
    })

    test('应该能够生成新的OpenID并缓存', async () => {
      mockStorage.get.mockReturnValue(null)
      mockStorage.set.mockReturnValue(true)
      mockStore.setOpenid.mockImplementation(() => {})

      const result = await auth.getUserOpenId()

      expect(result).toMatch(/^openid_\d+_[a-z0-9]+$/)
      expect(mockStorage.set).toHaveBeenCalledWith('openid', result)
      expect(mockStore.setOpenid).toHaveBeenCalledWith(result)
    })

    test('应该能够处理OpenID获取失败', async () => {
      mockStorage.get.mockImplementation(() => {
        throw new Error('Storage error')
      })

      await expect(auth.getUserOpenId()).rejects.toThrow('获取用户标识失败，请重试')
    })
  })

  describe('getUserProfile', () => {
    test('应该能够获取用户授权信息', async () => {
      const mockUserInfo = {
        nickName: '测试用户',
        avatarUrl: 'https://example.com/avatar.jpg',
        gender: 1,
        city: '北京',
        province: '北京',
        country: '中国',
        language: 'zh_CN'
      }

      mockTaro.getUserProfile.mockResolvedValue({
        userInfo: mockUserInfo
      })

      const result = await auth.getUserProfile('测试授权')
      expect(result).toEqual(mockUserInfo)
      expect(mockTaro.getUserProfile).toHaveBeenCalledWith({
        desc: '测试授权'
      })
    })

    test('应该能够处理用户取消授权', async () => {
      const error = new Error('用户取消授权')
      mockTaro.getUserProfile.mockRejectedValue(error)

      await expect(auth.getUserProfile()).rejects.toThrow(error)
    })
  })

  describe('performLogin', () => {
    test('应该能够成功执行登录流程', async () => {
      const mockUserInfo = {
        nickName: '测试用户',
        avatarUrl: 'https://example.com/avatar.jpg',
        gender: 1,
        city: '北京',
        province: '北京',
        country: '中国',
        language: 'zh_CN'
      }

      const mockOpenId = 'test_openid_123'

      // 模拟getUserProfile成功
      mockTaro.getUserProfile.mockResolvedValue({
        userInfo: mockUserInfo
      })

      // 模拟OpenID获取成功
      mockStorage.get.mockReturnValue(mockOpenId)

      // 模拟存储和状态管理操作
      mockStorage.set.mockReturnValue(true)
      mockStore.login.mockImplementation(() => {})

      const result = await auth.performLogin()

      expect(result).toMatchObject({
        userInfo: expect.objectContaining({
          nickname: mockUserInfo.nickName,
          avatar: mockUserInfo.avatarUrl
        }),
        openid: mockOpenId
      })

      expect(mockLoading.show).toHaveBeenCalledWith('登录中...')
      expect(mockLoading.showSuccess).toHaveBeenCalledWith('登录成功')
      expect(mockLoading.hide).toHaveBeenCalled()
      expect(mockStorage.set).toHaveBeenCalledWith('userInfo', expect.any(Object))
      expect(mockStore.login).toHaveBeenCalled()
    })

    test('应该能够处理用户取消授权', async () => {
      const error = {
        errMsg: 'getUserProfile:fail auth deny'
      }

      mockTaro.getUserProfile.mockRejectedValue(error)

      await expect(auth.performLogin()).rejects.toThrow('用户取消授权')
      expect(mockLoading.showWarning).toHaveBeenCalledWith('取消登录')
      expect(mockLoading.hide).toHaveBeenCalled()
    })

    test('应该能够处理登录失败', async () => {
      const error = new Error('网络错误')
      mockTaro.getUserProfile.mockRejectedValue(error)

      await expect(auth.performLogin()).rejects.toThrow(error)
      expect(mockLoading.showError).toHaveBeenCalledWith('登录失败')
      expect(mockLoading.hide).toHaveBeenCalled()
    })
  })

  describe('performLogout', () => {
    test('应该能够成功执行退出登录', async () => {
      mockLoading.confirm.mockResolvedValue(true)
      mockStorage.remove.mockReturnValue(true)
      mockStore.logout.mockImplementation(() => {})

      await auth.performLogout()

      expect(mockLoading.confirm).toHaveBeenCalledWith('确定要退出登录吗？', '提示')
      expect(mockStorage.remove).toHaveBeenCalledWith('userInfo')
      expect(mockStorage.remove).toHaveBeenCalledWith('token')
      expect(mockStorage.remove).toHaveBeenCalledWith('openid')
      expect(mockStore.logout).toHaveBeenCalled()
      expect(mockLoading.showSuccess).toHaveBeenCalledWith('已退出')
    })

    test('应该能够处理用户取消退出', async () => {
      mockLoading.confirm.mockResolvedValue(false)

      await auth.performLogout()

      expect(mockLoading.confirm).toHaveBeenCalled()
      expect(mockStorage.remove).not.toHaveBeenCalled()
      expect(mockStore.logout).not.toHaveBeenCalled()
    })

    test('应该能够处理退出失败', async () => {
      const error = new Error('存储错误')
      mockLoading.confirm.mockResolvedValue(true)
      mockStorage.remove.mockImplementation(() => {
        throw error
      })

      await expect(auth.performLogout()).rejects.toThrow(error)
      expect(mockLoading.showError).toHaveBeenCalledWith('退出失败')
    })
  })

  describe('checkLoginStatus', () => {
    test('应该能够检查已登录状态', () => {
      const mockUserInfo: UserInfo = {
        id: '123',
        nickname: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
        createTime: '2023-01-01T00:00:00.000Z',
        updateTime: '2023-01-01T00:00:00.000Z'
      }

      mockStorage.get.mockReturnValue(mockUserInfo)
      mockStore.setUserInfo.mockImplementation(() => {})

      const result = auth.checkLoginStatus()
      expect(result).toBe(true)
      expect(mockStorage.get).toHaveBeenCalledWith('userInfo')
      expect(mockStore.setUserInfo).toHaveBeenCalledWith(mockUserInfo)
    })

    test('应该能够检查未登录状态', () => {
      mockStorage.get.mockReturnValue(null)

      const result = auth.checkLoginStatus()
      expect(result).toBe(false)
      expect(mockStore.setUserInfo).not.toHaveBeenCalled()
    })
  })

  describe('getCurrentUser', () => {
    test('应该能够获取当前用户信息', () => {
      const mockUserInfo: UserInfo = {
        id: '123',
        nickname: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
        createTime: '2023-01-01T00:00:00.000Z',
        updateTime: '2023-01-01T00:00:00.000Z'
      }

      mockStorage.get.mockReturnValue(mockUserInfo)

      const result = auth.getCurrentUser()
      expect(result).toEqual(mockUserInfo)
      expect(mockStorage.get).toHaveBeenCalledWith('userInfo')
    })

    test('应该能够处理用户信息不存在', () => {
      mockStorage.get.mockReturnValue(null)

      const result = auth.getCurrentUser()
      expect(result).toBeNull()
    })
  })

  describe('getCurrentOpenId', () => {
    test('应该能够获取当前OpenID', () => {
      const mockOpenId = 'test_openid_123'
      mockStorage.get.mockReturnValue(mockOpenId)

      const result = auth.getCurrentOpenId()
      expect(result).toBe(mockOpenId)
      expect(mockStorage.get).toHaveBeenCalledWith('openid')
    })

    test('应该能够处理OpenID不存在', () => {
      mockStorage.get.mockReturnValue(null)

      const result = auth.getCurrentOpenId()
      expect(result).toBeNull()
    })
  })

  describe('refreshToken', () => {
    test('应该能够刷新token', async () => {
      const mockToken = 'new_token_123'
      mockStorage.set.mockReturnValue(true)

      const result = await auth.refreshToken()
      expect(result).toMatch(/^token_\d+_[a-z0-9]+$/)
      expect(mockStorage.set).toHaveBeenCalledWith('token', result)
    })

    test('应该能够处理token刷新失败', async () => {
      mockStorage.set.mockImplementation(() => {
        throw new Error('Storage error')
      })

      await expect(auth.refreshToken()).rejects.toThrow('刷新token失败，请重新登录')
    })
  })
})
