import { XLoggerLogItem, XLoggerExceptionReport } from '../xLogger'
import Dexie, { EntityTable } from 'dexie'

interface ConfigType {
  // 最大log限制
  maxLogsCount: number
  /** 触发限制后保持的数量 */
  keepLogsCount: number
  // 最大异常限制
  maxExceptionsCount: number
  /** 触发限制后保持的数量 */
  keepExceptionsCount: number
}

const defaultConfig: ConfigType = {
  maxLogsCount: 10000,
  keepLogsCount: 5000,
  maxExceptionsCount: 1000,
  keepExceptionsCount: 500,
}

interface TableLoggerLogs {
  id?: number
  data: XLoggerLogItem
}

interface TableLoggerException {
  id?: number
  data: XLoggerExceptionReport
}

const db = new Dexie('LINKS-LOGGER') as Dexie & {
  logger_logs: EntityTable<TableLoggerLogs, 'id'>
  logger_exception: EntityTable<TableLoggerException, 'id'>
}

db.version(1).stores({
  logger_logs: '++id, isException, value',
  logger_exception: '++id, value',
})

class LoggerDB {
  public dataVersion: number = 2
  private _state = {
    logsCount: 0,
    exceptionsCount: 0,
  }
  private _config: ConfigType = { ...defaultConfig }

  constructor() {
    this._init()
  }

  private async _init() {
    await this._limitDataVolume()
  }

  private async _getDataCounts() {
    this._state.logsCount = await db.logger_logs.count()
    this._state.exceptionsCount = await db.logger_exception.count()

    return { ...this._state }
  }

  private async _cleanLogsData() {
    this._state.logsCount = await db.logger_logs.count()

    const cleanCount = this._state.logsCount - this._config.keepLogsCount

    if (cleanCount <= 0) {
      return
    }
    // 删除最早的 cleanCount 条记录
    await db.logger_logs.orderBy('id').limit(cleanCount).delete()
  }

  private async _checkLogsLimit() {
    if (this._state.logsCount < this._config.maxLogsCount) {
      return
    }

    await this._cleanLogsData()
  }

  private async _cleanExceptionData() {
    this._state.exceptionsCount = await db.logger_exception.count()
    if (this._state.exceptionsCount < this._config.maxExceptionsCount) {
      return
    }

    const cleanCount = this._state.exceptionsCount - this._config.keepExceptionsCount
    if (cleanCount <= 0) {
      return
    }

    await db.logger_exception.orderBy('id').limit(cleanCount).delete()
  }

  private async _checkExceptionLimit() {
    if (this._state.exceptionsCount < this._config.maxExceptionsCount) {
      return
    }

    await this._cleanExceptionData()
  }

  // * 整理数据 防止数据过大
  private async _limitDataVolume() {
    await this._getDataCounts()

    await this._checkLogsLimit()
    await this._checkExceptionLimit()
  }

  public async insertLog(row: XLoggerLogItem) {
    // console.log('insertLog', row)

    await db.logger_logs.add({
      data: row,
    })
    this._state.logsCount++
    this._checkLogsLimit()
  }
  public async insertException(row: XLoggerExceptionReport) {
    await db.logger_exception.add({
      data: row,
    })
    this._state.exceptionsCount++
    this._checkExceptionLimit()
  }

  public async clear() {
    await db.logger_logs.clear()
    await db.logger_exception.clear()
    this._state = {
      logsCount: 0,
      exceptionsCount: 0,
    }
  }

  /** 分页查询 */
  public async queryLogs(
    cursor?: number,
    pageSize: number = 50,
  ): Promise<{ cursor?: number; data: XLoggerLogItem[]; hasMore: boolean }> {
    const records = await db.logger_logs
      .orderBy('id')
      .filter((row) => !cursor || row.id! < cursor)
      .reverse()
      .limit(pageSize)
      .toArray()

    return {
      cursor: records.at(-1)?.id,
      data: records.map((row) => row.data) as XLoggerLogItem[],
      hasMore: records.length >= pageSize,
    }
  }

  public async queryExceptions(
    cursor?: number,
    pageSize: number = 50,
  ): Promise<{ cursor?: number; data: XLoggerExceptionReport[]; hasMore: boolean }> {
    const records = await db.logger_exception
      .orderBy('id')
      .filter((row) => !cursor || row.id! < cursor)
      .reverse()
      .limit(pageSize)
      .toArray()
    return {
      cursor: records.at(-1)?.id,
      data: records.map((row) => row.data) as XLoggerExceptionReport[],
      hasMore: records.length >= pageSize,
    }
  }
}

export const loggerDB = new LoggerDB()
