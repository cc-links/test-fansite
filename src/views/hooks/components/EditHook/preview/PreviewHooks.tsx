import { Avatar, Button, Text } from '@x-vision/design/index.js'
import React, { useState } from 'react'
import { Icon } from '@x-vision/icons/index.js'
import { AddVaultType, HookFormType } from '@/views/hooks/type'
import PreviewMessage from './PreviewMessage'

interface IProps {
  formValues: HookFormType
  addVaultState: AddVaultType
}

function PreviewHooks(props: IProps) {
  const { formValues, addVaultState } = props
  const [isPreview, setIsPreview] = useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, []) // 当消息内容变化时也滚动到底部

  return (
    <div className="flex w-full h-[300px] gap-1 bg-(--surface-level-02-emphasis-02) my-[16px] rounded-(--sizing-named-mini) overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col w-full">
        <div className="flex flex-col-reverse mt-auto">
          <div className="p-[16px] min-h-full">
            <PreviewMessage
              formValues={formValues}
              addVaultState={addVaultState}
              isPreview={isPreview}
              setIsPreview={setIsPreview}
            />
            {!isPreview ? (
              <Button className="w-full mt-[24px]" onClick={() => setIsPreview(true)}>
                <Icon icon="x:PlayCircle02StyleSolid" />
                Preview
              </Button>
            ) : (
              <div className="flex justify-center items-center mt-[24px] h-[36px]">
                <Text size="caption1">Preview</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewHooks
