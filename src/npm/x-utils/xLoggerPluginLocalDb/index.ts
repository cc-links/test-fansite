import { loggerDB } from './dbHandler'
import { XLoggerPlugin, XLoggerLogItem, XLoggerExceptionReport } from '../xLogger'

export const xLoggerPluginLocalDb = new XLoggerPlugin({
  name: 'x-logger-db',
  onRecord: (row: XLoggerLogItem) => {
    loggerDB.insertLog(row)
    return row
  },
  onExceptionReport: (report: XLoggerExceptionReport) => {
    loggerDB.insertException(report)
    return report
  },
})
export * from './dbHandler'
