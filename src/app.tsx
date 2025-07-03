import React, { useEffect, ReactNode } from 'react'
import ErrorBoundary from '@/components/error-boundary'
import { useGlobalData } from '@/store/global'
import './app.scss'

interface AppProps {
  children: ReactNode
}

/**
 * 应用主组件 - 函数式组件
 */
const App: React.FC<AppProps> = ({ children }) => {
  // 全局数据管理
  const { setGlobalData, getGlobalData } = useGlobalData()

  /**
   * 全局错误处理
   */
  const handleGlobalError = (error: Error, errorInfo: string): void => {
    console.error('Global error caught:', error, errorInfo)

    // 错误上报
    reportError(error, errorInfo)
  }

  /**
   * 上报错误到监控服务
   */
  const reportError = (error: Error, errorInfo: string): void => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo,
      timestamp: new Date().toISOString(),
      url: (typeof window !== 'undefined' && window.location?.href) || 'unknown',
      userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) || 'unknown',
      platform: process.env.TARO_ENV || 'unknown'
    }

    // 开发环境仅打印日志
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', errorData)
      return
    }

    // 生产环境上报到错误监控服务
    try {
      // 示例：可以集成 Sentry 或其他错误监控服务
      // Sentry.captureException(error, { extra: errorData })

      // 示例：上报到自定义错误收集接口
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // })

      console.log('Error reported to monitoring service:', errorData)
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }

  // 应用初始化
  useEffect(() => {
    console.log('App mounted')

    // 应用启动时的初始化逻辑
    setGlobalData('appStartTime', Date.now())

    return () => {
      console.log('App unmounted')
    }
  }, [setGlobalData])

  return (
    <ErrorBoundary onError={handleGlobalError}>
      {children}
    </ErrorBoundary>
  )
}

export default App
