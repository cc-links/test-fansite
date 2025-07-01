import { Icon } from '@x-vision/icons'
import React from 'react'
import TipsDrawer from '../Drawer/TipsDrawer'
import { updateChatInputSendData, useChatInputSendDataStore } from '@/models/chat-input-send'
import { chatInputTypes, UploadErrorCodeMap } from '@/constants/upload'
import { uploadChatFileUtils } from '@/common/multipartUploader'
import { useCurrentChatVoiceUploadList } from '@/models/chatUploadData'
import { isUserCreator } from '@/models/user'
import {
  showToastMaximum,
  showToastPhotoExceedsLimit,
  showToastUploadTypeFailed,
  showToastVideoExceedsLimit,
} from '@/components/Toast/toast'
import { setVaultDrawerVisible, useMessageListModel } from '@/models/message/model'
import VaultDrawer from '../Drawer/VaultDrawer'

interface IProps {
  toUserId: string
  userId: string
}

function MessageTools(props: IProps) {
  const { toUserId, userId } = props
  const isCreator = isUserCreator()
  const showGIF = useChatInputSendDataStore((state) => state.showGIF)
  const free = useChatInputSendDataStore((state) => state.free)
  const showAudio = useChatInputSendDataStore((state) => state.showAudio)
  const { messageListBackBottomVisible } = useMessageListModel()
  const audioData = useCurrentChatVoiceUploadList()

  const onUpload = () => {
    const chatUploadInputId = 'chatUploadInput'
    let chatUploadInputEle = document.getElementById(chatUploadInputId) as HTMLInputElement | null
    if (!chatUploadInputEle) {
      chatUploadInputEle = document.createElement('input')
      chatUploadInputEle.id = chatUploadInputId
      chatUploadInputEle.type = 'file'
      chatUploadInputEle.multiple = true
      chatUploadInputEle.accept = chatInputTypes
    }
    chatUploadInputEle.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const fileList = Array.from(files)
        // 这里可以添加处理文件列表的逻辑
        console.log('Selected files:', fileList)
        uploadChatFileUtils.upload({
          // 会话id chat上传文件必传
          subId: toUserId,
          fileList,
          errorCheckFn: (data?: { code?: string | number; msg?: string; file?: File; key?: string }) => {
            if (data?.code === UploadErrorCodeMap.notSupportedFileType.code) {
              // 上传的时候 类型不对
              console.log('类型不对')
              showToastUploadTypeFailed()
              return false
            }
            if (data?.code === UploadErrorCodeMap.imgSizeMax.code) {
              // 图片尺寸不对
              showToastPhotoExceedsLimit()
              return false
            }
            if (data?.code === UploadErrorCodeMap.videoSizeMax.code) {
              // 视频尺寸不对
              showToastVideoExceedsLimit()
              return false
            }
            if (data?.code === UploadErrorCodeMap.exceedingNumLimit.code) {
              // 超出限制
              showToastMaximum()
              return false
            }
            return true
          },
        })
      }
    }
    chatUploadInputEle.click()
  }
  const onShowGIFList = () => {
    updateChatInputSendData(toUserId, {
      showGIF: !showGIF,
    })
  }
  const onShowAudioRecorder = () => {
    updateChatInputSendData(toUserId, {
      showAudio: !showAudio,
    })
    if (showAudio && audioData[0]) {
      uploadChatFileUtils.cancel(audioData[0])
    }
  }
  const onShowVault = () => {
    setVaultDrawerVisible(!messageListBackBottomVisible)
  }
  const onShowPPV = () => {
    updateChatInputSendData(toUserId, {
      free: !free,
      price: undefined,
    })
  }

  return (
    <div className="flex px-2 pb-2 justify-between" dom-id="message-tools">
      <div className="flex gap-2">
        <span className="w-9 h-9 flex justify-center items-center" onClick={onUpload}>
          <Icon icon="x:AttachmentStyleSolid" fontSize={20} />
        </span>
        <span className="w-9 h-9 flex justify-center items-center" onClick={onShowGIFList}>
          <Icon icon="x:GifCustomStyleStroke" fontSize={20} />
        </span>
        <span className="w-9 h-9 flex justify-center items-center" onClick={onShowAudioRecorder}>
          <Icon icon="x:AudioWaveStyleSolid" fontSize={20} />
        </span>
        <TipsDrawer toUserId={toUserId} />
        {isCreator && (
          <>
            <span className="w-9 h-9 flex justify-center items-center" onClick={onShowVault}>
              <Icon icon="x:Album01StyleStroke" fontSize={20} />
            </span>
            <VaultDrawer toUserId={toUserId} userId={userId} />
          </>
        )}
        {isCreator && (
          <span className="w-9 h-9 flex justify-center items-center" onClick={onShowPPV}>
            <Icon icon="x:SaleTag02StyleStroke" fontSize={20} />
          </span>
        )}
      </div>
    </div>
  )
}

export default MessageTools
