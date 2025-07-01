import { Avatar, Button, Popover, Text } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons/index.js'
import React, { useRef, useState } from 'react'
import {
  EditHookMode,
  EditHooksState,
  HooksItem as HookItem,
  HooksItemsType,
  ShelfStatusEnum,
  TemplateHooksItem,
} from '../../type'
import PopOverItemMoreContent from './PopOverItemMoreContent'
import { onCopyText } from '@/utils'
import { toast } from 'sonner'
import { CommonDialog } from '@/components/CommonDialog'
import DeleteContent from './DeleteContent'
import { useRequest, useSize } from 'ahooks'
import { callGenerateShortLink, deleteHook } from '@/services/hooks'
import { hideGlobalLoading, showGlobalLoading } from '@/models'
import { useShare } from '@/hooks/useShare'
import PreviewMessage from '../EditHook/preview/PreviewMessage'

interface Iprops {
  type: HooksItemsType
  setEditHooksState: React.Dispatch<React.SetStateAction<EditHooksState>>
  item: HookItem & TemplateHooksItem
  mutateDeleteHook?: (id: string) => void
}
function HooksItem(props: Iprops) {
  const { type, setEditHooksState, item, mutateDeleteHook } = props
  const [open, setOpen] = useState(false)
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)
  const { runAsync: deleteHookRequest, loading: deleteHookLoading } = useRequest(deleteHook, { manual: true })
  const { isSupported, share } = useShare()
  const templateItemRef = useRef<HTMLDivElement>(null)
  const [previewPopVisible, setPreviewPopVisible] = useState(false)

  const handleMyHooksItemClick = () => {
    setPreviewPopVisible(true)
    // setEditHooksState({
    //   mode: EditHookMode.EDIT_HOOKS,
    //   id: item.id,
    //   visible: true,
    //   item,
    // })
  }
  const handleTemplateHooksItemClick = () => {
    setEditHooksState({
      mode: EditHookMode.CREATE_BY_TEMPLATE_HOOKS,
      templateId: item.templateId,
      visible: true,
      item,
    })
  }
  const onEdit = () => {
    setEditHooksState({
      mode: EditHookMode.EDIT_HOOKS,
      id: item.id,
      visible: true,
      item,
    })
  }
  const onCopy = async () => {
    showGlobalLoading()
    const res = await callGenerateShortLink({ hooksId: item.id }).finally(() => {
      hideGlobalLoading()
    })

    const result = await onCopyText(res.linkUrl)
    if (result) {
      toast.success('Link copied', {
        position: 'top-center',
      })
    }
  }
  const onShare = async () => {
    if (!isSupported) {
      return
    }
    showGlobalLoading()
    const res = await callGenerateShortLink({ hooksId: item.id }).finally(() => {
      hideGlobalLoading()
    })
    share({
      title: item.hookName,
      text: item.message,
      url: res.linkUrl,
    })
    // setEditHooksState({
    //   mode: EditHookMode.SHARE,
    //   id: item.id,
    //   visible: true,
    //   item
    // })
  }
  const onDelete = () => {
    setDeleteConfirmVisible(true)
  }

  const renderItem = () => {
    if (type === HooksItemsType.MY_HOOKS)
      return (
        <Popover
          hasArrow={false}
          container={itemRef?.current}
          triggerProps={{
            asChild: true,
          }}
          rootProps={{
            open: previewPopVisible,
            onOpenChange: setPreviewPopVisible,
          }}
          content={
            <div className="w-[280px] max-h-[480px] overflow-x-hidden overflow-y-auto p-(--sizing-named-small)">
              <PreviewMessage
                formValues={{
                  name: item.hookName,
                  message: item.message,
                }}
                addVaultState={{
                  isChooseAddMedia: true,
                  isChooseAddPrice: true,
                  media: item.vaults,
                  price: String(Number(item.price || 0) / 100),
                }}
                isPreview={false}
                setIsPreview={() => {}}
              />
            </div>
          }
        >
          <div
            className="flex flex-col rounded-(--surface-01-radius) bg-(--surface-level-00-emphasis-00) overflow-hidden relative"
            ref={itemRef}
            onClick={handleMyHooksItemClick}
          >
            <Avatar src={item?.vaults?.[0]?.thumbUrl} shape="square" className="w-full !rounded-none !h-[112px]">
              <div
                className="bg-(--surface-level-02-emphasis-02) p-(--message-generous-padding-horizontal) rounded-(--control-great-border-radius)"
                style={{
                  wordWrap: 'break-word',
                  maxWidth: '340px',
                }}
              >
                <Text>{item.message}</Text>
              </div>
            </Avatar>
            <div className="flex flex-col justify-between h-[76px] p-(--sizing-named-micro)">
              {/* name */}
              <div className="line-clamp-2">
                <Text
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordWrap: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  {item.hookName}
                </Text>
              </div>
              {/* icon info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Icon icon="x:ViewStyleStroke" />
                  <Text size="caption1">{item.exposedCnt || 0}</Text>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="flex items-center justify-center"
                >
                  <Popover
                    align="end"
                    hasArrow={false}
                    rootProps={{
                      open,
                      onOpenChange: setOpen,
                    }}
                    container={itemRef?.current}
                    content={
                      <PopOverItemMoreContent
                        onClose={() => {
                          setOpen(false)
                        }}
                        onEdit={onEdit}
                        onCopy={onCopy}
                        onDelete={onDelete}
                        onShare={onShare}
                        status={item.shelfStatus}
                      />
                    }
                  >
                    <Icon icon="x:MoreHorizontalCircle01StyleStroke" />
                  </Popover>
                </div>
              </div>
            </div>
            {item.shelfStatus === ShelfStatusEnum.down && (
              <div className=" absolute right-2 top-2 bg-(--element-signal-stop-emphasis-00) rounded-full py-(--control-medium-padding-vertical) px-(--control-medium-padding-horizontal)">
                <Text size="caption1" strong className="text-(--always-white-emphasis-00)">
                  Violation
                </Text>
              </div>
            )}
          </div>
        </Popover>
      )
    if (type === HooksItemsType.TEMPLATE_HOOKS)
      return (
        <div className="flex flex-col" onClick={handleTemplateHooksItemClick}>
          <div
            className="flex flex-col rounded-(--surface-01-radius) bg-(--surface-level-00-emphasis-00) overflow-hidden h-[130px]"
            ref={templateItemRef}
          >
            <Avatar
              src={item.coverImg}
              shape="square"
              className="w-full !rounded-none !h-[130px]"
              style={{
                height: '130px !important',
              }}
            />
          </div>
          <div className="py-(--sizing-named-micro) px-(--sizing-named-mini) line-clamp-2">
            <Text
              size="body2"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
              }}
            >
              {item.name}
            </Text>
          </div>
        </div>
      )
  }
  return (
    <React.Fragment>
      {renderItem()}
      <CommonDialog open={deleteConfirmVisible} onOpenChange={setDeleteConfirmVisible} className="h-[300px]">
        <DeleteContent
          onClose={() => {
            setDeleteConfirmVisible(false)
          }}
          loading={deleteHookLoading}
          onDelteConfirm={async () => {
            const res = await deleteHookRequest({ hooksIds: [item.id] })
            if (res) {
              setDeleteConfirmVisible(false)
              mutateDeleteHook?.(item.id)
            }
          }}
        />
      </CommonDialog>
    </React.Fragment>
  )
}

export default HooksItem
