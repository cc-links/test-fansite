import { useContactMeta } from '@/models/chat/cache/meta'
import { getShowText } from '@/utils/chat'
import { Drawer } from '@x-vision/design'
import { Icon } from '@x-vision/icons'
import React from 'react'
import TipsMain from './TipsMain'

interface IProps {
  toUserId: string
}
function TipsDrawer(props: IProps) {
  const { toUserId } = props
  const [open, setOpen] = React.useState(false)
  const contactMeta = useContactMeta(toUserId)

  return (
    <>
      <span className="w-9 h-9 flex justify-center items-center" onClick={() => setOpen(true)}>
        <Icon icon="x:MoneySendCircleStyleStroke" fontSize={20} />
      </span>
      <Drawer
        shouldScaleBackground
        handleSlot={false}
        open={open}
        onOpenChange={setOpen}
        className="max-h-[95dvh]!"
        header={false}
        footer={false}
      >
        <TipsMain name={getShowText(contactMeta) || '...'} />
      </Drawer>
    </>
  )
}

export default TipsDrawer
