import { create } from 'zustand'
import { HooksItem } from '@/views/hooks/type'
import { generateAccountCacheStoreFn } from '@/common/cmv'
import { getActiveAccountId } from '../user'

interface MyHooksStoreState {
  // 分页相关
  page: number
  hasNext: boolean
  cacheItems: HooksItem[]
}

const initialState = () => ({
  page: 1,
  hasNext: true,
  cacheItems: [],
})

const useStore = create<MyHooksStoreState>(() => ({
  ...initialState(),
}))

const storeFn = generateAccountCacheStoreFn({ store: useStore })
export const useMyHooksListStore = () => useStore()

export const getMyHooksListStoreFn = () => {
  const accountId = getActiveAccountId()!
  return {
    setPage: (page: number) => storeFn.setState(accountId, { page }),
    setHasNext: (hasNext: boolean) => storeFn.setState(accountId, { hasNext }),
    setCacheItems: (items: HooksItem[]) => storeFn.setState(accountId, { cacheItems: items }),
    appendCacheItems: (items: HooksItem[]) => {
      const { cacheItems } = storeFn.getState(accountId)
      storeFn.setState(accountId, { cacheItems: [...cacheItems, ...items] })
    },
    deleteCacheItem: (hooksId: string) => {
      const { cacheItems } = storeFn.getState(accountId)
      storeFn.setState(accountId, { cacheItems: cacheItems.filter((item) => item.id !== hooksId) })
    },
    reset: () => {
      storeFn.setState(accountId, initialState())
      console.log(storeFn.getState(accountId), '--------------------------->>>>')
    },
  }
}
