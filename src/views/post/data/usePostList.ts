import { postApiPostPostRecommend } from '@/services/post'
import { useRequest } from 'ahooks'

export function usePostList() {
  const { data, loading } = useRequest(postApiPostPostRecommend, {
    refreshDeps: [],
  })
}
