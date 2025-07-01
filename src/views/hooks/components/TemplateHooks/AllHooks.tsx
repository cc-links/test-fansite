import { PageHeader } from '@/components/PageHeader'
import React from 'react'
import { Icon } from '@x-vision/icons/index.js'
import { Text } from '@x-vision/design/index.js'
import HooksItem from '../Item/HooksItem'
import { EditHooksState, HooksItemsType, HooksItem as HookItem, TemplateHooksItem } from '../../type'
import CommonLoading from '@/components/CommonLoading'
import { useTemplateHooksData } from '../../data/requestHooks'

interface Iprops {
  onBack: () => void
  setEditHooksState: React.Dispatch<React.SetStateAction<EditHooksState>>
}
function AllHooks(props: Iprops) {
  const { onBack, setEditHooksState } = props
  const { data, loading } = useTemplateHooksData()
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        onBack={onBack}
        left={
          <div className="flex items-center gap-2">
            <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} className="mr-(--sizing-named-mini)" />
            <Text size="heading3">Templates</Text>
          </div>
        }
      />
      <CommonLoading loading={loading}>
        {/* list */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
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
    </div>
  )
}

export default AllHooks
