import React, { useEffect, useState } from 'react'

interface PropsType {
  className?: string
  style?: React.CSSProperties
  pageKey: string
}

export function PageKeyLine(props: PropsType) {
  const { className = '', style = {}, pageKey } = props
  return (
    <div className={className} style={{}}>
      <div style={{ height: 1, backgroundColor: '#ccc', ...style }}></div>
      <div style={{ color: '#aaa', textAlign: 'right', paddingRight: 20, fontSize: 12 }}>{pageKey}</div>
    </div>
  )
}
