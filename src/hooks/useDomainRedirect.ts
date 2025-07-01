'use client'

import { BRAND_DOMAIN } from '@/constants'
import { queryDomainPool } from '@/services/domain'
import { getHooksIdBySid } from '@/services/share'
import { isSocialBrowser, tryOpenWithSysDefaultBrowser } from '@/utils/share'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type SearchParamsType = Record<string, string>
/**
 * 唤起默认浏览器
 */
function openDefaultBrowser(url: string) {
  // console.log('openDefaultBrowser', url)

  tryOpenWithSysDefaultBrowser(url, () => {})
}
function replaceCurrentWindowDomain(domain: string, searchParams: SearchParamsType = {}) {
  const url = new URL(window.location.href)
  url.hostname = domain

  for (const key in searchParams) {
    url.searchParams.set(key, searchParams[key])
  }

  return url.toString()
}
function openDefaultBrowserWithDomain(domain: string, searchParams: SearchParamsType = {}) {
  const newUrl = replaceCurrentWindowDomain(domain, searchParams)
  openDefaultBrowser(newUrl)
}
function redirectWithDomain(domain: string, searchParams: SearchParamsType = {}) {
  const newUrl = replaceCurrentWindowDomain(domain, searchParams)
  window.location.href = newUrl
  // window.history.replaceState(null, '', newUrl)
}

/**
 * 域名重定向 - 处理域名防封自动跳转的逻辑
 *
 */
export function useDomainRedirect() {
  // 域名重定向阶段不执行页面逻辑
  const [lock, setLock] = useState(true)

  // const router = useRouter()
  /**
   * query
   * _d: a -> 域名池A b -> 域名池B 其他 -> 品牌域名
   */
  const searchParams = useSearchParams()
  const sid = searchParams?.get('sid')

  const brandDomain = BRAND_DOMAIN
  const currentDomain = window?.location?.origin

  async function redirect() {
    if (!sid) {
      setLock(false)
      return
    }

    if (searchParams?.get('_t') === 'brand') {
      setLock(false)
      return
    }
    // 当前域名属于域名池A
    // 判断条件， 不属于b域名，且不属于品牌域名
    if (searchParams?.get('_t') !== 'b' && currentDomain !== brandDomain) {
      // 判断是否在默认浏览器内, 如果在, 则直接跳转品牌域名
      if (!isSocialBrowser()) {
        // 跳转品牌域名
        redirectWithDomain(brandDomain, {
          _t: '0',
        })
        return
      }
      // 请求域名池B
      try {
        const res = await getHooksIdBySid(sid)
        // 跳转 - 将当前路径重定向到 domain 加上当前路径
        openDefaultBrowserWithDomain(res.domain, {
          _t: 'b',
        })
      } catch (error) {
        console.warn(error, '--------------------------->>>>')
        openDefaultBrowserWithDomain(brandDomain, {
          _t: '0',
        })
      }
      return
    }
    // 当前域名属于域名池B - 此时应该已经在默认浏览器内了
    if (searchParams?.get('_d') === 'b') {
      // TODO: 不用这么生硬的跳转直接重写history即可
      // 跳转品牌域名
      redirectWithDomain(brandDomain, {
        _d: '0',
      })
      return
    }
    setLock(false)
  }

  useEffect(() => {
    redirect()
  }, [])

  return lock
}
