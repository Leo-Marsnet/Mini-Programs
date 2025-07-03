/**
 * 用户认证相关API工具
 * 解除页面与App实例的强耦合
 */
import Taro from '@tarojs/taro'
import storage from '@/utils/storage'
import loading from '@/utils/loading'
import type { UserInfo } from '@/types/common'

// 本地UserInfo类型定义（兼容微信小程序API）
interface LocalUserInfo {
  nickName: string
  avatarUrl: string
  gender?: number
  city?: string
  province?: string
  country?: string
  language?: string
}

/**
 * 转换微信用户信息格式为项目内部格式
 * @param localUserInfo 微信API返回的用户信息
 * @returns 项目内部UserInfo格式
 */
const convertToUserInfo = (localUserInfo: LocalUserInfo): UserInfo => {
  return {
    id: Date.now().toString(), // 临时ID，实际项目中应从后端获取
    nickname: localUserInfo.nickName,
    avatar: localUserInfo.avatarUrl,
    gender: localUserInfo.gender as 0 | 1 | 2 | undefined,
    country: localUserInfo.country,
    province: localUserInfo.province,
    city: localUserInfo.city,
    language: localUserInfo.language,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
}

/**
 * 获取用户OpenID
 * 实际项目中应该通过云函数或后端API获取
 * @returns {Promise<string>} OpenID
 */
export const getUserOpenId = async (): Promise<string> => {
  try {
    // 先从缓存中获取
    const cachedOpenId = storage.get('openid')
    if (cachedOpenId) {
      return cachedOpenId
    }

    // 模拟API调用获取OpenID
    // 实际项目中这里应该调用真实的API
    console.log('Getting user openid from server...')

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 生成模拟的OpenID
    const openid = 'openid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

    // 缓存OpenID
    storage.set('openid', openid)

    return openid
  } catch (error) {
    console.error('获取OpenID失败:', error)
    throw new Error('获取用户标识失败，请重试')
  }
}

/**
 * 获取用户授权信息（仅在用户点击授权按钮时调用）
 * ⚠️ 注意：此方法必须在用户点击按钮的事件处理函数中调用
 * @param {string} desc 授权描述
 * @returns {Promise<LocalUserInfo>} 用户信息
 */
export const getUserProfile = async (desc: string = '用于完善用户资料'): Promise<LocalUserInfo> => {
  try {
    const profile = await Taro.getUserProfile({ desc })
    return profile.userInfo
  } catch (error: any) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

/**
 * 执行用户授权登录流程（必须在用户点击按钮时调用）
 * ⚠️ 此方法只能在用户点击按钮的事件处理函数中调用
 * @returns {Promise<{userInfo: UserInfo, openid: string}>} 登录结果
 */
export const performAuthLogin = async (): Promise<{userInfo: UserInfo, openid: string}> => {
  try {
    loading.show('登录中...')

    // 获取用户授权信息（必须在用户点击按钮时调用）
    const localUserInfo = await getUserProfile('用于完善会员资料')

    if (!localUserInfo) {
      throw new Error('获取用户信息失败')
    }

    // 转换为项目内部格式
    const userInfo = convertToUserInfo(localUserInfo)

    // 获取OpenID
    const openid = await getUserOpenId()

    // 保存用户信息到本地存储
    storage.set('userInfo', userInfo)

    loading.showSuccess('登录成功')

    return { userInfo, openid }
  } catch (error: any) {
    console.error('登录失败:', error)

    if (error?.errMsg && error.errMsg.includes('fail auth deny')) {
      loading.showWarning('取消登录')
      throw new Error('用户取消授权')
    } else {
      loading.showError('登录失败')
      throw error
    }
  } finally {
    loading.hide()
  }
}

/**
 * 执行静默登录流程（仅获取OpenID，不涉及用户信息授权）
 * @returns {Promise<{openid: string}>} 登录结果
 */
export const performSilentLogin = async (): Promise<{openid: string}> => {
  try {
    loading.show('初始化中...')

    // 获取OpenID
    const openid = await getUserOpenId()

    loading.hide()

    return { openid }
  } catch (error: any) {
    console.error('静默登录失败:', error)
    loading.showError('初始化失败')
    throw error
  }
}

/**
 * 执行用户退出登录
 * @returns {Promise<void>}
 */
export const performLogout = async (): Promise<void> => {
  try {
    const confirmed = await loading.confirm('确定要退出登录吗？', '提示')
    if (!confirmed) {
      return
    }

    // 清除本地存储
    storage.remove('userInfo')
    storage.remove('token')
    storage.remove('openid')

    // 状态管理由 useAuth Hook 处理

    loading.showSuccess('已退出')
  } catch (error: any) {
    console.error('退出登录失败:', error)
    loading.showError('退出失败')
    throw error
  }
}

/**
 * 检查用户登录状态
 * @returns {boolean} 是否已登录
 */
export const checkLoginStatus = (): boolean => {
  const userInfo = storage.get<UserInfo>('userInfo')
  const hasLogin = !!userInfo

  // 状态同步由 useAuth Hook 处理

  return hasLogin
}

/**
 * 获取当前用户信息
 * @returns {UserInfo | null} 用户信息
 */
export const getCurrentUser = (): UserInfo | null => {
  return storage.get<UserInfo>('userInfo')
}

/**
 * 获取当前用户OpenID
 * @returns {string | null} OpenID
 */
export const getCurrentOpenId = (): string | null => {
  return storage.get('openid')
}

/**
 * 刷新用户token（如果需要）
 * @returns {Promise<string>} 新的token
 */
export const refreshToken = async (): Promise<string> => {
  try {
    // 这里应该调用真实的刷新token API
    console.log('Refreshing user token...')

    const newToken = 'token_' + Date.now()
    storage.set('token', newToken)

    return newToken
  } catch (error: any) {
    console.error('刷新token失败:', error)
    throw error
  }
}

/**
 * 检查是否需要重新授权
 * @returns {Promise<boolean>} 是否需要重新授权
 */
export const needReauthorize = async (): Promise<boolean> => {
  try {
    const setting = await Taro.getSetting()
    return !setting.authSetting['scope.userInfo']
  } catch (error: any) {
    console.error('检查授权状态失败:', error)
    return true
  }
}
