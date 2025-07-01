import { PageHeader } from '@/components/PageHeader'
import React from 'react'
import { Icon } from '@x-vision/icons/index.js'
import { Button, Text } from '@x-vision/design/index.js'
import HooksItem from '../Item/HooksItem'
import { EditHooksState, HooksItemsType, TemplateHooksItem, HooksItem as HookItemType } from '../../type'
import CommonLoading from '@/components/CommonLoading'
import { useMyHooksData } from '../../data/requestHooks'
import { InfiniteScroll } from '@/npm/x-utils-rc'

interface Iprops {
  onBack: () => void
  setEditHooksState: React.Dispatch<React.SetStateAction<EditHooksState>>
  myHooksDataObj: {
    data: HookItemType[]
    loading: boolean
    refreshAsync: () => void
    mutateDeleteHook: (hooksId: string) => void
    loadMore: () => Promise<void>
    hasNext: boolean
  }
}
function AllHooks(props: Iprops) {
  const { onBack, setEditHooksState, myHooksDataObj } = props

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        onBack={onBack}
        left={
          <div className="flex items-center gap-2">
            <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} className="mr-(--sizing-named-mini)" />
            <Text size="heading3">My chat hooks</Text>
          </div>
        }
      />
      {/* list */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {myHooksDataObj.data?.map((item) => (
            <HooksItem
              key={item.id.toString()}
              type={HooksItemsType.MY_HOOKS}
              setEditHooksState={setEditHooksState}
              item={item as unknown as HookItemType & TemplateHooksItem}
              mutateDeleteHook={myHooksDataObj.mutateDeleteHook}
            />
          ))}
        </div>
        <InfiniteScroll onLoadMore={myHooksDataObj.loadMore} hasMore={myHooksDataObj.hasNext} />
      </div>
    </div>
  )
}

export default AllHooks
