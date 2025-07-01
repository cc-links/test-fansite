'use client'
export * from './rum'
export * from './logs'

import { datadogRum } from '@datadog/browser-rum'
import { datadogLogs } from '@datadog/browser-logs'
import { IUserInfo } from '@/types'
import { DATADOG_RUM_ALLOWEDUSERS } from '@/constants'
export function setDataDogUserScope(user: IUserInfo) {
  datadogRum.setUser(user as any)
  // 设置usr字段
  datadogLogs.setUser(user as any)
  // datadogLogs.setGlobalContext({
  //   userInfo: user,
  // })

  const allowedUsers = DATADOG_RUM_ALLOWEDUSERS // 允许上报的用户ID列表
  if (allowedUsers?.length > 0 && user?.userId && allowedUsers.includes(user?.userId as any)) {
    // 开始Replay会话重播录制
    window.DD_RUM?.startSessionReplayRecording?.()
  }
}
