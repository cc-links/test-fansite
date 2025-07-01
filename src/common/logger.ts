import { IS_CLIENT_RUNTIME, IS_TEST_MODE } from '@/constants'
import { Log } from '@hb-common/utils'
import { hbSendLog } from '@/common/datadog'
import { XLogger, EnumXLoggerLevel, xLoggerPluginLocalDb } from '@/npm/x-utils'
import { BUILD_RUN_ID, PAGE_KEY } from '@/constants/env'

export const xLogger = new XLogger()

xLogger.setCommonMeta({
  buildId: BUILD_RUN_ID,
  pageKey: `${PAGE_KEY}`,
})

declare global {
  interface Window {
    xLogger?: XLogger
  }
}

if (IS_CLIENT_RUNTIME && IS_TEST_MODE) {
  window.xLogger = xLogger
}

/**
 * datadog日志类型映射表
 */
const DATADOG_LOG_LEVEL_MAP: {
  [EnumXLoggerLevel.Debug]: 'debug'
  [EnumXLoggerLevel.Info]: 'info'
  [EnumXLoggerLevel.Warn]: 'warn'
  [EnumXLoggerLevel.Error]: 'error'
  [EnumXLoggerLevel.Fatal]: 'error'
} = {
  [EnumXLoggerLevel.Debug]: 'debug',
  [EnumXLoggerLevel.Info]: 'info',
  [EnumXLoggerLevel.Warn]: 'warn',
  [EnumXLoggerLevel.Error]: 'error',
  [EnumXLoggerLevel.Fatal]: 'error',
}

// * 事务异常
xLogger.onExceptionReport((report) => {
  Log.red('[exception-event]', report.exceptionLog.message, report)

  hbSendLog({
    // 如果定义了错误码，优先使用错误码
    message: report.code || `[${report.sceneKey}] ${report.exceptionLog.message}`,
    status: DATADOG_LOG_LEVEL_MAP[report.exceptionLog.level],
    data: {
      sceneKey: report.sceneKey,
      exceptionType: report.exceptionType,
      exceptionLog: report.exceptionLog,
      briefLogs: report.briefLogs,
      meta: report.exceptionLog.meta,
      commonMeta: report.exceptionLog.commonMeta,
    },
  })
})

// * 事件异常
xLogger.onthrowError((data) => {
  Log.red('[throw-error]', data.message, data)
  hbSendLog({
    // 如果定义了错误码，优先使用错误码
    message: data.code || `[${data.meta?.sceneKey}] ${data.message}`,
    status: DATADOG_LOG_LEVEL_MAP[data.level],
    data: {
      level: data.level,
      type: data.type,
      category: data.category,
      message: data.message,
      data: data.data,
      meta: data.meta,
      commonMeta: data.commonMeta,
    },
  })
})

xLogger.use(xLoggerPluginLocalDb)
