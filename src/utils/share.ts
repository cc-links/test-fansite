export const isIOS = (ua = navigator.userAgent) => /iPad|iPhone|iPod/i.test(ua)

export const isAndroid = (ua = navigator.userAgent) => /android/i.test(ua)

export const isInstagram = (ua = navigator.userAgent) => /Instagram/i.test(ua)

export const isTwitter = (ua = navigator.userAgent) => /Twitter/i.test(ua)

export const isFacebook = (ua = navigator.userAgent) => /FBAN|FBAV/i.test(ua)

export const isSocialBrowser = (ua = navigator.userAgent) => isInstagram(ua) || isTwitter(ua) || isFacebook(ua)

export function getEvokeUrlByDevice(url: string, ua: string = navigator.userAgent): string {
  if (isIOS(ua)) return `x-safari-${url}`
  if (isAndroid(ua)) return `intent:${url}#Intent;action=android.intent.action.VIEW;end`

  return url
}

// 通用跳转方法（超时检测）
export function tryOpenWithSysDefaultBrowser(
  targetUrl: string,
  fallback: (() => void) | undefined,
  timeout: number = 2000,
) {
  const timer = setTimeout(() => {
    // 如果2s后页面未失去焦点，认为跳转失败
    window.removeEventListener('blur', handleBlur)
    fallback?.()
  }, timeout)

  const handleBlur = () => {
    clearTimeout(timer)
    window.removeEventListener('blur', handleBlur)
  }

  window.addEventListener('blur', handleBlur)

  window.location.href = getEvokeUrlByDevice(targetUrl)
}
