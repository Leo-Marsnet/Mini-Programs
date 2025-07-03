import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { request, loading, storage } from '../../utils'
import { useLoading, usePagePerformance, useAuth } from '../../hooks'
import { useSystemActions, useSystemInfo } from '../../store/global'
import type { SystemInfo } from '../../types/common'
import './index.scss'

const Index: React.FC = () => {
  // 页面性能监控
  const { recordInteraction, recordError } = usePagePerformance('Index')

  // 使用新的认证 Hook
  const {
    userInfo,
    hasLogin,
    login,
    logout,
    silentLogin,
    checkAndSyncLogin,
    isLogging,
    isLoggingOut,
    navigateToProfile
  } = useAuth()

  // 系统信息管理
  const { setSystemInfo } = useSystemActions()
  const systemInfo = useSystemInfo()

  // 页面状态
  const [greeting, setGreeting] = useState<string>('欢迎使用小程序模板')
  const [currentTime, setCurrentTime] = useState<string>('')
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  // 初始化页面数据
  const initPageData = useCallback(() => {
    const systemInfo = Taro.getSystemInfoSync() as SystemInfo
    setSystemInfo(systemInfo)
    updateGreeting()
    checkAndSyncLogin()
    silentLogin() // 尝试静默登录获取 openid
  }, [setSystemInfo, checkAndSyncLogin, silentLogin])

  // 设置问候语
  const updateGreeting = useCallback(() => {
    const hour = new Date().getHours()
    let newGreeting = '欢迎使用小程序模板'

    if (hour < 6) {
      newGreeting = '夜深了，注意休息'
    } else if (hour < 12) {
      newGreeting = '早上好！'
    } else if (hour < 18) {
      newGreeting = '下午好！'
    } else {
      newGreeting = '晚上好！'
    }

    setGreeting(newGreeting)
  }, [])

  // 使用 useLoading Hook 管理刷新状态
  const { isLoading: isRefreshing, execute: executeRefresh } = useLoading({
    loadingText: '刷新中...',
    successText: '刷新成功',
    errorText: '刷新失败'
  })

  // 刷新数据
  const refreshData = useCallback(async () => {
    await executeRefresh(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateGreeting()
    })
  }, [executeRefresh, updateGreeting])

  // 处理登录（必须在用户点击按钮时调用）
  const handleLogin = useCallback(async () => {
    try {
      recordInteraction('login_attempt')
      // 使用新的 useAuth Hook 中的 login 方法
      await login()
      recordInteraction('login_success')
    } catch (error: any) {
      console.error('登录操作失败:', error)
      recordError(error)
    }
  }, [login, recordInteraction, recordError])

  // 处理退出登录
  const handleLogout = useCallback(async () => {
    try {
      recordInteraction('logout_attempt')
      await logout()
      recordInteraction('logout_success')
    } catch (error: any) {
      console.error('退出登录操作失败:', error)
      recordError(error)
    }
  }, [logout, recordInteraction, recordError])

  // 跳转到个人资料页
  const goToProfile = useCallback(() => {
    navigateToProfile()
  }, [navigateToProfile])

  // 使用 useLoading Hook 管理API调用状态
  const { isLoading: isApiTesting, execute: executeApiTest } = useLoading({
    loadingText: '请求中...',
    successText: '请求成功',
    errorText: '请求失败'
  })

  // 测试API调用
  const testApiCall = useCallback(async () => {
    recordInteraction('api_test_click')
    await executeApiTest(async () => {
      // 使用新的TypeScript版本的request工具
      // const res = await request.get<any>('/api/test')
      await new Promise(resolve => setTimeout(resolve, 500))
    })
  }, [executeApiTest, recordInteraction])

  // 下拉刷新
  const onPullDownRefresh = useCallback(async () => {
    console.log('Index page onPullDownRefresh')
    try {
      await refreshData()
    } finally {
      Taro.stopPullDownRefresh()
    }
  }, [refreshData])

  // 分享到好友
  const onShareAppMessage = useCallback(() => {
    return {
      title: '推荐一个好用的小程序',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share-default.png',
    }
  }, [])

  // 分享到朋友圈
  const onShareTimeline = useCallback(() => {
    return {
      title: '推荐一个好用的小程序',
      imageUrl: '/assets/images/share-default.png',
    }
  }, [])

  // 组件挂载和清理
  useEffect(() => {
    console.log('Index page onLoad')
    initPageData()

    // 设置时间更新定时器
    const timerInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    setTimer(timerInterval)

    // 清理函数
    return () => {
      console.log('Index page onUnload')
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [initPageData])

  // 页面显示时
  useEffect(() => {
    console.log('Index page onShow')
    refreshData()
  }, [refreshData])

  // 使用 Taro 官方生命周期 Hooks
  Taro.usePullDownRefresh(onPullDownRefresh)
  Taro.useShareAppMessage(onShareAppMessage)
  Taro.useShareTimeline(onShareTimeline)

  return (
    <View className="index-container">
      {/* 头部信息 */}
      <View className="header-section">
        <Text className="greeting">{greeting}</Text>
        <Text className="current-time">{currentTime}</Text>
      </View>

      {/* 用户信息区域 */}
      <View className="user-section">
        {hasLogin && userInfo ? (
          <View className="user-info">
            <View className="user-avatar" onClick={goToProfile}>
              {userInfo.avatar ? (
                <Image src={userInfo.avatar} className="avatar-image" />
              ) : (
                <View className="default-avatar">
                  <Text>{userInfo.nickname?.[0] || '用'}</Text>
                </View>
              )}
            </View>
            <View className="user-details">
              <Text className="user-name">{userInfo.nickname || '用户'}</Text>
              <Text className="user-desc">点击头像查看资料</Text>
            </View>
            <Button className="logout-btn" onClick={handleLogout}>
              退出登录
            </Button>
          </View>
        ) : (
          <View className="login-section">
            <Text className="login-tip">请先登录以获得更好的体验</Text>
            <Button className="login-btn" onClick={handleLogin}>
              立即登录
            </Button>
          </View>
        )}
      </View>

      {/* 功能区域 */}
      <View className="function-section">
        <View className="function-title">
          <Text>功能演示</Text>
        </View>

        <View className="function-grid">
          <View className="function-item" onClick={testApiCall}>
            <Text className="function-name">API测试</Text>
            <Text className="function-desc">测试网络请求</Text>
          </View>

          <View className="function-item" onClick={refreshData}>
            <Text className="function-name">刷新数据</Text>
            <Text className="function-desc">手动刷新页面</Text>
          </View>

          <View className="function-item" onClick={() => loading.confirm('这是一个确认对话框')}>
            <Text className="function-name">对话框</Text>
            <Text className="function-desc">显示确认框</Text>
          </View>

          <View className="function-item" onClick={() => {
            storage.set('test', { value: '测试数据', timestamp: Date.now() })
            loading.showSuccess('数据已保存')
          }}>
            <Text className="function-name">本地存储</Text>
            <Text className="function-desc">测试存储功能</Text>
          </View>
        </View>
      </View>

      {/* 系统信息区域 */}
      {systemInfo && (
        <View className="system-section">
          <View className="system-title">
            <Text>系统信息</Text>
          </View>
          <View className="system-info">
            <Text className="info-item">设备品牌: {systemInfo.brand}</Text>
            <Text className="info-item">设备型号: {systemInfo.model}</Text>
            <Text className="info-item">系统版本: {systemInfo.system}</Text>
            <Text className="info-item">微信版本: {systemInfo.version}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default Index
