import React, { useState } from 'react'
import Header from './Header'
import { useForm } from 'react-hook-form'
import { AddVaultType, EditHookMode, HookFormType, HooksItem, TemplateHooksItem } from '../../type'
import HookForm from './HookForm'
import Share from '../Share'
import PreviewHooks from './preview/PreviewHooks'
import { useEditHooksEnterEvent } from './onEditHooksEnterEvent'
import { useRequest } from 'ahooks'
import { saveHook } from '@/services/hooks'
import { useMyHooksData } from '../../data/requestHooks'
import { toast } from 'sonner'

interface IProps {
  mode: EditHookMode
  onClose: () => void
  templateId?: string
  id?: string
  item?: HooksItem & TemplateHooksItem
  refreshAsync?: () => void
}

function EditHooks(props: IProps) {
  const { onClose, templateId, mode, id, item, refreshAsync } = props
  const { control, handleSubmit, formState, watch, setValue } = useForm<HookFormType>({
    defaultValues: {
      name: '',
    },
  })

  const [addVaultState, setAddVaultState] = useState<AddVaultType>({
    isChooseAddMedia: false,
    isChooseAddPrice: false,
    media: [],
    price: '0',
  })
  const [shareVisible, setShareVisible] = useState(mode === EditHookMode.SHARE)
  const { hooksId, initLoading, initError } = useEditHooksEnterEvent({
    mode,
    templateId,
    id,
    item,
    callback: (v) => {
      console.log('callback', v)
      if (v?.name) {
        setValue('name', v?.name)
      }
      if (v?.message) {
        setValue('message', v?.message)
      }
      if (v?.vaults && v.vaults?.length > 0) {
        addVaultState.isChooseAddMedia = true
        addVaultState.media = v?.vaults
      }
      if (v?.price && Number(v?.price)) {
        addVaultState.isChooseAddMedia = true
        addVaultState.isChooseAddPrice = true
        const price = v?.price || 0
        addVaultState.price = String(Number(price) / 100)
      }
    },
  })
  const {
    runAsync: saveHookAsync,
    loading: saveHookLoading,
    error: saveHookError,
  } = useRequest(saveHook, { manual: true })

  const updateAddVaultState = (state: AddVaultType) => {
    setAddVaultState({ ...state })
  }

  const formValues = watch()

  const onSubmit = async (data: HookFormType) => {
    if (!hooksId) return
    if (Number(addVaultState.price) > 0 && addVaultState.media.length === 0) {
      toast.error('Please add media')
      return
    }
    const res = await saveHookAsync({
      hooksId,
      hookName: data.name,
      message: data.message,
      price: Number(addVaultState.price) > 0 ? Number(addVaultState.price) * 100 : undefined,
      vaultIds: addVaultState.media.length > 0 ? addVaultState.media.map((v) => v.vaultId.toString()) : undefined,
    })
    // 成功
    if (res?.success) {
      refreshAsync?.()
      setShareVisible(true)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {!shareVisible && (
        <React.Fragment>
          <div className="px-(--sizing-named-mini)">
            <Header
              onSave={handleSubmit(onSubmit)}
              onClose={onClose}
              loading={initLoading || saveHookLoading}
              disabled={initError || initLoading}
            />
          </div>
          <div className="px-(--sizing-named-mini) pb-[50px] overflow-y-auto">
            {/* preview */}
            <PreviewHooks formValues={formValues} addVaultState={addVaultState} />
            {/* edit */}
            <HookForm
              control={control}
              formState={formState}
              addVaultState={addVaultState}
              updateAddVaultState={updateAddVaultState}
            />
          </div>
        </React.Fragment>
      )}
      {shareVisible && (
        <Share
          formValues={formValues}
          addVaultState={addVaultState}
          onClose={() => setShareVisible(false)}
          hooksId={hooksId}
        />
      )}
    </div>
  )
}

export default EditHooks
