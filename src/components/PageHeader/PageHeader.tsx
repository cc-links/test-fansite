'use client'

import { Icon } from '@x-vision/icons'
import { Navbar } from '@x-vision/design'
import useBack from '@/hooks/useBack'

interface Iprops extends React.ComponentProps<typeof Navbar> {
  back?: () => void
  defaultPath?: string
}
export function PageHeader(props: Iprops) {
  const { goBack } = useBack(props.defaultPath)
  const handleBack = () => {
    if (props.back) {
      props.back()
    } else {
      goBack()
    }
  }
  return <Navbar left={<Icon icon="x:ArrowLeft02StyleSolid" onClick={handleBack} />} {...props} />
}
