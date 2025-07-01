import { useShare } from '@/hooks/useShare'
import { Divider, Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import React, { useMemo } from 'react'
import { ShelfStatusEnum } from '../../type'

interface Iprops {
  onClose: () => void
  onEdit?: () => void
  onCopy?: () => void
  onDelete?: () => void
  onShare?: () => void
  status: ShelfStatusEnum
}
function PopOverItemMoreContent(props: Iprops) {
  const { onClose, onCopy, onDelete, onEdit, onShare, status } = props
  const { isSupported } = useShare()

  const operateInfo = useMemo(() => {
    const info = [
      {
        name: 'Edit',
        icon: <Icon icon="x:Edit02StyleStroke" fontSize={20} />,
        onClick: () => {
          onEdit?.()
          onClose()
        },
      },
      {
        name: 'Copy link',
        icon: <Icon icon="x:Link01StyleSolid" fontSize={20} />,
        onClick: () => {
          onCopy?.()
          onClose()
        },
      },
      {
        name: 'Share',
        icon: <Icon icon="x:Share03StyleSolid" fontSize={20} />,
        onClick: () => {
          onShare?.()
          onClose()
        },
      },
      {
        name: 'Delete',
        icon: <Icon icon="x:Delete01StyleStroke" className="text-(--element-signal-stop-emphasis-00)" fontSize={20} />,
        onClick: () => {
          onDelete?.()
          onClose()
        },
      },
    ]
    if (status === ShelfStatusEnum.down) {
      return info.filter((v) => v.name === 'Delete')
    }
    if (!isSupported) {
      return info.filter((v) => v.name !== 'Share')
    }
    return info
  }, [])

  return (
    <div className="w-[140px] rounded-(--control-generous-border-radius) px-(--control-moderate-padding-horizontal) py-(--control-moderate-padding-vertical) shadow-(--controls-level-02-shadow)">
      {operateInfo?.map((v, i) => (
        <div key={v.name} className="my-(--sizing-named-nano) height-[32px]" onClick={v.onClick}>
          <div className="px-(--control-moderate-padding-horizontal) py-(--control-moderate-padding-vertical) flex items-center gap-2">
            {v.icon}
            <Text className={`${i === operateInfo.length - 1 ? 'text-(--element-signal-stop-emphasis-00)' : ''}`}>
              {v.name}
            </Text>
          </div>
          {i !== operateInfo.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  )
}

export default PopOverItemMoreContent
