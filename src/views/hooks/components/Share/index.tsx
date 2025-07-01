import React from 'react'
import Header from '../EditHook/Header'
import { Button, Input, Text } from '@x-vision/design/index.js'
import PreviewHooks from '../EditHook/preview/PreviewHooks'
import { useSharePageEnterEvent } from './onSharePageEnterEvent'
import { AddVaultType, HookFormType } from '../../type'
import { useMyHooksData } from '../../data/requestHooks'
import { useUnmount } from 'ahooks'
import CommonLoading from '@/components/CommonLoading'
import { onCopyText } from '@/utils'
import { toast } from 'sonner'
import { useShare } from '@/hooks/useShare'

interface Iprops {
  onClose: () => void
  hooksId?: string
  formValues: HookFormType
  addVaultState: AddVaultType
}
function Share(props: Iprops) {
  const { onClose, hooksId, formValues, addVaultState } = props
  const { isSupported, share, isSharing } = useShare()

  const { link, callGenerateShortLinkLoading } = useSharePageEnterEvent({
    hooksId,
  })

  return (
    <div className="px-(--sizing-named-mini)">
      <Header onClose={onClose} title="Share" />
      <PreviewHooks formValues={formValues} addVaultState={addVaultState} />
      <Text size="body2" className="text-(--element-emphasis-00)">
        Pro tip: For better engagement, your content on social media should be related to your chat hook content
      </Text>
      <Text size="heading4" strong className="text-(--element-emphasis-00) mt-(--sizing-named-great)">
        Share this link on your social media channels
      </Text>
      <CommonLoading loading={callGenerateShortLinkLoading} mask className="h-full">
        <Input value={link} className="my-(--sizing-named-small)" />
      </CommonLoading>
      <div className="flex items-center gap-2">
        <Button
          color={'primary'}
          onClick={async () => {
            if (!link) return
            const res = await onCopyText(link)
            if (res) {
              toast.success('Link copied', {
                position: 'top-center',
              })
            }
          }}
        >
          Copy link
        </Button>
        {isSupported && (
          <Button
            loading={isSharing}
            onClick={() => {
              if (isSupported) {
                share({
                  title: formValues.name,
                  text: formValues.message,
                  url: link,
                })
              }
            }}
          >
            Share
          </Button>
        )}
      </div>
    </div>
  )
}

export default Share
