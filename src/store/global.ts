/**
 * 全局状态管理 - 基于 Zustand
 * 轻量级、类型安全的状态管理解决方案
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import storage from '../utils/storage'
import type { UserInfo, SystemInfo } from '../types/common'

export interface GlobalState {
  // 用户相关状态
  userInfo: UserInfo | null
  hasLogin: boolean
  openid: string | null

  // 系统相关状态
  systemInfo: SystemInfo | null

  // 全局数据
  globalData: Record<string, any>
}

export interface GlobalActions {
  // 用户相关操作
  setUserInfo: (userInfo: UserInfo | null) => void
  setOpenid: (openid: string | null) => void
  login: (userInfo: UserInfo, openid?: string) => void
  logout: () => void

  // 系统相关操作
  setSystemInfo: (systemInfo: SystemInfo | null) => void

  // 全局数据操作
  setGlobalData: <T = any>(key: string, value: T) => void
  getGlobalData: <T = any>(key: string, defaultValue?: T) => T | undefined
  removeGlobalData: (key: string) => void
  clearGlobalData: () => void

  // 重置状态
  reset: () => void
}

type GlobalStore = GlobalState & GlobalActions

const initialState: GlobalState = {
  userInfo: null,
  hasLogin: false,
  openid: null,
  systemInfo: null,
  globalData: {}
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 设置用户信息
      setUserInfo: (userInfo) => {
        set({
          userInfo,
          hasLogin: !!userInfo
        })
      },

      // 设置OpenID
      setOpenid: (openid) => {
        set({ openid })
      },

      // 登录
      login: (userInfo, openid) => {
        set({
          userInfo,
          hasLogin: true,
          openid: openid || get().openid
        })
      },

      // 退出登录
      logout: () => {
        set({
          userInfo: null,
          hasLogin: false,
          openid: null
        })

        // 清除本地存储
        storage.remove('userInfo')
        storage.remove('token')
        storage.remove('openid')
      },

      // 设置系统信息
      setSystemInfo: (systemInfo) => {
        set({ systemInfo })
      },

      // 设置全局数据
      setGlobalData: (key, value) => {
        set((state) => ({
          globalData: {
            ...state.globalData,
            [key]: value
          }
        }))
      },

      // 获取全局数据
      getGlobalData: (key, defaultValue) => {
        const state = get()
        return state.globalData[key] ?? defaultValue
      },

      // 删除全局数据
      removeGlobalData: (key) => {
        set((state) => {
          const newGlobalData = { ...state.globalData }
          delete newGlobalData[key]
          return { globalData: newGlobalData }
        })
      },

      // 清空全局数据
      clearGlobalData: () => {
        set({ globalData: {} })
      },

      // 重置状态
      reset: () => {
        set({ ...initialState })
      }
    }),
    {
      name: 'global-store',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.get(name)
          return value ? JSON.stringify(value) : null
        },
        setItem: (name, value) => {
          storage.set(name, JSON.parse(value))
        },
        removeItem: (name) => {
          storage.remove(name)
        }
      })),
      // 只持久化部分字段
      partialize: (state) => ({
        userInfo: state.userInfo,
        hasLogin: state.hasLogin,
        openid: state.openid,
        globalData: state.globalData
      })
    }
  )
)

// 便捷的选择器Hooks
export const useUserInfo = () => useGlobalStore((state) => state.userInfo)
export const useHasLogin = () => useGlobalStore((state) => state.hasLogin)
export const useOpenid = () => useGlobalStore((state) => state.openid)
export const useSystemInfo = () => useGlobalStore((state) => state.systemInfo)

// 便捷的操作Hooks
export const useAuthActions = () => useGlobalStore((state) => ({
  login: state.login,
  logout: state.logout,
  setUserInfo: state.setUserInfo,
  setOpenid: state.setOpenid
}))

export const useSystemActions = () => useGlobalStore((state) => ({
  setSystemInfo: state.setSystemInfo
}))

// 全局数据操作Hooks
export const useGlobalData = () => useGlobalStore((state) => ({
  setGlobalData: state.setGlobalData,
  getGlobalData: state.getGlobalData,
  removeGlobalData: state.removeGlobalData,
  clearGlobalData: state.clearGlobalData
}))

export default useGlobalStore
