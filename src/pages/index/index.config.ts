/**
 * 首页配置
 * Taro 3.x 页面配置文件
 */
import { PageConfig } from '@tarojs/taro'

const config: PageConfig = {
  navigationBarTitleText: '小程序首页',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f5f5f5',
  backgroundTextStyle: 'light',
  enablePullDownRefresh: true,
  onReachBottomDistance: 50,
  disableScroll: false
}

export default config
