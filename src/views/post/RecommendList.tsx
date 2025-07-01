import { Button, Navbar } from '@x-vision/design'
import Logo from '@/components/Logo/logo'
import { useState } from 'react'

export function RecommendList() {
  const [disabled, setDisabled] = useState(true)
  return (
    <>
      <Navbar
        left={<Logo>Links</Logo>}
        right={
          <Button color="primary" size="generous" disabled={disabled}>
            Continue
          </Button>
        }
      />
    </>
  )
}
