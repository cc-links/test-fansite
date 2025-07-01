import { request } from '@/common/request'

export interface IgetHooksIdBySidRes {
  userId: string
  domain: string
  mid: string
  hookId: string
  hookType: string
}
export async function getHooksIdBySid(sid: string): Promise<IgetHooksIdBySidRes> {
  return request.get(`/api/share/visit`, {
    params: {
      sid,
    },
  })
}
