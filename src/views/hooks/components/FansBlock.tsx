import { STATIC_SOURCE_URL } from '@/constants'
import { useUserInfo } from '@/models/user'
import { EnumUserType } from '@/types'
import { Text } from '@x-vision/design/index.js'
import Image from 'next/image'
import React from 'react'

function FansBlock({ children }: { children: React.ReactNode }) {
  const userInfo = useUserInfo()
  const isFans = userInfo?.userType === EnumUserType.Fan
  if (isFans)
    return (
      <div className="text-center flex flex-col items-center justify-center h-full">
        <Image src={`${STATIC_SOURCE_URL}/images/empty.svg`} width={80} height={80} alt="empty" />
        <Text className="mt-4">Permission denied</Text>
      </div>
    )
  return children
}

export default FansBlock
