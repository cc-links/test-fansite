import React, { useEffect, useState } from 'react'

import { EnumXLoggerCategory, XLoggerLogItem } from '@/npm/x-utils'
import dynamic from 'next/dynamic'
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

import styles from './index.module.scss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface PropsType {
  item: XLoggerLogItem
  className?: string
  style?: React.CSSProperties
}

export function NetworkRequestLog(props: { item: XLoggerLogItem }) {
  const { item } = props
  return (
    <div className={styles['log-item']} style={{}}>
      <div className={styles['log-item__date']}>
        <div style={{ color: '#999', fontSize: 16 }}> {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div style={{ color: '#ccc' }}>({dayjs(item.time).fromNow()})</div>
      </div>
      <div>
        <div className={styles['log-item-title']}>
          <div style={{ marginRight: 10 }}>🌐 {item.data.type}</div>
          <div style={{ marginRight: 10, fontWeight: 'bold', color: '#999' }}>{item.data.method}</div>
          <div style={{ marginRight: 10, color: '#666' }}>{item.data.url}</div>
          <div style={{ color: '#ddd', fontSize: 12 }}>{item.data.requestId}</div>
        </div>
        <div style={{}}>
          <ReactJson src={item.data} collapsed />
        </div>
      </div>
    </div>
  )
}

export function LogItem(props: PropsType) {
  const { className = '', style = {}, item } = props
  const isNetworkRequest = item.category === EnumXLoggerCategory.Request

  if (isNetworkRequest) return <NetworkRequestLog item={item} />
  return (
    <div className={styles['log-item']} style={{}}>
      <div className={styles['log-item__date']}>
        <div style={{ color: '#999', fontSize: 16 }}> {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div style={{ color: '#ccc' }}>({dayjs(item.time).fromNow()})</div>
      </div>
      <div>
        <div className={styles['log-item-title']} style={{ textAlign: 'left', justifyContent: 'left' }}>
          <div style={{ marginRight: 10 }}>{item.message}</div>
        </div>
        <div style={{}}>
          <ReactJson src={item} collapsed />
        </div>
      </div>
    </div>
  )
}
