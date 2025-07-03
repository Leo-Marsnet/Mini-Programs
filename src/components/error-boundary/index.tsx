/**
 * 错误边界组件
 * 用于捕获和处理组件树中的 JavaScript 错误
 */
import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; retry: () => void }>
  onError?: (error: Error, errorInfo: string) => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: ''
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
      errorInfo: error.stack || error.message
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 错误报告逻辑
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // 调用自定义错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack || '')
    }

    // 可以将错误日志上报给服务器
    this.logErrorToService(error, errorInfo)
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo): void => {
    // 这里可以集成错误监控服务，如 Sentry、Bugsnag 等
    console.log('Error logged to service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    })
  }

  private retry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: ''
    })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // 如果有自定义的错误UI，则使用它
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.retry} />
      }

      // 默认的错误UI
      return (
        <View className="error-boundary">
          <View className="error-content">
            <Text className="error-title">😵 出了点问题</Text>
            <Text className="error-message">
              {this.state.error?.message || '发生了未知错误'}
            </Text>
            <View className="error-actions">
              <Button
                className="retry-button"
                onClick={this.retry}
                type="primary"
              >
                重新加载
              </Button>
              <Button
                className="home-button"
                onClick={() => Taro.navigateBack()}
              >
                返回上页
              </Button>
            </View>
            {process.env.NODE_ENV === 'development' && (
              <View className="error-details">
                <Text className="error-stack">
                  {this.state.errorInfo}
                </Text>
              </View>
            )}
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
