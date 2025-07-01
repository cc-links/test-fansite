'use client'

import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { Cell, cln, Text } from '@x-vision/design'
import { useRouter } from 'next/router'
import { uploadMyProfileFileUtils } from '@/common/multipartUploader'
import { DEFAULT_IMG_ACCEPT, DEFAULT_IMG_MIME_TYPE } from '@/views/more/Setting/constants'
import CropDialog from '@/views/more/Setting/CropDialog'
import { PageContent } from '@/views/more/Setting/PageContent'
import { ProfileImgUploader } from '@/views/more/Setting/UserProfileImgUploader'
import { useMyProfileStore, fetchMyProfile, updateMyProfile } from '@/models/user-profile/profile'
import { postApiAccountSettingModifyImg } from '@/services/setting'
import { Icon } from '@x-vision/icons/index.js'
import { useState, useEffect, useMemo, useRef } from 'react'
import ProfileName from './ProfileName'
import ProfileUsername from './ProfileUsername'
import ProfileBio from './ProfileBio'
import ProfileLocation from './ProfileLocation'
import { showToast } from '@/components/Toast/toast'
import { MyProfileUploader } from '@/common/multipartUploader/myProfile'

function ProfileItem({
  rows = 1,
  style,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { rows?: number }) {
  return (
    <div
      className={cln(
        'typography-numbers-body1-base py-(--control-huge-padding-vertical) px-(--control-huge-padding-horizontal) rounded-(--control-huge-border-radius) bg-(--grayscale-black-06) border border-(--grayscale-black-06) cursor-pointer break-all',
        className,
      )}
      {...props}
    >
      <div className="min-h-(--min-h)" style={{ ...{ '--min-h': `${rows}em` }, ...style }}>
        {children}
      </div>
    </div>
  )
}

function useCropDialog() {
  const [crop, setCrop] = useState({
    aspect: 1 / 1, // 16:9
    cropShape: 'round' as 'round' | 'rect',
    type: 0, //  1 头像  2背景图
    open: false,
    error: false,
    url: '',
  })

  const resetCropState = (...rest: any) => {
    setCrop({
      type: 0,
      open: false,
      error: false,
      url: '',
      cropShape: 'round',
      aspect: 1 / 1,
      ...rest,
    })
  }

  function handleImageInput({ type, ...e }: Omit<React.ChangeEvent<HTMLInputElement>, 'type'> & { type: 1 | 2 }) {
    const [file] = e?.target?.files ?? []

    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      throw showToast({
        key: 'upload-exceeds-failed-5mb',
        title: 'Upload failed',
        description: 'Photo exceeds 5MB limit',
      })
    }
    if (!DEFAULT_IMG_ACCEPT.includes(file.type)) {
      throw showToast({
        key: 'upload-type-failed',
        title: 'Upload failed',
        description: 'Please upload a jpeg, png, or gif file',
      })
    }

    const url = URL.createObjectURL(file)
    setCrop((v) => ({
      ...v,
      type,
      open: true,
      url,
      cropShape: type === 1 ? 'round' : 'rect',
      error: false,
      aspect: type === 1 ? 1 / 1 : 16 / 9,
    }))

    e.target.value = ''
  }

  useEffect(() => {
    return () => {
      resetCropState()
    }
  }, [])

  return {
    crop,
    setCrop,
    resetCropState,
    handleImageInput,
  }
}

function useUploader() {
  const uploaderRef = useRef<MyProfileUploader>(null)

  const [state, setState] = useState({
    loading: false,
    error: false,
  })

  useEffect(() => {
    return () => {
      setState({ loading: false, error: false })
      uploaderRef.current = null
    }
  }, [])

  function submit(type = 0, { url, file }: { url: string; file: Blob }) {
    setState((v) => ({ ...v, loading: true }))
    uploaderRef.current = uploadMyProfileFileUtils.upload({
      file: new File([file], 'user-setting.png', { type: DEFAULT_IMG_MIME_TYPE }),
      onCompleted: async (data) => {
        const { fileKey, fileUrl } = data || {}
        if (!fileKey || !fileUrl) return
        await postApiAccountSettingModifyImg({ fileKey: fileKey, imageType: type })

        const img = type === 1 ? { headImgUrl: url } : { backgroundImgUrl: url }
        updateMyProfile(img)
        setState({ loading: false, error: false })
      },
      onError: (err) => {
        console.error(err)
        setState({ loading: false, error: true })
      },
    })
  }

  const retry = async () => {
    try {
      setState({ loading: true, error: false })
      await uploaderRef.current?.retry()
      setState({ loading: false, error: false })
    } catch (error) {
      console.error(error)
      setState({ loading: false, error: true })
    }
  }

  return {
    state,
    submit,
    retry,
  }
}
export default function Profile({ title = PAGE_NAMES.PROFILE, className, onBack, ...props }: PageProps) {
  const userinfo = useMyProfileStore()

  const { crop, setCrop, resetCropState, handleImageInput } = useCropDialog()

  const { state: headImgUploader, submit: headImageSubmit, retry: headRetry } = useUploader()
  const { state: bgImgUploader, submit: bgImageSubmit, retry: bgRetry } = useUploader()
  const [page, setPage] = useState<string | null>(null)

  useEffect(() => {
    fetchMyProfile()
  }, [])

  function handleImageSubmit(payload: { url: string; file: Blob }) {
    setCrop((v) => ({ ...v, open: false }))
    if (crop.type === 1) {
      headImageSubmit(crop.type, payload)
    } else if (crop.type === 2) {
      bgImageSubmit(crop.type, payload)
    }
  }
  return (
    <>
      <PageContent
        className={cln('flex flex-col gap-(--named-medium) p-(--named-small)', className)}
        loading={userinfo.loading}
        screen
        title={title}
        onBack={onBack}
      >
        <div className="flex justify-center">
          <ProfileImgUploader
            shape="round"
            src={userinfo.headImgUrl}
            loading={headImgUploader.loading}
            error={headImgUploader.error}
            retry={headRetry}
            onChange={(e) => handleImageInput({ ...e, type: 1 })}
          />
        </div>
        <div className="flex flex-col gap-(--named-micro)">
          <Text size="body1" strong>
            Name
          </Text>
          <ProfileItem onClick={() => setPage(PAGE_NAMES.NAME)}>{userinfo.nickName}</ProfileItem>
        </div>
        <div className="flex flex-col gap-(--named-micro)">
          <Text size="body1" strong>
            Username
          </Text>
          <ProfileItem onClick={() => setPage(PAGE_NAMES.USERNAME)}>{userinfo.userName}</ProfileItem>
        </div>
        <div className="flex flex-col gap-(--named-micro)">
          <Text size="body1" strong>
            Cover photo
          </Text>
          <ProfileImgUploader
            shape="square"
            src={userinfo.backgroundImgUrl}
            loading={bgImgUploader.loading}
            error={bgImgUploader.error}
            retry={bgRetry}
            onChange={(e) => handleImageInput({ ...e, type: 2 })}
          />
        </div>
        <div className="flex flex-col gap-(--named-micro)">
          <Text size="body1" strong>
            Bio
          </Text>
          <ProfileItem rows={2} onClick={() => setPage(PAGE_NAMES.BIO)}>
            {userinfo.bio}
          </ProfileItem>
        </div>
        <div className="flex flex-col gap-(--named-micro)">
          <Text size="body1" strong>
            Location
          </Text>
          <Cell
            right={<Icon icon="x:ArrowRight01StyleStroke" />}
            title={<span className="typography-numbers-body1-base">{userinfo.location || 'Undetected'}</span>}
            onClick={() => setPage(PAGE_NAMES.LOCATION)}
          />
        </div>

        {/* 裁剪图片弹窗 */}
        <CropDialog
          aspect={crop.aspect}
          cropShape={crop.cropShape}
          src={crop.url}
          open={crop.open}
          onClose={resetCropState}
          onDone={handleImageSubmit}
        />
      </PageContent>

      {page === PAGE_NAMES.NAME && <ProfileName rootClassName="absolute inset-0" onBack={() => setPage(null)} />}
      {page === PAGE_NAMES.USERNAME && (
        <ProfileUsername rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
      {page === PAGE_NAMES.BIO && <ProfileBio rootClassName="absolute inset-0" onBack={() => setPage(null)} />}
      {page === PAGE_NAMES.LOCATION && (
        <ProfileLocation rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
    </>
  )
}
