import { Avatar, Loading, cln, Button, Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons/index.js'
import { DEFAULT_IMG_ACCEPT } from './constants'

/**
 * 上传头像
 * @param shape 形状
 * @param src 头像地址
 * @param loading 是否正在上传
 * @param onChange 上传回调
 * @returns
 */
export function ProfileImgUploader({
  shape,
  src,
  loading,
  onChange,
  error,
  retry,
  ...props
}: {
  shape?: 'round' | 'square'
  src: string
  loading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  retry?: () => (Promise<void> | void) | null
}) {
  const isRound = shape === 'round'

  return (
    <span className="flex relative w-fit overflow-hidden">
      <Avatar
        size="massive"
        shape={shape}
        icon={<Icon icon="x:UserCircleStyleStroke" fontSize={28} />}
        src={src}
        loading={loading}
        {...props}
      />
      {loading && (
        <div
          className={cln(
            'absolute inset-0 flex items-center justify-center z-50 backdrop-blur-[1px] bg-white/5',
            isRound ? 'rounded-full' : 'rounded-(--thumbnail-large-border-radius)',
          )}
        >
          <Loading />
        </div>
      )}
      {!src && (
        <div
          className={cln('absolute z-51', `${isRound ? 'top-(--named-nano) right-(--named-nano)' : 'top-0 right-0'}`)}
        >
          <Button shape="circle" color="primary" size={isRound ? 'moderate' : 'generous'}>
            <Icon icon="x:Upload01StyleSolid" fontSize={isRound ? 16 : 20} />
          </Button>
        </div>
      )}
      <input
        type="file"
        accept={DEFAULT_IMG_ACCEPT}
        className="absolute size-full inset-0 opacity-0"
        onChange={onChange}
      />

      {error && (
        <div
          className={cln(
            'bg-(--element-emphasis-01) absolute size-full inset-0 flex flex-col justify-center items-center',
            isRound ? 'rounded-full' : 'rounded-(--thumbnail-large-border-radius)',
          )}
        >
          <Icon icon="x:AlertCircleStyleStroke" color="#EA6357" fontSize={20} />
          <Text
            size="caption1"
            className="text-(--element-signal-stop-emphasis-00) text-center whitespace-break-spaces mb-2"
          >
            Upload failed
          </Text>
          {retry && (
            <div
              className="bg-(--element-emphasis-02) rounded-(--control-pill-border-radius) w-[90%] h-[18px] typography-text-caption2-strong text-(--always-white-emphasis-00) flex items-center justify-center"
              onClick={retry}
            >
              Retry
            </div>
          )}
        </div>
      )}
    </span>
  )
}
