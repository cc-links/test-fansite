import { CommonDialog } from '@/components/CommonDialog'
import React, { useRef, useState } from 'react'
import Introduction from './components/Introduction'
import Header from './components/Header'
import bgImg from '@/assets/hooks/hooks-cover.png'
import MyHooks from './components/MyHooks/Home'
import TemplatesHooks from './components/TemplateHooks/Home'
import EditHooks from './components/EditHook'
import { EditHookMode, EditHooksState } from './type'
import { useOnPageEnterEventHooks } from './onPageEnterEvent'
import { STATIC_SOURCE_URL } from '@/constants'
import { Avatar } from '@x-vision/design/index.js'
import RetryImg from '@/components/RetryImg'

function HooksPage() {
  const [introductionVisible, setIntroductionVisible] = useState(false)
  const [editHooksState, setEditHooksState] = useState<EditHooksState>({
    mode: EditHookMode.CREATE_BY_EMPTY,
    visible: false,
  })
  const myHooksRef = useRef<{ refreshAsync: () => void }>(null)
  useOnPageEnterEventHooks({
    callback: () => {
      setIntroductionVisible(true)
    },
  })

  return (
    <div className="py-(--sizing-named-micro) px-(--sizing-named-mini)">
      <Header
        openEditHook={() =>
          setEditHooksState({
            mode: EditHookMode.CREATE_BY_EMPTY,
            visible: true,
          })
        }
      />
      <div className="h-[140px]">
        <RetryImg
          src={`${STATIC_SOURCE_URL}/images/hooks-cover-01.png`}
          alt=""
          className="mt-(--sizing-named-micro) cursor-pointer"
          onClick={() => setIntroductionVisible(true)}
        />
      </div>
      <MyHooks setEditHooksState={setEditHooksState} ref={myHooksRef} />
      <TemplatesHooks setEditHooksState={setEditHooksState} />
      {/* dialog */}
      <CommonDialog open={introductionVisible} onOpenChange={setIntroductionVisible}>
        <Introduction
          onCreate={() => {
            setIntroductionVisible(false)
            setEditHooksState({ ...editHooksState, visible: true, mode: EditHookMode.CREATE_BY_EMPTY })
          }}
        />
      </CommonDialog>
      <CommonDialog
        open={editHooksState.visible}
        onOpenChange={(v) => setEditHooksState({ ...editHooksState, visible: v })}
      >
        <EditHooks
          mode={editHooksState.mode}
          onClose={() => {
            setEditHooksState({ ...editHooksState, visible: false })
          }}
          templateId={editHooksState?.templateId}
          id={editHooksState?.id}
          item={editHooksState?.item}
          refreshAsync={myHooksRef.current?.refreshAsync}
        />
      </CommonDialog>
    </div>
  )
}

export default HooksPage
