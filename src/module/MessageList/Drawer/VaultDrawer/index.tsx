'use client'
import React from 'react'
import { Drawer } from '@x-vision/design'

import { setVaultDrawerVisible, useMessageListModel } from '@/models/message/model'
import Vault from '@/components/Vault'
import Div100vh from 'react-div-100vh'

interface Iprops {
  toUserId: string
  userId: string
}
const InfoSettingDrawer = (props: Iprops) => {
  const { toUserId, userId } = props
  const { vaultDrawerVisible } = useMessageListModel()

  return (
    <Drawer
      open={vaultDrawerVisible}
      onOpenChange={setVaultDrawerVisible}
      direction="right"
      handleSlot={false}
      closeSlot={false}
      header={false}
      footer={false}
      nested={true}
      className="!w-screen"
    >
      <Div100vh>
        <Vault toUserId={toUserId} userId={userId} />
      </Div100vh>
    </Drawer>
  )
}
export default InfoSettingDrawer
