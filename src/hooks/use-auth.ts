/**
 * 认证相关 Hook
 * 封装用户登录、退出、状态管理等逻辑
 */
import { useCallback } from 'react'
import Taro from '@tarojs/taro'
import {
  useUserInfo,
  useHasLogin,
  useOpenid,
  useAuthActions
} from '../store/global'
import {
  performAuthLogin,
  performSilentLogin,
  performLogout as authPerformLogout,
  checkLoginStatus,
  getCurrentUser,
  getCurrentOpenId
} from '../utils/auth'
import { useLoading } from './use-loading'
import { PAGE_PATHS } from '../config/constants'

export interface UseAuthReturn {
  // 状态
  userInfo: ReturnType<typeof useUserInfo>
  hasLogin: boolean
  openid: string | null

  // 操作
  login: () => Promise<void>
  logout: () => Promise<void>
  silentLogin: () => Promise<void>
  checkAndSyncLogin: () => void

  // 加载状态
  isLogging: boolean
  isLoggingOut: boolean

  // 导航方法
  requireLogin: (callback?: () => void) => boolean
  navigateToLogin: () => void
  navigateToProfile: () => void
}

/**
 * 认证 Hook
 */
export const useAuth = (): UseAuthReturn => {
  const userInfo = useUserInfo()
  const hasLogin = useHasLogin()
  const openid = useOpenid()
  const { login: setLogin, logout: setLogout, setUserInfo, setOpenid } = useAuthActions()

  // 登录加载状态
  const { isLoading: isLogging, execute: executeLogin } = useLoading({
    loadingText: '登录中...',
    successText: '登录成功',
    errorText: '登录失败'
  })

  // 退出登录加载状态
  const { isLoading: isLoggingOut, execute: executeLogout } = useLoading({
    loadingText: '退出中...',
    successText: '已退出',
    errorText: '退出失败'
  })

  /**
   * 执行用户授权登录
   * ⚠️ 此方法只能在用户点击按钮的事件处理函数中调用
   */
  const login = useCallback(async () => {
    await executeLogin(async () => {
      const result = await performAuthLogin()
      setLogin(result.userInfo, result.openid)
    })
  }, [executeLogin, setLogin])

  /**
   * 执行静默登录（仅获取OpenID）
   */
  const silentLogin = useCallback(async () => {
    try {
      const result = await performSilentLogin()
      setOpenid(result.openid)
    } catch (error) {
      console.error('静默登录失败:', error)
    }
  }, [setOpenid])

  /**
   * 退出登录
   */
  const logout = useCallback(async () => {
    await executeLogout(async () => {
      await authPerformLogout()
      setLogout()
    })
  }, [executeLogout, setLogout])

  /**
   * 检查并同步登录状态
   * 从本地存储恢复用户状态
   */
  const checkAndSyncLogin = useCallback(() => {
    const loginStatus = checkLoginStatus()
    const currentUser = getCurrentUser()
    const currentOpenId = getCurrentOpenId()

    if (loginStatus && currentUser) {
      setUserInfo(currentUser)
      if (currentOpenId) {
        setOpenid(currentOpenId)
      }
    } else {
      // 清除可能过期的状态
      setLogout()
    }
  }, [setUserInfo, setOpenid, setLogout])

  /**
   * 要求登录 - 检查登录状态，未登录则跳转登录页
   * @param callback 登录成功后的回调
   * @returns 是否已登录
   */
  const requireLogin = useCallback((callback?: () => void): boolean => {
    if (hasLogin) {
      callback?.()
      return true
    } else {
      navigateToLogin()
      return false
    }
  }, [hasLogin])

  /**
   * 跳转到登录页
   */
  const navigateToLogin = useCallback(() => {
    Taro.navigateTo({ url: PAGE_PATHS.LOGIN })
  }, [])

  /**
   * 跳转到个人资料页
   */
  const navigateToProfile = useCallback(() => {
    if (requireLogin()) {
      Taro.navigateTo({ url: PAGE_PATHS.PROFILE })
    }
  }, [requireLogin])

  return {
    // 状态
    userInfo,
    hasLogin,
    openid,

    // 操作
    login,
    logout,
    silentLogin,
    checkAndSyncLogin,

    // 加载状态
    isLogging,
    isLoggingOut,

    // 导航方法
    requireLogin,
    navigateToLogin,
    navigateToProfile
  }
}

export default useAuth
