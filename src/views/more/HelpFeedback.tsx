'use client'

import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ProfileFieldInput } from '@/views/more/Setting/UserProfileFieldInput'
import { postApiAccountSettingFeedback } from '@/services/setting'
import { Button, cln } from '@x-vision/design'
import { useState } from 'react'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import useBack from '@/hooks/useBack'

export default function HelpFeedback({ title = PAGE_NAMES.FEEDBACK, className, onBack, ...props }: PageProps) {
  const { goBack } = useBack()

  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    try {
      setLoading(true)
      const res = await postApiAccountSettingFeedback({ feedback: value })
      if (!res?.success) return
      goBack()
    } catch (error) {
      console.error(error)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={cln('relative', className)}>
      <PageHeader title={title} back={onBack} />
      <div className="flex flex-col p-(--named-small)">
        <div className="typography-text-body1-strong mb-(--named-micro)">Help us make the X better for you</div>
        <ProfileFieldInput
          type="textarea"
          placeholder="Write your feedback"
          className="p-0"
          rows={5}
          value={value}
          maxLength={300}
          error={error}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        />

        <Button className="mt-(--named-medium)" size="huge" color="primary" loading={loading} onClick={submit}>
          Send feedback
        </Button>
      </div>
    </div>
  )
}
