import { Button, Text } from '@x-vision/design/index.js'
import React, { useState } from 'react'
import { CommonDialog } from '@/components/CommonDialog'
import AllHooks from './AllHooks'
import HooksItem from '../Item/HooksItem'
import { EditHooksState, HooksItemsType, HooksItem as HookItem, TemplateHooksItem } from '../../type'
import CommonLoading from '@/components/CommonLoading'
import { useTemplateHooksData } from '../../data/requestHooks'

interface Iprops {
  setEditHooksState: React.Dispatch<React.SetStateAction<EditHooksState>>
}
function TemplatesHooks(props: Iprops) {
  const { setEditHooksState } = props
  const [drawerVisible, setDrawerVisible] = useState(false)
  const { data, loading } = useTemplateHooksData()
  return (
    <React.Fragment>
      <CommonLoading loading={loading} className="h-[220px]">
        <div className="mt-(--sizing-named-large)">
          {/* header */}
          <div className="flex items-center justify-between">
            <Text size="heading4">Templates</Text>
            <Button color="primary" variant="link" className="p-0" onClick={() => setDrawerVisible(true)}>
              See all
            </Button>
          </div>
          {/* list */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.map((item) => (
              <HooksItem
                key={item.templateId.toString()}
                type={HooksItemsType.TEMPLATE_HOOKS}
                setEditHooksState={setEditHooksState}
                item={item as unknown as HookItem & TemplateHooksItem}
              />
            ))}
          </div>
        </div>
      </CommonLoading>
      <CommonDialog open={drawerVisible} onOpenChange={setDrawerVisible} direction="right" closeSlot={false}>
        <AllHooks onBack={() => setDrawerVisible(false)} setEditHooksState={setEditHooksState} />
      </CommonDialog>
    </React.Fragment>
  )
}

export default TemplatesHooks
