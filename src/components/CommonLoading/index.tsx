import React, { useMemo } from 'react'
import { PageLoading } from '../PageLoading'
import cn from 'classnames'
import { Loading } from '@x-vision/design/index.js'
interface Iprops {
  loading?: boolean
  mask?: boolean
  children: React.ReactNode
  className?: string
}
function CommonLoading(props: Iprops) {
  const { loading, mask = false, children, className } = props
  //   非遮罩类型
  if (!mask) {
    if (loading)
      return (
        <div className={cn('w-full flex justify-center items-center', className)}>
          <Loading />
        </div>
      )
    return children
  }
  //   遮罩类型
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className={cn('w-full flex justify-center items-center absolute top-0 left-0', className)}>
          <Loading />
        </div>
      )}
    </div>
  )
}

export default CommonLoading
