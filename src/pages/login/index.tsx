import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { performAuthLogin, checkLoginStatus } from '../../utils'
import { useLoading } from '../../hooks'
import type { UserInfo } from '../../types/common'
import './index.scss'

const Login: React.FC = () => {
  const [hasLogin, setHasLogin] = useState(false)

  // 使用 useLoading Hook 管理登录状态
  const { isLoading: isLogging, execute: executeLogin } = useLoading({
    loadingText: '登录中...',
    successText: '登录成功',
    errorText: '登录失败'
  })

  // 检查登录状态
  const checkLogin = useCallback(() => {
    const loginStatus = checkLoginStatus()
    setHasLogin(loginStatus)

    // 如果已经登录，自动返回首页
    if (loginStatus) {
      Taro.reLaunch({ url: '/pages/index/index' })
    }
  }, [])

  // 处理微信授权登录
  const handleWechatLogin = useCallback(async () => {
    await executeLogin(async () => {
      // ⚠️ 注意：这个函数只能在用户点击按钮的事件处理函数中调用
      const result = await performAuthLogin()
      console.log('登录成功:', result)

      // 登录成功后跳转到首页
      Taro.reLaunch({ url: '/pages/index/index' })
    })
  }, [executeLogin])

  // 返回首页
  const goBack = useCallback(() => {
    Taro.navigateBack()
  }, [])

  // 页面加载时检查登录状态
  useEffect(() => {
    checkLogin()
  }, [checkLogin])

  return (
    <View className="login-container">
      <View className="login-header">
        <Image
          className="logo"
          src="/assets/images/logo.png"
          mode="aspectFit"
        />
        <Text className="app-name">小程序模板</Text>
        <Text className="app-desc">基于 Taro 3.x + React + TypeScript</Text>
      </View>

      <View className="login-content">
        <View className="welcome-text">
          <Text className="welcome-title">欢迎使用</Text>
          <Text className="welcome-subtitle">请登录后继续使用</Text>
        </View>

        <View className="auth-section">
          <Text className="auth-tips">
            为了给您提供更好的服务，需要获取您的基本信息
          </Text>

          <Button
            className="auth-button"
            onClick={handleWechatLogin}
            disabled={isLogging}
          >
            {isLogging ? '登录中...' : '微信授权登录'}
          </Button>

          <View className="auth-notice">
            <Text className="notice-text">
              点击"微信授权登录"即表示您同意我们的服务条款和隐私政策
            </Text>
          </View>
        </View>

        <View className="login-footer">
          <Button
            className="back-button"
            onClick={goBack}
            disabled={isLogging}
          >
            返回
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Login
