import { useEffect, useState } from 'react'
import { EditHookMode, HooksItem, TemplateHooksItem } from '../../type'
import { useRequest } from 'ahooks'
import { callInitHooks, getHookInfo } from '@/services/hooks'

type ItemType = HooksItem & TemplateHooksItem
interface Iprops {
  mode: EditHookMode
  templateId?: string
  id?: string
  callback?: (v?: ItemType) => void
  item?: ItemType
}
export const useEditHooksEnterEvent = (props: Iprops) => {
  const { mode, templateId, id, callback, item } = props
  const [hooksId, setHooksId] = useState<string>()
  const {
    runAsync: callInitHooksAsync,
    loading: initLoading,
    error: initError,
  } = useRequest(callInitHooks, { manual: true })
  const {
    runAsync: getHookInfoAsync,
    loading: getHookInfoLoading,
    error: getHookInfoError,
  } = useRequest(getHookInfo, { manual: true })

  const init = async () => {
    if (mode === EditHookMode.CREATE_BY_TEMPLATE_HOOKS) {
      callback?.(item)
      const res = await callInitHooksAsync({
        templateId,
      })
      if (res?.hooksId) {
        setHooksId(res?.hooksId)
      }
    }
    if (mode === EditHookMode.VIEW) {
      console.log('view')
    }
    if (mode === EditHookMode.CREATE_BY_EMPTY) {
      console.log('create')
      const res = await callInitHooksAsync({})
      if (res?.hooksId) {
        setHooksId(res?.hooksId)
      }
    }
    if (mode === EditHookMode.EDIT_HOOKS) {
      setHooksId(item?.id)
      if (item) {
        item.name = item.hookName
      }
      callback?.(item)
    }
    if (mode === EditHookMode.SHARE) {
      setHooksId(item?.id)
      if (item) {
        item.name = item.hookName
      }
      callback?.(item)
    }
  }
  useEffect(() => {
    init()
  }, [mode])

  return {
    initLoading,
    initError: !!initError,
    hooksId,
  }
}
