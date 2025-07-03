/**
 * 加载状态管理 Hook
 * 提供更简洁的加载状态管理方案
 */
import { useState, useCallback, useRef } from 'react'
import { loading } from '../utils'

interface UseLoadingOptions {
  showLoading?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  autoHide?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UseLoadingReturn {
  isLoading: boolean
  execute: <T>(asyncFn: () => Promise<T>) => Promise<T | undefined>
  reset: () => void
}

export const useLoading = (options: UseLoadingOptions = {}): UseLoadingReturn => {
  const {
    showLoading = true,
    loadingText = '加载中...',
    successText = '操作成功',
    errorText = '操作失败',
    autoHide = true,
    onSuccess,
    onError
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const loadingRef = useRef<boolean>(false)

  const execute = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | undefined> => {
    if (loadingRef.current) {
      console.warn('Another async operation is in progress')
      return undefined
    }

    try {
      setIsLoading(true)
      loadingRef.current = true

      if (showLoading) {
        loading.show(loadingText)
      }

      const result = await asyncFn()

      if (showLoading && successText) {
        loading.hide()
        loading.showSuccess(successText)
      }

      if (onSuccess) {
        onSuccess()
      }

      return result
    } catch (error) {
      console.error('Async operation failed:', error)

      if (showLoading && errorText) {
        loading.hide()
        loading.showError(errorText)
      }

      if (onError && error instanceof Error) {
        onError(error)
      }

      throw error
    } finally {
      setIsLoading(false)
      loadingRef.current = false

      if (showLoading && autoHide) {
        loading.hide()
      }
    }
  }, [showLoading, loadingText, successText, errorText, autoHide, onSuccess, onError])

  const reset = useCallback(() => {
    setIsLoading(false)
    loadingRef.current = false
    if (showLoading) {
      loading.hide()
    }
  }, [showLoading])

  return {
    isLoading,
    execute,
    reset
  }
}

/**
 * 数据获取 Hook
 * 专门用于处理数据获取逻辑
 */
export const useAsyncData = <T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const { isLoading, execute } = useLoading({
    showLoading: false,
    onError: setError
  })

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const result = await execute(fetchFn)
      if (result !== undefined) {
        setData(result)
      }
    } catch (err) {
      // 错误已经在 useLoading 中处理
    }
  }, [execute, fetchFn])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    error,
    isLoading,
    refresh,
    fetchData
  }
}

/**
 * 表单提交 Hook
 * 专门用于处理表单提交逻辑
 */
export const useFormSubmit = <T = any>(
  submitFn: (data: T) => Promise<void>,
  options: UseLoadingOptions = {}
) => {
  const { isLoading, execute } = useLoading({
    loadingText: '提交中...',
    successText: '提交成功',
    errorText: '提交失败',
    ...options
  })

  const submit = useCallback(async (data: T) => {
    await execute(() => submitFn(data))
  }, [execute, submitFn])

  return {
    isLoading,
    submit
  }
}

/**
 * 批量操作 Hook
 * 用于处理批量操作的加载状态
 */
export const useBatchOperation = <T>(
  batchFn: (items: T[]) => Promise<void>,
  options: UseLoadingOptions = {}
) => {
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)

  const { isLoading, execute } = useLoading({
    showLoading: false,
    ...options
  })

  const executeBatch = useCallback(async (items: T[]) => {
    setTotal(items.length)
    setProgress(0)

    if (items.length === 0) return

    loading.show(`处理中... (0/${items.length})`)

    try {
      await execute(async () => {
        for (let i = 0; i < items.length; i++) {
          await batchFn([items[i]])
          setProgress(i + 1)
          loading.show(`处理中... (${i + 1}/${items.length})`)
        }
      })
    } finally {
      loading.hide()
    }
  }, [execute, batchFn])

  return {
    isLoading,
    progress,
    total,
    executeBatch
  }
}
