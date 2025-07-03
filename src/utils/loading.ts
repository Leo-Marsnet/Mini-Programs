/**
 * 加载状态管理工具类 (TypeScript版本)
 * 基于 Taro API 封装，统一管理加载、提示信息，提供类型安全的接口
 */
import Taro from '@tarojs/taro'
import type { LoadingOptions, ModalOptions, ActionSheetOptions, ActionSheetResult } from '../types/common'

class Loading {
  private loadingCount: number = 0
  private loadingTimer: NodeJS.Timeout | null = null

  /**
   * 显示加载中提示
   * @param title 提示文字
   * @param mask 是否显示透明蒙层
   */
  show(title: string = '加载中...', mask: boolean = true): void {
    try {
      this.loadingCount++

      // 防止重复显示
      if (this.loadingCount === 1) {
        Taro.showLoading({
          title,
          mask
        })
      }
    } catch (error) {
      console.error('Loading show error:', error)
    }
  }

  /**
   * 显示加载中提示（带选项）
   * @param options 加载选项
   */
  showWithOptions(options: LoadingOptions): void {
    this.show(options.title, options.mask)
  }

  /**
   * 隐藏加载中提示
   */
  hide(): void {
    try {
      this.loadingCount = Math.max(0, this.loadingCount - 1)

      if (this.loadingCount === 0) {
        Taro.hideLoading()
      }
    } catch (error) {
      console.error('Loading hide error:', error)
    }
  }

  /**
   * 强制隐藏加载中提示
   */
  forceHide(): void {
    try {
      this.loadingCount = 0
      Taro.hideLoading()
    } catch (error) {
      console.error('Loading forceHide error:', error)
    }
  }

  /**
   * 显示成功提示
   * @param title 提示文字
   * @param duration 持续时间（毫秒）
   * @param mask 是否显示透明蒙层
   */
  showSuccess(title: string = '操作成功', duration: number = 1500, mask: boolean = false): void {
    try {
      Taro.showToast({
        title,
        icon: 'success',
        duration,
        mask
      })
    } catch (error) {
      console.error('Loading showSuccess error:', error)
    }
  }

  /**
   * 显示错误提示
   * @param title 提示文字
   * @param duration 持续时间（毫秒）
   * @param mask 是否显示透明蒙层
   */
  showError(title: string = '操作失败', duration: number = 1500, mask: boolean = false): void {
    try {
      Taro.showToast({
        title,
        icon: 'error',
        duration,
        mask
      })
    } catch (error) {
      console.error('Loading showError error:', error)
    }
  }

  /**
   * 显示警告提示
   * @param title 提示文字
   * @param duration 持续时间（毫秒）
   * @param mask 是否显示透明蒙层
   */
  showWarning(title: string = '警告', duration: number = 1500, mask: boolean = false): void {
    try {
      Taro.showToast({
        title,
        icon: 'error', // 小程序中没有warning图标，使用error代替
        duration,
        mask
      })
    } catch (error) {
      console.error('Loading showWarning error:', error)
    }
  }

  /**
   * 显示信息提示
   * @param title 提示文字
   * @param duration 持续时间（毫秒）
   * @param mask 是否显示透明蒙层
   */
  showInfo(title: string, duration: number = 1500, mask: boolean = false): void {
    try {
      Taro.showToast({
        title,
        icon: 'none',
        duration,
        mask
      })
    } catch (error) {
      console.error('Loading showInfo error:', error)
    }
  }

  /**
   * 显示纯文本提示
   * @param title 提示文字
   * @param duration 持续时间（毫秒）
   * @param mask 是否显示透明蒙层
   */
  showText(title: string, duration: number = 1500, mask: boolean = false): void {
    try {
      Taro.showToast({
        title,
        icon: 'none',
        duration,
        mask
      })
    } catch (error) {
      console.error('Loading showText error:', error)
    }
  }

  /**
   * 隐藏Toast提示
   */
  hideToast(): void {
    try {
      Taro.hideToast()
    } catch (error) {
      console.error('Loading hideToast error:', error)
    }
  }

  /**
   * 显示模态对话框
   * @param title 标题
   * @param content 内容
   * @param options 选项
   * @returns Promise<用户是否点击确定>
   */
  showModal(title: string = '提示', content: string = '', options: Partial<ModalOptions> = {}): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const defaultOptions: ModalOptions = {
          title,
          content,
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          cancelColor: '#000000'
        }

        const finalOptions = { ...defaultOptions, ...options }

        Taro.showModal({
          ...finalOptions,
          success: (res) => {
            resolve(res.confirm)
          },
          fail: () => {
            resolve(false)
          }
        })
      } catch (error) {
        console.error('Loading showModal error:', error)
        resolve(false)
      }
    })
  }

  /**
   * 显示确认对话框
   * @param content 内容
   * @param title 标题
   * @param options 额外选项
   * @returns Promise<用户是否点击确定>
   */
  confirm(content: string, title: string = '确认', options: Partial<ModalOptions> = {}): Promise<boolean> {
    return this.showModal(title, content, {
      showCancel: true,
      ...options
    })
  }

  /**
   * 显示提示对话框
   * @param content 内容
   * @param title 标题
   * @param options 额外选项
   * @returns Promise<用户是否点击确定>
   */
  alert(content: string, title: string = '提示', options: Partial<ModalOptions> = {}): Promise<boolean> {
    return this.showModal(title, content, {
      showCancel: false,
      ...options
    })
  }

  /**
   * 显示操作菜单
   * @param itemList 菜单项数组
   * @param title 菜单标题
   * @param options 额外选项
   * @returns Promise<用户选择结果>
   */
  showActionSheet(itemList: string[], title: string = '', options: Partial<ActionSheetOptions> = {}): Promise<ActionSheetResult> {
    return new Promise((resolve) => {
      try {
        const finalOptions: ActionSheetOptions = {
          itemList,
          title,
          itemColor: '#000000',
          ...options
        }

        Taro.showActionSheet({
          ...finalOptions,
          success: (res) => {
            resolve({
              tapIndex: res.tapIndex,
              cancel: false
            })
          },
          fail: () => {
            resolve({
              tapIndex: -1,
              cancel: true
            })
          }
        })
      } catch (error) {
        console.error('Loading showActionSheet error:', error)
        resolve({
          tapIndex: -1,
          cancel: true
        })
      }
    })
  }

  /**
   * 显示带超时的加载提示
   * @param title 提示文字
   * @param timeout 超时时间（毫秒）
   * @param mask 是否显示透明蒙层
   * @returns Promise<是否超时>
   */
  showWithTimeout(title: string = '加载中...', timeout: number = 10000, mask: boolean = true): Promise<boolean> {
    return new Promise((resolve) => {
      this.show(title, mask)

      this.loadingTimer = setTimeout(() => {
        this.hide()
        resolve(true) // 超时
      }, timeout)
    })
  }

  /**
   * 清除超时定时器
   */
  clearTimeout(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
    }
  }

  /**
   * 显示加载提示并执行异步操作
   * @param asyncFn 异步操作函数
   * @param title 加载提示文字
   * @param mask 是否显示透明蒙层
   * @returns Promise<异步操作结果>
   */
  async withLoading<T>(
    asyncFn: () => Promise<T>,
    title: string = '加载中...',
    mask: boolean = true
  ): Promise<T> {
    this.show(title, mask)

    try {
      const result = await asyncFn()
      return result
    } catch (error) {
      throw error
    } finally {
      this.hide()
    }
  }

  /**
   * 显示加载提示并执行异步操作，带成功和错误提示
   * @param asyncFn 异步操作函数
   * @param loadingTitle 加载提示文字
   * @param successTitle 成功提示文字
   * @param errorTitle 错误提示文字
   * @param mask 是否显示透明蒙层
   * @returns Promise<异步操作结果>
   */
  async withLoadingAndToast<T>(
    asyncFn: () => Promise<T>,
    loadingTitle: string = '加载中...',
    successTitle: string = '操作成功',
    errorTitle: string = '操作失败',
    mask: boolean = true
  ): Promise<T> {
    this.show(loadingTitle, mask)

    try {
      const result = await asyncFn()
      this.showSuccess(successTitle)
      return result
    } catch (error) {
      this.showError(errorTitle)
      throw error
    } finally {
      this.hide()
    }
  }

  /**
   * 获取当前加载状态
   * @returns 是否正在加载
   */
  isLoading(): boolean {
    return this.loadingCount > 0
  }

  /**
   * 获取当前加载计数
   * @returns 加载计数
   */
  getLoadingCount(): number {
    return this.loadingCount
  }

  /**
   * 重置加载状态
   */
  reset(): void {
    this.loadingCount = 0
    this.clearTimeout()
    this.forceHide()
  }
}

// 创建默认实例
const loading = new Loading()

export default loading
export { Loading }
export type { LoadingOptions, ModalOptions, ActionSheetOptions, ActionSheetResult }
