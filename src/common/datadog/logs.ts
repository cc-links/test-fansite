'use client'
import { APP_ENV, DATADOG_LOG_CLIENTTOKEN, DATADOG_SERVICE, DATADOG_SITE } from '@/constants'

// https://docs.datadoghq.com/logs/log_collection/javascript/
import { datadogLogs } from '@datadog/browser-logs'

export interface LogOptions {
  message: string
  data?: {
    [key: string]: unknown
  }
  status?: 'debug' | 'info' | 'warn' | 'error'
  error?: Error
}
datadogLogs.init({
  clientToken: DATADOG_LOG_CLIENTTOKEN as string,
  // 参考 https://docs.datadoghq.com/getting_started/site/?site=eu
  site: DATADOG_SITE as any,
  service: DATADOG_SERVICE,
  // 应用程序的环境，例如：prod、pre-prod、staging 等
  env: APP_ENV,
  version: '0.1.0',
  forwardErrorsToLogs: true,
  // 需要跟踪的会话百分比：100全部跟踪、0无跟踪。只有跟踪的会话才会发送日志。该选项仅适用于通过浏览器日志 SDK 收集的日志，并且与 RUM 数据无关。
  sessionSampleRate: 100,
})
// datadogLogs.logger.debug('Button clicked', { name: 'buttonName', id: 123 })
// datadogLogs.logger.info('Button clicked', { name: 'buttonName', id: 123 })
// datadogLogs.logger.warn('Button clicked', { name: 'buttonName', id: 123 })
// datadogLogs.logger.error('Button clicked', { name: 'buttonName', id: 123 })

export function hbSendLog(logOptions: LogOptions) {
  // sendLog(logOptions)
  const sendData: any = {
    data: logOptions?.data,
  }
  if (logOptions?.error) {
    sendData.error = logOptions?.error
  }
  datadogLogs?.logger?.[logOptions?.status || 'info'](logOptions?.message, sendData)
}
