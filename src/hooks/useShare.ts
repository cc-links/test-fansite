import { useState, useCallback } from 'react'

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

interface UseShareReturn {
  isSupported: boolean
  share: (data: ShareData) => Promise<void>
  isSharing: boolean
  error: Error | null
}

export const useShare = (): UseShareReturn => {
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 检查浏览器是否支持分享功能
  const isSupported = typeof navigator !== 'undefined' && !!navigator.share

  const share = useCallback(
    async (data: ShareData) => {
      if (!isSupported) {
        setError(new Error('浏览器不支持分享功能'))
        return
      }

      try {
        setIsSharing(true)
        setError(null)
        await navigator.share(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('分享失败'))
      } finally {
        setIsSharing(false)
      }
    },
    [isSupported],
  )

  return {
    isSupported,
    share,
    isSharing,
    error,
  }
}
