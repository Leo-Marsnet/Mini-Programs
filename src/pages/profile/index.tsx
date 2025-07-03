import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  getCurrentUser,
  performLogout,
  checkLoginStatus,
  getCurrentOpenId
} from '../../utils'
import { useLoading } from '../../hooks'
import type { UserInfo } from '../../types/common'
import './index.scss'

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [hasLogin, setHasLogin] = useState(false)

  // 使用 useLoading Hook 管理退出登录状态
  const { isLoading: isLoggingOut, execute: executeLogout } = useLoading({
    loadingText: '退出中...',
    successText: '已退出',
    errorText: '退出失败'
  })

  // 初始化用户信息
  const initUserInfo = useCallback(() => {
    const loginStatus = checkLoginStatus()
    setHasLogin(loginStatus)

    if (loginStatus) {
      const currentUser = getCurrentUser()
      const currentOpenId = getCurrentOpenId()
      setUserInfo(currentUser)
      setOpenId(currentOpenId)
    } else {
      // 未登录则跳转到登录页
      Taro.reLaunch({ url: '/pages/login/index' })
    }
  }, [])

  // 处理退出登录
  const handleLogout = useCallback(async () => {
    await executeLogout(async () => {
      await performLogout()
      // 退出成功后跳转到登录页
      Taro.reLaunch({ url: '/pages/login/index' })
    })
  }, [executeLogout])

  // 返回首页
  const goHome = useCallback(() => {
    Taro.reLaunch({ url: '/pages/index/index' })
  }, [])

  // 查看用户协议
  const viewUserAgreement = useCallback(() => {
    Taro.showModal({
      title: '用户协议',
      content: '这里是用户协议内容，实际项目中应该链接到真实的用户协议页面。',
      showCancel: false
    })
  }, [])

  // 查看隐私政策
  const viewPrivacyPolicy = useCallback(() => {
    Taro.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容，实际项目中应该链接到真实的隐私政策页面。',
      showCancel: false
    })
  }, [])

  // 关于我们
  const viewAbout = useCallback(() => {
    Taro.showModal({
      title: '关于我们',
      content: '基于 Taro 3.x + React + TypeScript 的现代化跨端开发模板',
      showCancel: false
    })
  }, [])

  // 意见反馈
  const handleFeedback = useCallback(() => {
    Taro.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！实际项目中可以链接到反馈表单或客服系统。',
      showCancel: false
    })
  }, [])

  // 页面加载时初始化数据
  useEffect(() => {
    initUserInfo()
  }, [initUserInfo])

  // 设置分享
  const onShareAppMessage = useCallback(() => {
    return {
      title: '推荐一个好用的小程序',
      path: '/pages/index/index',
    }
  }, [])

  // 使用 Taro 官方生命周期 Hooks
  Taro.useShareAppMessage(onShareAppMessage)

  return (
    <ScrollView scrollY className="profile-container">
      {/* 用户信息卡片 */}
      <View className="user-card">
        <View className="user-avatar">
          <Image
            className="avatar-image"
            src={userInfo?.avatar || '/assets/images/default-avatar.png'}
            mode="aspectFill"
          />
        </View>
        <View className="user-info">
          <Text className="user-name">{userInfo?.nickname || '未设置昵称'}</Text>
          <Text className="user-id">ID: {userInfo?.id || 'unknown'}</Text>
          <Text className="user-openid">OpenID: {openId || 'unknown'}</Text>
        </View>
      </View>

      {/* 用户详细信息 */}
      <View className="info-section">
        <Text className="section-title">个人信息</Text>
        <View className="info-list">
          <View className="info-item">
            <Text className="info-label">昵称</Text>
            <Text className="info-value">{userInfo?.nickname || '未设置'}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">性别</Text>
            <Text className="info-value">
              {userInfo?.gender === 1 ? '男' : userInfo?.gender === 2 ? '女' : '未设置'}
            </Text>
          </View>
          <View className="info-item">
            <Text className="info-label">地区</Text>
            <Text className="info-value">
              {userInfo?.country && userInfo?.province && userInfo?.city
                ? `${userInfo.country}-${userInfo.province}-${userInfo.city}`
                : '未设置'}
            </Text>
          </View>
          <View className="info-item">
            <Text className="info-label">注册时间</Text>
            <Text className="info-value">
              {userInfo?.createTime ? new Date(userInfo.createTime).toLocaleDateString() : '未知'}
            </Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="menu-section">
        <Text className="section-title">功能菜单</Text>
        <View className="menu-list">
          <View className="menu-item" onClick={viewUserAgreement}>
            <Text className="menu-label">用户协议</Text>
            <Text className="menu-arrow">{'>'}</Text>
          </View>
          <View className="menu-item" onClick={viewPrivacyPolicy}>
            <Text className="menu-label">隐私政策</Text>
            <Text className="menu-arrow">{'>'}</Text>
          </View>
          <View className="menu-item" onClick={handleFeedback}>
            <Text className="menu-label">意见反馈</Text>
            <Text className="menu-arrow">{'>'}</Text>
          </View>
          <View className="menu-item" onClick={viewAbout}>
            <Text className="menu-label">关于我们</Text>
            <Text className="menu-arrow">{'>'}</Text>
          </View>
        </View>
      </View>

      {/* 操作按钮 */}
      <View className="action-section">
        <Button
          className="home-button"
          onClick={goHome}
          disabled={isLoggingOut}
        >
          返回首页
        </Button>

        <Button
          className="logout-button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? '退出中...' : '退出登录'}
        </Button>
      </View>
    </ScrollView>
  )
}

export default Profile
