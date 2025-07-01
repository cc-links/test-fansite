import { Button, Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import React from 'react'

interface Iprops {
  onSave?: () => void
  title?: string
  onClose?: () => void
  disabled?: boolean
  loading?: boolean
}
function Header(props: Iprops) {
  const { onSave, title, onClose, disabled, loading } = props
  return (
    <div className="flex items-center justify-between pb-2">
      <div className="flex items-center">
        <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} className="mr-(--sizing-named-mini)" onClick={onClose} />
        <Text size="heading3">{title || 'Create'}</Text>
      </div>
      {onSave && (
        <Button className="mr-[40px]" onClick={onSave} disabled={disabled} loading={loading}>
          Done
        </Button>
      )}
    </div>
  )
}

export default Header
