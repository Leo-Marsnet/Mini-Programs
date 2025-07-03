/**
 * 全局状态管理工具 (TypeScript版本)
 * 简单的状态管理实现，支持订阅/发布模式，提供类型安全的状态管理
 */
import storage from './storage'
import type { GlobalState, UserInfo, SystemInfo } from '../types/common'
import { StorageKeys } from '../types/common'

// 状态监听器类型
type StateListener<T = GlobalState> = (currentState: T, prevState: T) => void

// 状态变化选项
interface StateChangeOptions {
  persist?: boolean // 是否持久化到本地存储
  silent?: boolean  // 是否静默更新（不触发监听器）
}

class Store {
  private state: GlobalState
  private listeners: StateListener<GlobalState>[]

  constructor() {
    this.state = {
      userInfo: null,
      hasLogin: false,
      openid: null,
      systemInfo: null,
      globalData: {}
    }
    this.listeners = []
    this.init()
  }

  /**
   * 初始化状态
   */
  private init(): void {
    // 从本地存储恢复状态
    this.restoreState()
  }

  /**
   * 从本地存储恢复状态
   */
  private restoreState(): void {
    const savedUserInfo = storage.get<UserInfo>(StorageKeys.USER_INFO)
    const savedOpenid = storage.get<string>(StorageKeys.OPENID)

    if (savedUserInfo) {
      this.state.userInfo = savedUserInfo
      this.state.hasLogin = true
    }

    if (savedOpenid) {
      this.state.openid = savedOpenid
    }
  }

  /**
   * 获取当前状态
   * @returns 当前状态的副本
   */
  getState(): GlobalState {
    return { ...this.state }
  }

  /**
   * 设置状态
   * @param newState 新状态
   * @param options 选项
   */
  setState(newState: Partial<GlobalState>, options: StateChangeOptions = {}): void {
    const { persist = false, silent = false } = options
    const prevState = { ...this.state }

    // 更新状态
    this.state = { ...this.state, ...newState }

    // 持久化特定字段
    if (persist) {
      this.persistState(newState)
    }

    // 触发监听器
    if (!silent) {
      this.notifyListeners(this.state, prevState)
    }
  }

  /**
   * 持久化状态到本地存储
   * @param stateToSave 要保存的状态
   */
  private persistState(stateToSave: Partial<GlobalState>): void {
    if (stateToSave.userInfo !== undefined) {
      if (stateToSave.userInfo) {
        storage.set(StorageKeys.USER_INFO, stateToSave.userInfo)
      } else {
        storage.remove(StorageKeys.USER_INFO)
      }
    }

    if (stateToSave.openid !== undefined) {
      if (stateToSave.openid) {
        storage.set(StorageKeys.OPENID, stateToSave.openid)
      } else {
        storage.remove(StorageKeys.OPENID)
      }
    }
  }

  /**
   * 订阅状态变化
   * @param listener 监听器函数
   * @returns 取消订阅函数
   */
  subscribe(listener: StateListener<GlobalState>): () => void {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function')
    }

    this.listeners.push(listener)

    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 通知所有监听者
   * @param currentState 当前状态
   * @param prevState 之前状态
   */
  private notifyListeners(currentState: GlobalState, prevState: GlobalState): void {
    this.listeners.forEach(listener => {
      try {
        listener(currentState, prevState)
      } catch (error) {
        console.error('Store listener error:', error)
      }
    })
  }

  /**
   * 设置用户信息
   * @param userInfo 用户信息
   * @param options 选项
   */
  setUserInfo(userInfo: UserInfo | null, options: StateChangeOptions = {}): void {
    this.setState({
      userInfo,
      hasLogin: !!userInfo
    }, { persist: true, ...options })
  }

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getUserInfo(): UserInfo | null {
    return this.state.userInfo
  }

  /**
   * 设置OpenID
   * @param openid OpenID
   * @param options 选项
   */
  setOpenid(openid: string | null, options: StateChangeOptions = {}): void {
    this.setState({ openid }, { persist: true, ...options })
  }

  /**
   * 获取OpenID
   * @returns OpenID
   */
  getOpenid(): string | null {
    return this.state.openid
  }

  /**
   * 设置系统信息
   * @param systemInfo 系统信息
   * @param options 选项
   */
  setSystemInfo(systemInfo: SystemInfo | null, options: StateChangeOptions = {}): void {
    this.setState({ systemInfo }, options)
  }

  /**
   * 获取系统信息
   * @returns 系统信息
   */
  getSystemInfo(): SystemInfo | null {
    return this.state.systemInfo
  }

  /**
   * 设置全局数据
   * @param key 数据键
   * @param value 数据值
   * @param options 选项
   */
  setGlobalData<T = any>(key: string, value: T, options: StateChangeOptions = {}): void {
    const globalData = { ...this.state.globalData }
    globalData[key] = value
    this.setState({ globalData }, options)
  }

  /**
   * 获取全局数据
   * @param key 数据键
   * @param defaultValue 默认值
   * @returns 数据值
   */
  getGlobalData<T = any>(key: string, defaultValue: T | null = null): T | null {
    return this.state.globalData[key] ?? defaultValue
  }

  /**
   * 删除全局数据
   * @param key 数据键
   * @param options 选项
   */
  removeGlobalData(key: string, options: StateChangeOptions = {}): void {
    const globalData = { ...this.state.globalData }
    delete globalData[key]
    this.setState({ globalData }, options)
  }

  /**
   * 批量设置全局数据
   * @param data 数据对象
   * @param options 选项
   */
  setGlobalDataBatch(data: Record<string, any>, options: StateChangeOptions = {}): void {
    const globalData = { ...this.state.globalData, ...data }
    this.setState({ globalData }, options)
  }

  /**
   * 清空全局数据
   * @param options 选项
   */
  clearGlobalData(options: StateChangeOptions = {}): void {
    this.setState({ globalData: {} }, options)
  }

  /**
   * 用户登录
   * @param userInfo 用户信息
   * @param openid OpenID
   * @param options 选项
   */
  login(userInfo: UserInfo, openid?: string, options: StateChangeOptions = {}): void {
    const newState: Partial<GlobalState> = {
      userInfo,
      hasLogin: true
    }

    if (openid) {
      newState.openid = openid
    }

    this.setState(newState, { persist: true, ...options })
  }

  /**
   * 用户登出
   * @param options 选项
   */
  logout(options: StateChangeOptions = {}): void {
    // 清除用户相关状态
    this.setState({
      userInfo: null,
      hasLogin: false,
      openid: null
    }, { persist: true, ...options })

    // 清除用户相关的本地存储
    storage.remove(StorageKeys.USER_INFO)
    storage.remove(StorageKeys.OPENID)
    storage.remove(StorageKeys.TOKEN)
  }

  /**
   * 检查是否已登录
   * @returns 是否已登录
   */
  isLogin(): boolean {
    return this.state.hasLogin && !!this.state.userInfo
  }

  /**
   * 重置状态
   * @param options 选项
   */
  reset(options: StateChangeOptions = {}): void {
    const initialState: GlobalState = {
      userInfo: null,
      hasLogin: false,
      openid: null,
      systemInfo: null,
      globalData: {}
    }

    this.setState(initialState, options)

    // 清除所有本地存储
    storage.clear()
  }

  /**
   * 通用的状态获取器
   * @param key 状态键
   * @param defaultValue 默认值
   * @returns 状态值
   */
  get<K extends keyof GlobalState>(key: K, defaultValue?: GlobalState[K]): GlobalState[K] | undefined {
    return this.state[key] ?? defaultValue
  }

  /**
   * 通用的状态设置器
   * @param key 状态键
   * @param value 状态值
   * @param options 选项
   */
  set<K extends keyof GlobalState>(
    key: K,
    value: GlobalState[K],
    options: StateChangeOptions = {}
  ): void {
    const newState = { [key]: value } as Partial<GlobalState>
    this.setState(newState, options)
  }

  /**
   * 获取状态监听器数量
   * @returns 监听器数量
   */
  getListenerCount(): number {
    return this.listeners.length
  }

  /**
   * 清除所有监听器
   */
  clearListeners(): void {
    this.listeners.length = 0
  }

  /**
   * 判断状态是否已经改变
   * @param newState 新状态
   * @returns 是否改变
   */
  hasStateChanged(newState: Partial<GlobalState>): boolean {
    for (const key in newState) {
      if (this.state[key as keyof GlobalState] !== newState[key as keyof GlobalState]) {
        return true
      }
    }
    return false
  }

    /**
   * 获取状态变化的差异
   * @param newState 新状态
   * @returns 状态差异
   */
  getStateDiff(newState: Partial<GlobalState>): Partial<GlobalState> {
    const diff: Partial<GlobalState> = {}

    for (const key in newState) {
      const typedKey = key as keyof GlobalState
      if (this.state[typedKey] !== newState[typedKey]) {
        (diff as any)[typedKey] = newState[typedKey]
      }
    }

    return diff
  }

  /**
   * 创建状态选择器
   * @param selector 选择器函数
   * @returns 选择的状态值
   */
  select<T>(selector: (state: GlobalState) => T): T {
    return selector(this.state)
  }

  /**
   * 创建状态选择器订阅
   * @param selector 选择器函数
   * @param listener 监听器函数
   * @returns 取消订阅函数
   */
  selectAndSubscribe<T>(
    selector: (state: GlobalState) => T,
    listener: (selectedState: T, prevSelectedState: T) => void
  ): () => void {
    let prevSelectedState = selector(this.state)

    return this.subscribe((currentState, prevState) => {
      const currentSelectedState = selector(currentState)
      const prevSelectedStateFromPrev = selector(prevState)

      if (currentSelectedState !== prevSelectedStateFromPrev) {
        listener(currentSelectedState, prevSelectedState)
        prevSelectedState = currentSelectedState
      }
    })
  }
}

// 创建默认实例
const store = new Store()

export default store
export { Store }
export type { GlobalState, StateListener, StateChangeOptions }
