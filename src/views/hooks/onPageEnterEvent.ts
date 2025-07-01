import { changeUserInfoItem, useUserInfo } from '@/models/user'
import { reportNewUserGuide } from '@/services/hooks'
import { useEffect } from 'react'

interface Iprops {
  callback?: () => void
}
export const useOnPageEnterEventHooks = (props: Iprops) => {
  const { callback } = props
  const userInfo = useUserInfo()
  const { sceneOldUser } = userInfo || {}
  const isHooksOldUser = sceneOldUser?.hooks

  const onHooksNewUserReport = async () => {
    const res = await reportNewUserGuide({
      scene: 'hooks',
    })
    if (res?.success) {
      // 更新userInfo的信息
      changeUserInfoItem({
        hooks: true,
      })
    }
  }

  useEffect(() => {
    // 如果是新用户
    if (!isHooksOldUser && callback) {
      // 执行回调后， 调用上报接口
      callback()
      onHooksNewUserReport()
    }
  }, [isHooksOldUser])
}
