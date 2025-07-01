import { Input, Text, Textarea } from '@x-vision/design/index.js'
import React from 'react'
import { Control, Controller, FormState } from 'react-hook-form'
import { AddVaultType, HookFormType } from '../../type'
import AddVault from './Add/AddVault'
interface IProps {
  control: Control<HookFormType, any, HookFormType>
  formState: FormState<HookFormType>
  addVaultState: AddVaultType
  updateAddVaultState: (state: AddVaultType) => void
}

function HookForm(props: IProps) {
  const {
    control,
    formState: { errors },
    addVaultState,
    updateAddVaultState,
  } = props
  return (
    <div className="flex flex-col gap-(--sizing-named-intermediate)">
      <div className="flex flex-col gap-1 relative">
        <Text size="body1">Chat hook name</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'This field is required' }}
          render={({ field }) => <Input {...field} maxLength={1000} placeholder="Name" />}
        />
        {errors.name && (
          <Text size="body2" className="absolute bottom-[-20px] left-0 text-(--element-signal-stop-emphasis-00)">
            {errors.name.message}
          </Text>
        )}
      </div>
      <div className="flex flex-col gap-1 relative">
        <Text size="body1">Message</Text>
        <Controller
          control={control}
          name="message"
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            // @ts-expect-error ignore
            <Textarea {...field} placeholder="Type your message here" maxRows={4} maxLength={1000} />
          )}
        />
        {errors.message && (
          <Text size="body2" className="absolute bottom-[-20px] left-0 text-(--element-signal-stop-emphasis-00)">
            {errors.message.message}
          </Text>
        )}
      </div>
      <div>
        <AddVault state={addVaultState} update={updateAddVaultState} />
      </div>
    </div>
  )
}

export default HookForm
