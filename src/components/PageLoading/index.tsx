import logoLightImg from '@/assets/brand/logo-light.svg'
import cn from 'classnames'
import Image from 'next/image'

interface Iprops {
  className?: string
}
export function PageLoading(props: Iprops) {
  const { className } = props
  return (
    <div className={cn('w-full h-full flex justify-center items-center', className)}>
      <Image src={logoLightImg} style={{ width: 100, height: 100 }} alt="" />
    </div>
  )
}
