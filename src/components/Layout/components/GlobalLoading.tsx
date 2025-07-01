import { OverlayLoading } from '@/views/more/Setting/OverlayLoading'
import { useAppStore } from '@/models'
import React from 'react'

function GlobalLoading() {
  const visibleGlobalLoading = useAppStore((state) => state.visibleGlobalLoading)
  return <OverlayLoading loading={visibleGlobalLoading} className="z-999999" />
}

export default GlobalLoading
