import { updateContactIsTyping } from '@/models/chat'
import { useContactMeta } from '@/models/chat/cache/meta'
import ChatAvatar from '@/module/ChatList/ChatItem/ChatAvatar'
import { Loading } from '@x-vision/design/index.js'
import React, { useEffect, useRef } from 'react'

interface IProps {
  accountId: string
  contactId: string
}
function Typing(props: IProps) {
  const { contactId, accountId } = props
  const { isTyping } = useContactMeta(contactId)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const textClassName = 'rounded-2xl px-3 py-2 break-all whitespace-pre-line'

  useEffect(() => {
    // 3秒后自动将isTyping设置为false
    if (isTyping) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        updateContactIsTyping(accountId, contactId, false)
      }, 3000)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  })

  return isTyping ? (
    <div className="py-2 flex items-center gap-1 relative h-[40px]">
      <ChatAvatar toUserId={contactId} size="generous" className="" />
      <div className={`${textClassName} bg-(--grayscale-black-07) text-(--grayscale-black-00)`}>
        <Loading />
      </div>
    </div>
  ) : null
}

export default Typing
