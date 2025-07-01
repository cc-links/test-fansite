import { getMyHooksList, getTemplateHooksList } from '@/services/hooks'
import { RequestCacheEnum } from '@/types/requestCacheEnum'
import { clearCache, useRequest } from 'ahooks'
import { getMyHooksListStoreFn, useMyHooksListStore } from '@/models/hooks/myHooksList'

// my hooks 列表
export const useMyHooksData = () => {
  const { page, hasNext, cacheItems } = useMyHooksListStore()
  const { setPage, setHasNext, setCacheItems, appendCacheItems, deleteCacheItem, reset } = getMyHooksListStoreFn()

  const { loading, mutate, runAsync } = useRequest(
    (v) => {
      return getMyHooksList({
        size: 10,
        page: v?.isLoadMore ? page : 1,
      })
    },
    {
      cacheKey: RequestCacheEnum.GetMyHooksList,
      staleTime: 1 * 60 * 1000,
      onSuccess: (res) => {
        if (page === 1) {
          // 第一页或刷新时，直接替换数据
          setCacheItems(res?.items || [])
        } else {
          // 加载更多时，追加数据
          appendCacheItems(res?.items || [])
        }
        setHasNext(res?.hasNext || false)
        setPage(page + 1)

        mutate((prev) => {
          if (prev) {
            return {
              ...prev,
              items: cacheItems,
            }
          }
        })
      },
      onBefore: (v: any) => {
        if (!v[0]?.isLoadMore) {
          clearCache(RequestCacheEnum.GetMyHooksList)
          reset()
        }
      },
    },
  )

  const refreshMyHooksData = async () => {
    // 重置全局状态
    clearCache(RequestCacheEnum.GetMyHooksList)
    reset()
    runAsync({ isLoadMore: false })
  }

  const deleteHook = (hooksId: string) => {
    deleteCacheItem(hooksId)
    mutate((prev) => {
      if (prev) {
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== hooksId),
        }
      }
      return prev
    })
  }

  const loadMore = async () => {
    if (!hasNext) return
    clearCache(RequestCacheEnum.GetMyHooksList)
    await runAsync({ isLoadMore: true })
  }

  return {
    data: cacheItems,
    loading,
    refreshAsync: refreshMyHooksData,
    mutateDeleteHook: deleteHook,
    loadMore,
    hasNext,
  }
}

// template hooks 列表
export const useTemplateHooksData = () => {
  const { data, loading } = useRequest(getTemplateHooksList, {
    cacheKey: RequestCacheEnum.GetTemplateHooksList,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  })

  return {
    data,
    loading,
  }
}

// 新用户引导上报
export const useNewUserGuideReport = () => {}
