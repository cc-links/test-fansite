import { XImClient } from '@/npm/x-im'
import { ON_IM_MESSAGE } from './dealImMessage'
import { request } from '../request'
import { getActiveAccountId, getIsTourist, getUserInfo } from '@/models/user'
import { EnumLoginMode } from '@/types'
import { Schedule } from '@hb-common/utils'

const schedule = new Schedule({
  clockInterval: 10 * 60 * 1000,
})

export const xim = new XImClient({
  services: {
    queryNimToken: async () => {
      // 如果是匿名用户
      if (getIsTourist()) {
        schedule.removeScheduleTask('nimToken')
        schedule.createScheduleTask(
          'nimToken',
          {
            interval: 60 * 1000,
          },
          async () => {
            // 添加容错，如果用户切换到非匿名用户，则移除定时器
            if (!getIsTourist()) {
              schedule.removeScheduleTask('nimToken')
              return
            }
            await xim.disconnect()
            // connect会触发queryNimToken
            xim.connect()
          },
        )
        return request.get('/api/im/account/anonymous', {
          params: {
            userId: getActiveAccountId(),
          },
        })
      }
      // 如果非匿名用户
      // 先移除匿名用户定时器
      schedule.removeScheduleTask('nimToken')
      return request.get('/api/im/account', {
        params: {
          userId: getActiveAccountId(),
        },
      })
    },
  },
})

xim.onMessage((message) => {
  ON_IM_MESSAGE(message)
})

xim.onError((error) => {
  console.error(error)
})
