import { Button, Text } from '@x-vision/design/index.js'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { CommonDialog } from '@/components/CommonDialog'
import AllHooks from './AllHooks'
import HooksItem from '../Item/HooksItem'
import { EditHooksState, HooksItemsType, TemplateHooksItem, HooksItem as HookItemType } from '../../type'
import CommonLoading from '@/components/CommonLoading'
import { useMyHooksData } from '../../data/requestHooks'

interface Iprops {
  setEditHooksState: React.Dispatch<React.SetStateAction<EditHooksState>>
}

function MyHooks(props: Iprops, ref: React.Ref<{ refreshAsync: () => void }>) {
  const { setEditHooksState } = props
  const [drawerVisible, setDrawerVisible] = useState(false)
  const myHooksDataObj = useMyHooksData()

  useImperativeHandle(
    ref,
    () => ({
      refreshAsync: () => {
        myHooksDataObj.refreshAsync?.()
      },
    }),
    [myHooksDataObj],
  )

  return (
    <React.Fragment>
      <CommonLoading loading={myHooksDataObj.loading} className="h-[220px]">
        <div className="mt-(--sizing-named-large)">
          {/* header */}
          {myHooksDataObj.data && myHooksDataObj.data?.length > 0 && (
            <div className="flex items-center justify-between">
              <Text size="heading4">My chat hooks</Text>
              <Button color="primary" variant="link" className="p-0" onClick={() => setDrawerVisible(true)}>
                See all
              </Button>
            </div>
          )}
          {/* list */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myHooksDataObj.data
              ?.slice?.(0, 2)
              ?.map((item) => (
                <HooksItem
                  key={item.id.toString()}
                  type={HooksItemsType.MY_HOOKS}
                  setEditHooksState={setEditHooksState}
                  item={item as unknown as HookItemType & TemplateHooksItem}
                  mutateDeleteHook={myHooksDataObj.mutateDeleteHook}
                />
              ))}
          </div>
        </div>
      </CommonLoading>
      <CommonDialog open={drawerVisible} onOpenChange={setDrawerVisible} direction="right" closeSlot={false}>
        <AllHooks
          onBack={() => setDrawerVisible(false)}
          setEditHooksState={setEditHooksState}
          myHooksDataObj={myHooksDataObj}
        />
      </CommonDialog>
    </React.Fragment>
  )
}

export default forwardRef(MyHooks)
