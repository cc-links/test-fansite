/**
 * 前端日志 - 更规范的日志记录和更有效的收集日志
 * 为前端聚合日志打基础
 */

import { Event } from '@hb-common/utils'
import { nanoid } from 'nanoid'
import { SyncHook } from 'tapable'

export enum EnumXLoggerLevel {
  /** 调试 */
  Debug = 1,
  /** 信息 */
  Info = 2,
  /** 警告 */
  Warn = 3,
  /** 错误 */
  Error = 4,
  /** 致命错误 */
  Fatal = 5,
}

export enum EnumXLoggerType {
  /** 场景 */
  Scene = 'scene',
  /** 状态 */
  Status = 'status',
  /** 普通 */
  Normal = 'normal',
}

export enum EnumXLoggerCategory {
  // 业务日志
  Business = 'business',
  // 系统日志
  System = 'system',
  /** 异常 */
  Exception = 'exception',
  /** 接口请求 */
  Request = 'request',
  /** 用户行为 */
  Behavior = 'behavior',
  /* 性能日志 */
  // Performance = 'performance',
}

export enum EnumExceptionType {
  /** 出错 */
  Error = 'error',
  /** 呆滞 */
  Stuck = 'stuck',
  /** 损坏 */
  Broken = 'broken',
  /** 假死 */
  Dead = 'dead',
  /** 崩溃 */
  Crash = 'crash',
}

export interface XLoggerLogItem {
  id: string
  code?: string
  level: EnumXLoggerLevel
  type: EnumXLoggerType
  category: EnumXLoggerCategory
  time: number
  message: string
  data: any

  meta: {
    /** 场景key */
    sceneKey?: string
    /** 异常类型 */
    exceptionType?: EnumExceptionType
  }

  commonMeta: {
    pageKey?: string
    buildId?: string
    machineId?: string
  }
}

export interface XLoggerExceptionReport {
  /** 代码 */
  code?: string
  /** 场景key */
  sceneKey?: string
  /** 异常类型 */
  exceptionType: EnumExceptionType
  /** 异常日志 */
  exceptionLog: XLoggerLogItem
  /** 简要日志 */
  briefLogs: XLoggerLogItem[]
}

export class XLogger {
  /** 用于插件机制 */
  protected _hooks = {
    onRecord: new SyncHook<[XLoggerLogItem]>(['row']),
    onExceptionReport: new SyncHook<[XLoggerExceptionReport]>(['report']),
  }
  public config = {
    /** 最多存储数 */
    limitCacheLogsLength: 1000,
    /** 异常事件报告场景最大限制 */
    limitExceptionSceneLogsLength: 20,
    /** 基于异常事件往前时间 */
    limitExceptionSceneLogsTime: 1000 * 60 * 2,
  }
  private _logs: XLoggerLogItem[] = []
  private _loggerId = nanoid(16)
  private _logIndex = 0
  private _commonMeta: Partial<XLoggerLogItem['commonMeta']> = {}

  public isDebug = false

  public event = new Event<'exception-report' | 'throw-error'>()

  public setCommonMeta(meta: Partial<XLoggerLogItem['commonMeta']>) {
    Object.assign(this._commonMeta, meta)
  }

  public use(plugin: XLoggerPlugin) {
    this._hooks.onRecord.tap(plugin.name, (row) => {
      return plugin.onRecord(row)
    })
    this._hooks.onExceptionReport.tap(plugin.name, (report) => {
      console.log('tap', report)
      return plugin.onExceptionReport(report)
    })
  }

  public record(item: Partial<XLoggerLogItem>) {
    const row = {
      id: `${this._loggerId}-${this._logIndex++}`,
      time: Date.now(),
      level: EnumXLoggerLevel.Info,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message: '',
      data: {},
      meta: {},
      ...item,
      commonMeta: this._commonMeta,
    }
    row.message = row.message.slice(0, 100)

    this._logs.push(row)
    if (this._logs.length > this.config.limitCacheLogsLength) {
      // 保留最新的
      this._logs = this._logs.slice(-this.config.limitCacheLogsLength)
    }

    this._hooks.onRecord.call(row)

    if (row.level >= EnumXLoggerLevel.Error) {
      this.event.emit('throw-error', row)
    } else {
      // this.isDebug && console.log(row.message, row.data)
      if (this.isDebug) {
        console.log(row.message, row.data)
      }
    }

    return row
  }

  /** 抛出异常 */
  public throwException(exceptionType: EnumExceptionType, message: string, data: any) {
    const row = this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Exception,
      message,
      data,
      meta: { exceptionType },
    })
    const report = this._generateExceptionReport(row.id)

    this._hooks.onExceptionReport.call(report!)
    if (report) {
      this.event.emit('exception-report', report)
    }
    return row
  }

  /** 抛出错误码 */
  public throwCode(code: string, message: string, data: any) {
    const row = this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Exception,
      message,
      data,
      code,
    })
    const report = this._generateExceptionReport(row.id)
    if (report) {
      this.event.emit('exception-report', report)
    }
    return row
  }

  /** 抛出事务异常 */
  public throwSceneException(exceptionType: EnumExceptionType, sceneKey: string, message: string, data: any) {
    const row = this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Scene,
      category: EnumXLoggerCategory.Exception,
      message,
      data,
      meta: {
        sceneKey,
        exceptionType,
      },
    })
    const report = this._generateExceptionReport(row.id)
    if (report) {
      this.event.emit('exception-report', report)
    }
  }
  public error(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Error,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public warn(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Warn,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public info(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Info,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public debug(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Debug,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }
  public fatal(message: string, data: unknown, meta?: XLoggerLogItem['meta']) {
    return this.record({
      level: EnumXLoggerLevel.Fatal,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Business,
      message,
      data,
      meta,
    })
  }

  public apiRequest(
    config: {
      url: string
      method: string
      params: unknown
      requestBody: unknown
      requestId: string
    },
    meta?: XLoggerLogItem['meta'],
  ) {
    return this.record({
      level: EnumXLoggerLevel.Info,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Request,
      message: config.url,
      data: {
        type: 'request',
        url: config.url,
        method: config.method,
        params: config.params,
        requestBody: config.requestBody,
        requestId: config.requestId,
        time: Date.now(),
      },
      meta,
    })
  }

  public apiResponse(
    config: {
      url?: string
      method?: string
      params: unknown
      requestBody: unknown
      requestId: string
      response?: unknown
      status?: number
    },
    meta?: XLoggerLogItem['meta'],
  ) {
    console.log('apiResponse', config)
    return this.record({
      level: EnumXLoggerLevel.Info,
      type: EnumXLoggerType.Normal,
      category: EnumXLoggerCategory.Request,
      message: config.url,
      data: {
        type: 'response',
        url: config.url,
        method: config.method,
        requestId: config.requestId,
        response: config.response,
        status: config.status,
        time: Date.now(),
      },
      meta,
    })
  }

  public sceneError(sceneKey: string, message: string, data: unknown) {
    return this.error(message, data, { sceneKey })
  }
  public sceneWarn(sceneKey: string, message: string, data: unknown) {
    return this.warn(message, data, { sceneKey })
  }
  public sceneInfo(sceneKey: string, message: string, data: unknown) {
    return this.info(message, data, { sceneKey })
  }
  public sceneDebug(sceneKey: string, message: string, data: unknown) {
    return this.debug(message, data, { sceneKey })
  }
  public sceneFatal(sceneKey: string, message: string, data: unknown) {
    return this.fatal(message, data, { sceneKey })
  }

  // 生成异常
  private _generateExceptionReport(id: string): XLoggerExceptionReport | undefined {
    // 1. 收集相同事务
    // 2. 收集 level >= error 的日志

    const state = {
      hadFindExceptionLog: false,
      briefLogs: [] as XLoggerLogItem[],
      isSceneException: false,
      exceptionLog: undefined as XLoggerLogItem | undefined,
    }
    for (let i = this._logs.length - 1; i >= 0; i--) {
      const log = this._logs[i]

      if (state.hadFindExceptionLog) {
        // 如果是场景异常, 非此场景只收集等级大于等于error的日志
        if (state.isSceneException) {
          if (log.meta?.sceneKey === state.exceptionLog?.meta?.sceneKey || log.level >= EnumXLoggerLevel.Error) {
            state.briefLogs.push(log)
          }
        } else {
          state.briefLogs.push(log)
        }

        // 如果达到限制，结束
        if (
          state.briefLogs.length >= this.config.limitExceptionSceneLogsLength ||
          (state.exceptionLog?.time &&
            log.time &&
            log.time - state.exceptionLog.time > this.config.limitExceptionSceneLogsTime)
        ) {
          break
        }

        continue
      }

      if (log.id === id) {
        // 如果不是异常日志，直接退出
        if (log.category !== EnumXLoggerCategory.Exception) return
        state.hadFindExceptionLog = true
        state.briefLogs.push(log)
        state.exceptionLog = log
        state.isSceneException = log.type === EnumXLoggerType.Scene
        continue
      }
    }

    return {
      sceneKey: state.exceptionLog?.meta?.sceneKey || '',
      exceptionType: state.exceptionLog?.meta?.exceptionType || EnumExceptionType.Error,
      exceptionLog: state.exceptionLog as XLoggerLogItem,
      briefLogs: state.briefLogs.map((v) => {
        return {
          ...v,
          data: null,
          dataLength: JSON.stringify(v.data)?.length,
        }
      }),
    }
  }

  public onExceptionReport(fn: (report: XLoggerExceptionReport) => void) {
    this.event.off('main', 'exception-report')
    this.event.on('main', 'exception-report', fn)
  }

  public onthrowError(fn: (data: XLoggerLogItem) => void) {
    this.event.off('main', 'throw-error')
    this.event.on('main', 'throw-error', fn)
  }

  public createSceneLogger(sceneKey: string) {
    return new XSceneLogger(this, sceneKey)
  }
}

// 场景日志快捷方式 - 少一个入参更友好
class XSceneLogger {
  private _logger: XLogger
  private _sceneKey: string

  constructor(logger: XLogger, sceneKey: string) {
    this._logger = logger
    this._sceneKey = sceneKey
  }

  public error(message: string, data?: unknown) {
    return this._logger.sceneError(this._sceneKey, `[${this._sceneKey}] ${message}`, data)
  }
  public warn(message: string, data?: unknown) {
    return this._logger.sceneWarn(this._sceneKey, `[${this._sceneKey}] ${message}`, data)
  }
  public info(message: string, data?: unknown) {
    return this._logger.sceneInfo(this._sceneKey, `[${this._sceneKey}] ${message}`, data)
  }
  public debug(message: string, data?: unknown) {
    return this._logger.sceneDebug(this._sceneKey, `[${this._sceneKey}] ${message}`, data)
  }
  public fatal(message: string, data?: unknown) {
    return this._logger.sceneFatal(this._sceneKey, `[${this._sceneKey}] ${message}`, data)
  }

  public throwException(exceptionType: EnumExceptionType, message: string, data?: unknown) {
    return this._logger.throwSceneException(exceptionType, this._sceneKey, `[${this._sceneKey}] ${message}`, data)
  }
}

export class XLoggerPlugin {
  name: string = 'default'
  onRecord(row: XLoggerLogItem) {
    return row
  }
  onExceptionReport(report: XLoggerExceptionReport) {
    return report
  }

  constructor(options: {
    name: string
    onRecord: (row: XLoggerLogItem) => XLoggerLogItem
    onExceptionReport: (report: XLoggerExceptionReport) => XLoggerExceptionReport
  }) {
    this.name = options.name
    this.onRecord = options.onRecord
    this.onExceptionReport = options.onExceptionReport
  }
}
