import { Drawer } from '@x-vision/design/index.js'
import React from 'react'
import { CommonDrawerProps } from './type'
import classNames from 'classnames'
import { use100vh } from 'react-div-100vh'

function CommonDrawerPage(props: CommonDrawerProps) {
  const { children, direction, onOpenChange } = props
  const fullHeight = use100vh() || 0
  return (
    <Drawer
      className={classNames('!max-h-[100vh]', direction === 'right' && '!h-screen !max-h-[100vh] !w-screen')}
      {...props}
      handleSlot={false}
      dismissible={false}
      repositionInputs={false}
    >
      <div
        className={classNames('pt-2 relative', direction === 'right' && '!pt-0 !h-screen !max-h-[100vh] !w-screen')}
        style={{
          height: fullHeight * 0.98,
          overflowY: 'auto',
        }}
      >
        <div
          className="absolute w-[24px] h-[24px] top-[14px] right-[14px] z-1"
          onClick={() => {
            if (onOpenChange) {
              onOpenChange(false)
            }
          }}
        ></div>
        {children}
      </div>
    </Drawer>
  )
}

export default CommonDrawerPage
