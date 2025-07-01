'use client'

import { GLOBAL_URL_PARAMS } from '@/constants'
import { useDomainRedirect } from '@/hooks/useDomainRedirect'
import { getHooksIdBySid } from '@/services/share'
import { useRequest } from 'ahooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// domain-a://share-link?id=12321&cid=123&_h=of&_d=a
// http://localhost:3000/share-link?id=12321&cid=123&_h=of&_d=a
export function ShareLinkPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const domainLock = useDomainRedirect()
  const { runAsync: getHooksIdBySidAsync } = useRequest(getHooksIdBySid, {
    manual: true,
    retryCount: 1,
  })
  const sid = searchParams?.get('sid')

  const initHooksInfo = async () => {
    if (!sid) return
    try {
      const res = await getHooksIdBySidAsync(sid)
      // 跳转到message页面
      if (res) {
        GLOBAL_URL_PARAMS.HOOKS_ID = res.hookId
        router.push(`/message/${res.userId}`)
      }
    } catch (error) {
      console.log(error, '--------------------------->>>>')
      router.push(`/`)
    }
    // 个人主页
    // router.push(`/creator-share/${searchParams?.get('sid')}?id=${searchParams?.get('id')}`)
    // const res = await getHooksIdBySidAsync(searchParams?.get('sid') || '')
  }
  useEffect(() => {
    if (domainLock) return
    initHooksInfo()
  }, [domainLock])

  // publish-TODO: 这里应该换成引导用户使用默认浏览器打开的教程
  return <>loading</>
}

export default ShareLinkPage
