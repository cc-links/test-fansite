import { Button, Text } from '@x-vision/design/index.js'
import React from 'react'

interface Iprops {
  loading?: boolean
  onClose?: () => void
  onDelteConfirm?: () => void
}
function DeleteContent(props: Iprops) {
  const { loading, onClose, onDelteConfirm } = props
  return (
    <div className="flex flex-col items-center pt-[32px] px-(--sizing-named-small) gap-(--sizing-named-medium)">
      <Text size="body1" strong>
        Delete chat hook?
      </Text>
      <Text size="body1" className="text-(--element-emphasis-01) text-center">
        This action is permanent and cannot be undone.
      </Text>
      <Button size="huge" color={'stop'} className="w-full" onClick={onDelteConfirm} loading={loading}>
        Delete
      </Button>
      <Button size="huge" className="w-full" onClick={onClose}>
        Cancel
      </Button>
    </div>
  )
}

export default DeleteContent
