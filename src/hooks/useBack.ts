import { useRouter } from 'next/router'
export default function useBack(defaultPath = '/') {
  const router = useRouter()

  const goBack = () => {
    // 判断是否有历史记录
    if (router?.isReady && history.length > 2 && router?.asPath !== '/') {
      router.back()
    } else {
      router.push(defaultPath || '/') // 没有历史记录则回到首页
    }
  }

  return { goBack }
}
