import React, { useMemo } from 'react'
import { Avatar, Button, Checkbox, Text } from '@x-vision/design/index.js'
import { AddVaultType } from '@/views/hooks/type'
import AddPrice from './AddPrice'
import { Icon } from '@x-vision/icons/index.js'
import { Preview, useMediaPreview } from '@/npm/x-utils-rc'
import { getActiveAccountId } from '@/models/user'
import { STATIC_SOURCE_URL } from '@/constants'
import { ReactSortable } from 'react-sortablejs'
import { formatDuration } from '@/utils'

interface IProps {
  state: AddVaultType
  update: (state: AddVaultType) => void
}
function AddVault(props: IProps) {
  const { state, update: updateAddVaultState } = props
  const isDev = process.env.NODE_ENV === 'development'

  const mockVault = [
    {
      vaultId: isDev ? '155686071762956' : '161304476123172',
      type: 'photo',
      thumbUrl: `https://images.pexels.com/photos/28888994/pexels-photo-28888994.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    },
    {
      vaultId: isDev ? '159898411270175' : '161304291573802',
      type: 'video',
      thumbUrl: `https://images.pexels.com/photos/32396741/pexels-photo-32396741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    },
    {
      vaultId: isDev ? '159637307457538' : '161304140578862',
      type: 'photo',
      thumbUrl: `https://images.pexels.com/photos/32546608/pexels-photo-32546608.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    },
    {
      vaultId: isDev ? '159900105769016' : '161303939252228',
      type: 'photo',
      thumbUrl: `https://images.pexels.com/photos/25682730/pexels-photo-25682730.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    },
    {
      vaultId: isDev ? '159900105769017' : '161303754702900',
      type: 'photo',
      thumbUrl: `https://images.pexels.com/photos/32552462/pexels-photo-32552462/free-photo-of-vsco-a6.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    },
    // {
    //   vaultId: isDev ? '159906699214904' : '160064002326590',
    //   type: 'video',
    //   thumbUrl: `https://images.pexels.com/photos/30220913/pexels-photo-30220913.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    // },
    // {
    //   vaultId: isDev ? '159906699214905' : '160064002326591',
    //   type: 'video',
    //   thumbUrl: `https://images.pexels.com/photos/32560592/pexels-photo-32560592.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    // },
  ]

  const updatePrice = (price: string) => {
    state.price = price
    updateAddVaultState(state)
  }
  const updateIsChooseAddPrice = (v: boolean) => {
    state.isChooseAddPrice = v
    updateAddVaultState(state)
  }

  const { open, setOpen, slides, openIdx, openPreviewPop } = useMediaPreview({
    mediaList:
      state?.media.map((v) => ({
        src: v.thumbUrl,
        type: v.type === 'photo' ? 'image' : 'video',
        id: v.vaultId,
      })) || [],
    toUserId: getActiveAccountId()!,
  })

  return (
    <div className="flex flex-col gap-2">
      {/* checkbox */}
      <div
        className="flex items-center space-x-2"
        onClick={() => {
          state.isChooseAddMedia = !state.isChooseAddMedia
          updateAddVaultState(state)
        }}
      >
        <Checkbox checked={state.isChooseAddMedia}></Checkbox>
        <Text>Add media</Text>
      </div>
      {state.isChooseAddMedia && (
        <div className="flex flex-col gap-1 ml-2">
          {/* media */}
          <ReactSortable
            list={state?.media.map?.((v) => {
              return {
                id: v.vaultId,
                ...v,
              }
            })}
            delayOnTouchStart={true}
            delay={200}
            setList={(newList) => {
              state.media = newList
              updateAddVaultState(state)
            }}
            className="flex gap-1 w-full overflow-x-auto pr-(--sizing-named-micro)  whitespace-nowrap pb-2"
          >
            {state.media.map((item, i) => (
              <div
                key={`${item.vaultId}-${i}`}
                className="relative flex items-center w-fit"
                onClick={() => {
                  openPreviewPop(i)
                }}
              >
                <Avatar shape="square" src={item.thumbUrl} className="h-[120px]" />
                {/* delete */}
                <Icon
                  icon="x:CancelCircleStyleSolid"
                  color="var(--always-white-emphasis-00)"
                  className="absolute top-1 right-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    state.media.splice(i, 1)
                    updateAddVaultState(state)
                  }}
                />
                {/* video */}
                {['video'].includes(item.type) && (
                  <div className="absolute left-1 bottom-1 p-(--control-medium-padding-both) text-(--always-white-emphasis-00) typography-text-caption1-strong flex bg-(--grayscale-black-02) rounded-full">
                    <Icon icon="x:PlayStyleSolid" color="var(--always-white-emphasis-00)" fontSize={12} />
                    <span className="ml-(--sizing-named-nano)">{formatDuration(100)}</span>
                  </div>
                )}
              </div>
            ))}
          </ReactSortable>
          {/* upload */}
          <Button
            className="w-fit"
            color="primary"
            onClick={() => {
              if (state.media.length >= mockVault.length) return
              state.media.push(mockVault[state?.media?.length || 0])
              updateAddVaultState(state)
            }}
          >
            <Icon icon="x:Upload01StyleSolid" />
            Upload
          </Button>
        </div>
      )}
      {/* price */}
      {state.isChooseAddMedia && (
        <div className="ml-2">
          <AddPrice
            updatePrice={updatePrice}
            price={state.price}
            updateIsChooseAddPrice={updateIsChooseAddPrice}
            isChooseAddPrice={state.isChooseAddPrice}
          />
        </div>
      )}
      <Preview open={open} onOpenChange={setOpen} slides={slides} initialSlide={openIdx} />
    </div>
  )
}

export default AddVault
