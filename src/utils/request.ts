/**
 * 网络请求工具类 (TypeScript版本)
 * 基于 Taro API 封装，支持拦截器、错误处理、超时重试等功能
 */
import Taro from '@tarojs/taro'
import type {
  RequestConfig,
  ApiResponse,
  HttpError
} from '../types/common'
import { StorageKeys } from '../types/common'
import { API_BASE_URL, API_TIMEOUT, MAX_RETRY_COUNT, PAGE_PATHS, NETWORK_CONFIG } from '../config/constants'

// 状态码映射
const STATUS_CODE_MAP: Record<number, string> = {
  200: '请求成功',
  201: '创建成功',
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// 默认配置
const DEFAULT_CONFIG: RequestConfig = {
  url: '',
  method: 'GET',
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  retryCount: MAX_RETRY_COUNT,
  retryDelay: NETWORK_CONFIG.RETRY_DELAY,
  showLoading: false,
  loadingText: '请求中...',
  autoHandleError: true,
  header: {}
}

// 自定义HTTP错误类
class HttpRequestError extends Error implements HttpError {
  code?: number
  statusCode?: number
  data?: any
  config?: RequestConfig

  constructor(message: string, statusCode?: number, data?: any, config?: RequestConfig) {
    super(message)
    this.name = 'HttpRequestError'
    this.code = statusCode
    this.statusCode = statusCode
    this.data = data
    this.config = config
  }
}

// 请求拦截器类型
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>

// 响应拦截器类型
type ResponseInterceptor<T = any> = (response: T) => T | Promise<T>

class Request {
  private config: RequestConfig
  private interceptors: {
    request: RequestInterceptor[]
    response: ResponseInterceptor[]
  }
  private pendingRequests: Map<string, Promise<any>>

  constructor(config: Partial<RequestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.interceptors = {
      request: [],
      response: []
    }
    this.pendingRequests = new Map()
    this.init()
  }

  private init(): void {
    // 添加默认请求拦截器
    this.interceptors.request.push(this.defaultRequestInterceptor.bind(this))
    // 添加默认响应拦截器
    this.interceptors.response.push(this.defaultResponseInterceptor.bind(this))
  }

  /**
   * 默认请求拦截器
   */
  private defaultRequestInterceptor(config: RequestConfig): RequestConfig {
    // 添加token
    const token = Taro.getStorageSync(StorageKeys.TOKEN)
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      }
    }

    // 添加通用header
    config.header = {
      'Content-Type': 'application/json',
      ...config.header
    }

    return config
  }

  /**
   * 默认响应拦截器
   */
  private defaultResponseInterceptor<T = any>(response: Taro.request.SuccessCallbackResult): T {
    const { statusCode, data } = response

    // HTTP状态码检查
    if (statusCode >= 200 && statusCode < 300) {
      // 检查业务状态码
      if (data && typeof data === 'object' && 'code' in data) {
        if (data.code === 0 || data.code === 200) {
          return data as T
        } else {
          // 业务错误处理
          const errorMessage = data.message || data.msg || '业务处理失败'
          throw new HttpRequestError(errorMessage, data.code, data, this.config)
        }
      }
      return data as T
    }

    // 处理特殊状态码
    if (statusCode === 401) {
      // 清除token并跳转到登录页
      Taro.removeStorageSync(StorageKeys.TOKEN)
      Taro.removeStorageSync(StorageKeys.USER_INFO)
      Taro.reLaunch({ url: PAGE_PATHS.LOGIN })
      throw new HttpRequestError('登录已过期，请重新登录', statusCode, data)
    }

    const errorMessage = STATUS_CODE_MAP[statusCode] || `请求失败(${statusCode})`
    throw new HttpRequestError(errorMessage, statusCode, data)
  }

  /**
   * 生成请求唯一标识
   */
  private generateRequestKey(config: RequestConfig): string {
    const { url, method, data } = config
    return `${method}:${url}:${JSON.stringify(data || {})}`
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.request.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor<T = any>(interceptor: ResponseInterceptor<T>): void {
    this.interceptors.response.push(interceptor)
  }

  /**
   * 核心请求方法
   */
  async request<T = any>(options: Partial<RequestConfig>): Promise<T> {
    let config: RequestConfig = { ...this.config, ...options }

    // 处理URL
    if (!config.url.startsWith('http')) {
      config.url = (config.baseURL || '') + config.url
    }

    // 应用请求拦截器
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config)
    }

    // 请求去重
    const requestKey = this.generateRequestKey(config)
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)
    }

    // 显示加载状态
    if (config.showLoading) {
      Taro.showLoading({
        title: config.loadingText || '请求中...',
        mask: true
      })
    }

    const requestPromise = this.executeRequest<T>(config)
    this.pendingRequests.set(requestKey, requestPromise)

    try {
      const response = await requestPromise

      // 应用响应拦截器
      let result = response
      for (const interceptor of this.interceptors.response) {
        result = await interceptor(result)
      }

      return result
    } catch (error) {
      // 统一错误处理
      if (config.autoHandleError) {
        if (error instanceof HttpRequestError) {
          this.handleError(error, config)
        } else {
          // 未知错误
          const unknownError = new HttpRequestError(
            '网络请求异常，请稍后重试',
            undefined,
            undefined,
            config
          )
          this.handleError(unknownError, config)
        }
      }
      throw error
    } finally {
      // 清理
      this.pendingRequests.delete(requestKey)
      if (config.showLoading) {
        Taro.hideLoading()
      }
    }
  }

  /**
   * 执行请求（支持重试）
   */
  private async executeRequest<T = any>(config: RequestConfig, retryCount = 0): Promise<T> {
    try {
      const response = await Taro.request({
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        header: config.header,
        timeout: config.timeout,
        dataType: 'json',
        responseType: 'text'
      })

      return response as T
    } catch (error) {
      // 网络错误重试
      if (retryCount < (config.retryCount || 0) && this.shouldRetry(error)) {
        await this.delay((config.retryDelay || 1000) * (retryCount + 1))
        return this.executeRequest<T>(config, retryCount + 1)
      }

      // 封装错误信息
      if (error instanceof Error) {
        throw new HttpRequestError(error.message, undefined, undefined, config)
      }

      throw new HttpRequestError('网络请求失败', undefined, undefined, config)
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any): boolean {
    // 网络错误、超时等情况可以重试
    if (!error.statusCode) return true

    // 5xx 服务器错误可以重试
    if (error.statusCode >= 500 && error.statusCode < 600) return true

    // 408 请求超时可以重试
    if (error.statusCode === 408) return true

    return false
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 统一错误处理
   */
  private handleError(error: HttpRequestError, config: RequestConfig): void {
    // 显示错误提示
    this.showErrorToast(error)

    // 错误监控上报
    this.reportError(error, config)
  }

  /**
   * 显示错误提示
   */
  private showErrorToast(error: HttpRequestError): void {
    // 根据错误类型决定提示方式
    if (error.statusCode === 401) {
      // 401错误不显示toast，因为会跳转到登录页
      return
    }

    // 特殊错误码的友好提示
    let message = error.message
    if (error.statusCode === 404) {
      message = '请求的资源不存在'
    } else if (error.statusCode === 500) {
      message = '服务器繁忙，请稍后重试'
    } else if (error.statusCode === 503) {
      message = '服务暂时不可用'
    }

    Taro.showToast({
      title: message || '请求失败',
      icon: 'error',
      duration: 2000
    })
  }

  /**
   * 错误监控上报
   */
  private reportError(error: HttpRequestError, config: RequestConfig): void {
    // 构造错误信息
    const errorInfo = {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      url: config.url,
      method: config.method,
      data: config.data,
      timestamp: new Date().toISOString(),
      userAgent: Taro.getSystemInfoSync().system
    }

    // 开发环境仅打印日志
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorInfo)
      return
    }

    // 生产环境可以集成错误监控服务
    // 例如：Sentry、Bugsnag、阿里云日志等
    try {
      // 示例：集成Sentry
      // Sentry.captureException(error, { extra: errorInfo })

      // 示例：上报到自定义错误收集接口
      // this.post('/api/errors', errorInfo, { autoHandleError: false })

      console.log('Error reported:', errorInfo)
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, params?: Record<string, any>, options: Partial<RequestConfig> = {}): Promise<T> {
    // 处理查询参数
    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&')

      url = url + (url.includes('?') ? '&' : '?') + queryString
    }

    return this.request<T>({
      url,
      method: 'GET',
      ...options
    })
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }

  /**
   * PATCH请求
   */
  patch<T = any>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...options
    })
  }

  /**
   * 文件上传
   */
  upload<T = any>(
    url: string,
    filePath: string,
    formData: Record<string, any> = {},
    options: Partial<RequestConfig> = {}
  ): Promise<T> {
    const config = { ...this.config, ...options }

    // 处理URL
    if (!url.startsWith('http')) {
      url = (config.baseURL || '') + url
    }

    // 添加token
    const token = Taro.getStorageSync(StorageKeys.TOKEN)
    const header = { ...config.header }
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    return new Promise((resolve, reject) => {
      if (config.showLoading) {
        Taro.showLoading({
          title: config.loadingText || '上传中...',
          mask: true
        })
      }

      Taro.uploadFile({
        url,
        filePath,
        name: 'file',
        formData,
        header,
        timeout: config.timeout,
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (error) {
            resolve(res.data as T)
          }
        },
        fail: (error) => {
          const httpError = new HttpRequestError(
            error.errMsg || '上传失败',
            undefined,
            undefined,
            config
          )

          if (config.autoHandleError) {
            Taro.showToast({
              title: httpError.message,
              icon: 'error',
              duration: 2000
            })
          }

          reject(httpError)
        },
        complete: () => {
          if (config.showLoading) {
            Taro.hideLoading()
          }
        }
      })
    })
  }

  /**
   * 文件下载
   */
  download(url: string, options: Partial<RequestConfig> = {}): Promise<Taro.downloadFile.FileSuccessCallbackResult> {
    const config = { ...this.config, ...options }

    // 处理URL
    if (!url.startsWith('http')) {
      url = (config.baseURL || '') + url
    }

    // 添加token
    const token = Taro.getStorageSync(StorageKeys.TOKEN)
    const header = { ...config.header }
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    return new Promise((resolve, reject) => {
      if (config.showLoading) {
        Taro.showLoading({
          title: config.loadingText || '下载中...',
          mask: true
        })
      }

      Taro.downloadFile({
        url,
        header,
        timeout: config.timeout,
        success: resolve,
        fail: (error) => {
          const httpError = new HttpRequestError(
            error.errMsg || '下载失败',
            undefined,
            undefined,
            config
          )

          if (config.autoHandleError) {
            Taro.showToast({
              title: httpError.message,
              icon: 'error',
              duration: 2000
            })
          }

          reject(httpError)
        },
        complete: () => {
          if (config.showLoading) {
            Taro.hideLoading()
          }
        }
      })
    })
  }

  /**
   * 取消所有请求
   */
  cancelAll(): void {
    this.pendingRequests.clear()
  }
}

// 创建默认实例
const request = new Request()

export default request
export { Request, HttpRequestError }
export type { RequestConfig, HttpError }
