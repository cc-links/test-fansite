'use client'
// https://docs.datadoghq.com/real_user_monitoring/browser/setup/client/?tab=rum
import { datadogRum } from '@datadog/browser-rum'
// import { reactPlugin } from '@datadog/browser-rum-react'
import {
  APP_ENV,
  DATADOG_RUM_ALLOWEDUSERS,
  DATADOG_RUM_APPID,
  DATADOG_RUM_CLIENTTOKEN,
  DATADOG_SERVICE,
  DATADOG_SITE,
} from '@/constants'

// 纯js
datadogRum.init({
  // RUM 应用程序 ID
  applicationId: DATADOG_RUM_APPID as string,
  // Datadog客户端令牌
  clientToken: DATADOG_RUM_CLIENTTOKEN as string,
  // `site` refers to the Datadog site parameter of your organization
  // see https://docs.datadoghq.com/getting_started/site/
  site: DATADOG_SITE as any,
  // 应用程序的服务名称
  service: DATADOG_SERVICE as string,
  // 应用程序的环境，例如：prod、pre-prod 和 staging
  env: APP_ENV,
  // 应用程序的版本，例如：1.2.3、6c44da20和2020.02.13
  version: '0.1.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  // replay收集 用户隐私策略设置 https://docs.datadoghq.com/real_user_monitoring/session_replay/browser/privacy_options/
  defaultPrivacyLevel: 'mask-user-input',

  // 手动启动Replay会话重播录制 https://docs.datadoghq.com/real_user_monitoring/session_replay/browser/
  startSessionReplayRecordingManually: true,

  beforeSend: (event) => {
    // console.log(' event.usr: ', event.usr)
    //TODO 后续改成通过aws s3 config 配置
    const allowedUsers = DATADOG_RUM_ALLOWEDUSERS // 允许上报的用户ID列表
    if (allowedUsers?.length > 0 && event.usr?.userId && allowedUsers.includes(event.usr?.userId as any)) {
      return true // 上报该用户的数据
    }
    return false // 屏蔽其他用户数据
  },
})

// react接入方式
// datadogRum.init({
//   applicationId: '868307a5-cc80-46e7-8c22-df1629e463f7',
//   clientToken: 'pubfdb33a3b69adffadfd86c2386a7d3891',
//   site: 'datadoghq.eu',
//   service: 'x-fansite-dev-test-react',
//   env: 'dev-test',

//   // Specify a version number to identify the deployed version of your application in Datadog
//   // version: '1.0.0',
//   sessionSampleRate: 100,
//   sessionReplaySampleRate: 20,
//   defaultPrivacyLevel: 'mask-user-input',
//   plugins: [reactPlugin({ router: true })],
// })
