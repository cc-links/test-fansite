import MessageContentMedia from '@/module/MessageList/MessageItem/MessageMedia'
import { AddVaultType, HookFormType } from '@/views/hooks/type'
import { Avatar, Button, Loading, Text } from '@x-vision/design/index.js'
import React, { useEffect, useRef, useState } from 'react'

interface Iprops {
  formValues: HookFormType
  addVaultState: AddVaultType
  isPreview: boolean
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>
}

const typingTime = 2000
const previewTime = 4000
const animationDelay = 500

function PreviewMessage(props: Iprops) {
  const { formValues, addVaultState, isPreview, setIsPreview } = props
  const [isTyping, setIsTyping] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showMedia, setShowMedia] = useState(false)
  const typingTimer = useRef<NodeJS.Timeout | null>(null)
  const previewTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPreview) {
      // 重置所有显示状态
      setIsTyping(true)
      setShowMessage(false)
      setShowMedia(false)

      // 清除现有定时器
      if (typingTimer.current) clearTimeout(typingTimer.current)
      if (previewTimer.current) clearTimeout(previewTimer.current)

      // 设置动画序列
      typingTimer.current = setTimeout(() => {
        setIsTyping(false)
        setShowMessage(true)

        // 如果有媒体资源，延迟显示
        if (addVaultState?.isChooseAddMedia && addVaultState?.media.length > 0) {
          setTimeout(() => {
            setShowMedia(true)
            // 延迟显示解锁按钮
          }, animationDelay)
        }
      }, typingTime)

      previewTimer.current = setTimeout(() => {
        setIsPreview(false)
      }, previewTime)

      return () => {
        if (typingTimer.current) clearTimeout(typingTimer.current)
        if (previewTimer.current) clearTimeout(previewTimer.current)
      }
    } else {
      // 预览结束时重置所有状态
      setIsTyping(false)
      setShowMessage(true)
      setShowMedia(true)
    }
  }, [isPreview, addVaultState?.isChooseAddMedia, addVaultState?.media.length])

  const isShowEditContent = () => {
    if (formValues?.message) return true
    if (addVaultState?.media.length > 0) return true
    return false
  }

  if (isTyping) return <Loading />

  return isShowEditContent() ? (
    <div className="flex flex-col gap-1 items-start">
      {formValues?.message && (
        <div className="px-(--message-generous-padding-vertical) py-(--message-generous-padding-horizontal) bg-(--surface-level-02-emphasis-02) w-[65%] rounded-(--control-great-border-radius) flex flex-col gap-1">
          <Text
            size="body1"
            className="text-(--element-emphasis-00)"
            style={{
              wordBreak: 'break-word',
              opacity: showMessage ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            {formValues.message}
          </Text>
        </div>
      )}
      {addVaultState?.isChooseAddMedia && addVaultState?.media.length > 0 && (
        <div
          style={{
            opacity: showMedia ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MessageContentMedia
            messageItemInfo={{
              mediaList: addVaultState.media.map((v) => ({
                src: v.thumbUrl,
                type: v.type === 'photo' ? 'photo' : 'video',
                duration: 100,
                id: v.vaultId,
                status: 'completed',
                thumbMidUrl: v.thumbUrl,
              })),
            }}
            openPreview={() => {}}
            mediaWidth={100}
          />
          {/* <Avatar shape="square" src={addVaultState?.media?.[0]?.thumbUrl} className="h-[120px]" /> */}
        </div>
      )}
      {addVaultState?.isChooseAddMedia && addVaultState?.media.length > 0 && (
        <div
          style={{
            opacity: showMedia ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <Button className="w-fit" color="primary">
            Unlock {Number(addVaultState.price) > 0 ? `$${Number(addVaultState.price)}` : 'Free'}
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div className="px-(--message-generous-padding-vertical) py-(--message-generous-padding-horizontal) bg-(--surface-level-02-emphasis-02) w-[65%] rounded-(--control-pill-border-radius)">
      <Text size="body1" className="text-(--element-emphasis-01)">
        Your message goes here
      </Text>
    </div>
  )
}

export default PreviewMessage
