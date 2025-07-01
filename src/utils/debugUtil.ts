'use client'
import { SHOW_VCONSOLE } from '@/constants'
import { isMobile } from '@/npm/x-utils'

if (SHOW_VCONSOLE) {
  const initVconsole = () => {
    import('vconsole').then(({ default: VConsole }) => {
      new VConsole()
    })
  }
  const initEruda = () => {
    try {
      import('eruda').then(({ default: eruda }) => {
        eruda.init()
      })
    } catch (error) {
      console.error('Failed to load Eruda:', error)
    }
  }
  if (isMobile()) {
    try {
      initVconsole()
    } catch (error) {
      console.error('Failed to load VConsole:', error)
      initEruda()
    }
  }
}
