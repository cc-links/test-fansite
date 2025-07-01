import { callGenerateShortLink } from '@/services/hooks'
import { useRequest } from 'ahooks'
import { useEffect, useState } from 'react'

interface IProps {
  hooksId?: string
}
export const useSharePageEnterEvent = (props: IProps) => {
  const [link, setLink] = useState<string>()
  const { hooksId } = props
  const {
    runAsync: callGenerateShortLinkAsync,
    loading: callGenerateShortLinkLoading,
    error: callGenerateShortLinkError,
  } = useRequest(callGenerateShortLink, { manual: true })
  const init = async () => {
    if (!hooksId) return
    const res = await callGenerateShortLinkAsync({ hooksId })
    if (res?.linkUrl) {
      setLink(res?.linkUrl)
    }
  }
  useEffect(() => {
    if (!hooksId) return
    init()
  }, [hooksId])
  return {
    link,
    callGenerateShortLinkLoading,
    callGenerateShortLinkError,
  }
}
