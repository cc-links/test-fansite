import { request } from '@/common/request'
import { createBusinessErrorCapture } from '@/common/request/utils'
import { HooksItem, TemplateHooksItem } from '@/views/hooks/type'
import { toast } from 'sonner'
interface IGetMyHooksListParams {
  page?: number
  size?: number
}
// 查询my hooks列表
export const getMyHooksList = async (
  params: IGetMyHooksListParams,
): Promise<{
  cursor?: string
  items: HooksItem[]
  hasNext: boolean
  total: number
}> => {
  return request.get('/api/hooks/queryHooksPage', {
    params,
  })
}

// 查询template hooks列表
export const getTemplateHooksList = async (): Promise<TemplateHooksItem[]> => {
  return request.get('/api/hooks/templates')
}

// 新用户引导上报
export const reportNewUserGuide = async (params: { scene: string }): Promise<{ success: boolean }> => {
  return request.post('/api/account/sceneUser', params)
}

// 根据hookId查询hook信息
export const getHookInfo = async (params: { hooksId: string }): Promise<HooksItem> => {
  return request.get('/api/hooks/querySingleHooks', {
    params,
  })
}

// 初始化hook, 根据templateId 获取hooksId
export const callInitHooks = async (params: { templateId?: string }): Promise<{ hooksId: string }> => {
  return request.post('/api/hooks/intHooks', params, {
    customErrorCapture: createBusinessErrorCapture((response) => {
      const { message } = response?.data || {}
      if (response?.status !== 200) {
        toast.error(message, {
          position: 'top-center',
        })
      }
    }),
  })
}

interface SaveHookParams {
  hooksId: string
  hookName: string
  message: string
  price?: number
  vaultIds?: string[]
}
// 保存hook
export const saveHook = async (params: SaveHookParams): Promise<{ success: boolean }> => {
  return request.post('/api/hooks/saveHooks', params, {
    customErrorCapture: createBusinessErrorCapture((response) => {
      const { message } = response?.data || {}
      if (response?.status !== 200) {
        toast.error(message, {
          position: 'top-center',
        })
      }
    }),
  })
}

// 删除hook
export const deleteHook = async (params: { hooksIds: string[] }): Promise<boolean> => {
  return request.post('/api/hooks/deleteHooks', params, {
    customErrorCapture: createBusinessErrorCapture((response) => {
      const { message } = response?.data || {}
      if (response?.status !== 200) {
        toast.error(message, {
          position: 'top-center',
        })
      }
    }),
  })
}

// 生成短链
export const callGenerateShortLink = async (params: { hooksId: string }): Promise<{ linkUrl: string }> => {
  return request.post('/api/hooks/obtainLink', params, {
    customErrorCapture: createBusinessErrorCapture((response) => {
      const { message } = response?.data || {}
      if (response?.status !== 200) {
        toast.error(message, {
          position: 'top-center',
        })
      }
    }),
  })
}
