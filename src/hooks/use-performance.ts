/**
 * 性能监控 Hook
 * 用于监控组件性能和用户行为统计
 */
import { useEffect, useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'

interface PerformanceMetrics {
  componentName: string
  loadTime: number
  renderTime: number
  userInteractions: number
  errorCount: number
  timestamp: number
}

interface UsePerformanceOptions {
  componentName: string
  enableLogging?: boolean
  enableReporting?: boolean
  reportingEndpoint?: string
}

// 性能数据存储
const performanceData = new Map<string, PerformanceMetrics>()

export const usePerformance = (options: UsePerformanceOptions) => {
  const {
    componentName,
    enableLogging = true,
    enableReporting = false,
    reportingEndpoint
  } = options

  const startTimeRef = useRef<number>(Date.now())
  const renderCountRef = useRef<number>(0)
  const interactionCountRef = useRef<number>(0)
  const errorCountRef = useRef<number>(0)

  // 记录组件渲染
  const recordRender = useCallback(() => {
    renderCountRef.current++
  }, [])

  // 记录用户交互
  const recordInteraction = useCallback((interactionType: string) => {
    interactionCountRef.current++

    if (enableLogging) {
      console.log(`[Performance] ${componentName}: ${interactionType}`)
    }
  }, [componentName, enableLogging])

  // 记录错误
  const recordError = useCallback((error: Error) => {
    errorCountRef.current++

    if (enableLogging) {
      console.error(`[Performance] ${componentName} Error:`, error)
    }
  }, [componentName, enableLogging])

  // 获取性能指标
  const getMetrics = useCallback((): PerformanceMetrics => {
    const now = Date.now()
    const loadTime = now - startTimeRef.current

    return {
      componentName,
      loadTime,
      renderTime: renderCountRef.current,
      userInteractions: interactionCountRef.current,
      errorCount: errorCountRef.current,
      timestamp: now
    }
  }, [componentName])

  // 上报性能数据
  const reportMetrics = useCallback(async () => {
    if (!enableReporting || !reportingEndpoint) return

    const metrics = getMetrics()

    try {
      await Taro.request({
        url: reportingEndpoint,
        method: 'POST',
        data: metrics
      })

      if (enableLogging) {
        console.log(`[Performance] Metrics reported for ${componentName}`)
      }
    } catch (error) {
      console.error(`[Performance] Failed to report metrics:`, error)
    }
  }, [enableReporting, reportingEndpoint, getMetrics, componentName, enableLogging])

  // 组件挂载时的性能监控
  useEffect(() => {
    startTimeRef.current = Date.now()

    // 记录组件挂载
    if (enableLogging) {
      console.log(`[Performance] ${componentName} mounted`)
    }

    return () => {
      // 组件卸载时记录性能指标
      const metrics = getMetrics()
      performanceData.set(componentName, metrics)

      if (enableLogging) {
        console.log(`[Performance] ${componentName} unmounted:`, metrics)
      }

      // 上报性能数据
      reportMetrics()
    }
  }, [componentName, enableLogging, getMetrics, reportMetrics])

  // 每次渲染时记录
  useEffect(() => {
    recordRender()
  })

  return {
    recordInteraction,
    recordError,
    getMetrics,
    reportMetrics
  }
}

/**
 * 页面性能监控 Hook
 * 专门用于页面级别的性能监控
 */
export const usePagePerformance = (pageName: string) => {
  const pageStartTime = useRef<number>(Date.now())
  const { recordInteraction, recordError, getMetrics } = usePerformance({
    componentName: `Page_${pageName}`,
    enableLogging: process.env.NODE_ENV === 'development',
    enableReporting: process.env.NODE_ENV === 'production'
  })

  // 页面显示时间统计
  const recordPageShow = useCallback(() => {
    const showTime = Date.now() - pageStartTime.current
    recordInteraction(`page_show_${showTime}ms`)
  }, [recordInteraction])

  // 页面隐藏时间统计
  const recordPageHide = useCallback(() => {
    const hideTime = Date.now() - pageStartTime.current
    recordInteraction(`page_hide_${hideTime}ms`)
  }, [recordInteraction])

  // 页面分享统计
  const recordPageShare = useCallback((shareType: 'friend' | 'timeline') => {
    recordInteraction(`page_share_${shareType}`)
  }, [recordInteraction])

  // 页面下拉刷新统计
  const recordPullRefresh = useCallback(() => {
    recordInteraction('pull_refresh')
  }, [recordInteraction])

  // 绑定 Taro 页面生命周期
  useEffect(() => {
    const currentPage = Taro.getCurrentInstance()?.page
    if (currentPage) {
      // 保存原始生命周期方法
      const originalOnShow = currentPage.onShow
      const originalOnHide = currentPage.onHide
      const originalOnShareAppMessage = currentPage.onShareAppMessage
      const originalOnShareTimeline = currentPage.onShareTimeline
      const originalOnPullDownRefresh = currentPage.onPullDownRefresh

      // 增强生命周期方法
      currentPage.onShow = function() {
        recordPageShow()
        if (originalOnShow) originalOnShow.call(this)
      }

      currentPage.onHide = function() {
        recordPageHide()
        if (originalOnHide) originalOnHide.call(this)
      }

      currentPage.onShareAppMessage = function(options?: any) {
        recordPageShare('friend')
        return originalOnShareAppMessage ? originalOnShareAppMessage.call(this, options) : {}
      }

      currentPage.onShareTimeline = function() {
        recordPageShare('timeline')
        return originalOnShareTimeline ? originalOnShareTimeline.call(this) : {}
      }

      currentPage.onPullDownRefresh = function() {
        recordPullRefresh()
        if (originalOnPullDownRefresh) originalOnPullDownRefresh.call(this)
      }

      // 清理函数
      return () => {
        if (currentPage) {
          currentPage.onShow = originalOnShow
          currentPage.onHide = originalOnHide
          currentPage.onShareAppMessage = originalOnShareAppMessage
          currentPage.onShareTimeline = originalOnShareTimeline
          currentPage.onPullDownRefresh = originalOnPullDownRefresh
        }
      }
    }
  }, [recordPageShow, recordPageHide, recordPageShare, recordPullRefresh])

  return {
    recordInteraction,
    recordError,
    getMetrics,
    recordPageShow,
    recordPageHide,
    recordPageShare,
    recordPullRefresh
  }
}

/**
 * 全局性能统计
 */
export const getGlobalPerformanceData = (): PerformanceMetrics[] => {
  return Array.from(performanceData.values())
}

/**
 * 清理性能数据
 */
export const clearPerformanceData = (): void => {
  performanceData.clear()
}

/**
 * 性能数据导出
 */
export const exportPerformanceData = (): string => {
  const data = getGlobalPerformanceData()
  return JSON.stringify(data, null, 2)
}
