'use client'

import { Icon } from '@x-vision/icons'
import styles from './index.module.scss'
import { Button } from '@x-vision/design'
import useBack from '@/hooks/useBack'

interface PageHeaderProps {
  title?: string | React.ReactNode
  right?: React.ReactNode
  left?: React.ReactNode
  onBack?: () => void
}

export function PageHeader(props: PageHeaderProps) {
  const { goBack } = useBack()
  const { onBack = goBack } = props
  return (
    <div className={styles['page-header']}>
      <Button
        onClick={() => {
          onBack()
        }}
        color="primary"
        variant="text"
        size="generous"
      >
        {props.left || <Icon icon="x:ArrowLeft02StyleSolid" fontSize={20} />}
      </Button>
      <div>{props.title}</div>
      <div>{props.right}</div>
    </div>
  )
}
