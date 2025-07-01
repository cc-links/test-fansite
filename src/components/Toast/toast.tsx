import { toast } from 'sonner'
import { Text } from '@x-vision/design'
import { Icon } from '@x-vision/icons'

export const showToast = ({ key, title, description }: { key: string; title: string; description: string }) =>
  toast(
    <div className="flex items-center gap-3">
      <span className="w-(--controls-huge-min-width) h-(--controls-huge-min-height) bg-(--navigation-drawer-surface) flex items-center justify-center rounded-xl">
        <Icon icon="x:Alert02StyleStroke" fontSize={24} color="rgba(234, 99, 87, 1)" />
      </span>
      <div>
        <Text size="caption1" strong>
          {title}
        </Text>
        {description && (
          <Text size="body2" emphasis={1}>
            {description}
          </Text>
        )}
      </div>
    </div>,
    {
      id: key,
    },
  )

export const showToastUploadTypeFailed = (...props: any) =>
  showToast({ key: 'upload-type-failed', title: 'Upload failed', description: 'File type not supported', ...props })

export const showToastPhotoExceedsLimit = (...props: any) =>
  showToast({ key: 'upload-exceeds-failed', title: 'Upload failed', description: 'Photo exceeds 50MB limit', ...props })

export const showToastVideoExceedsLimit = (...props: any) =>
  showToast({
    key: 'upload-exceeds-failed-2',
    title: 'Upload failed',
    description: 'Video exceeds 500MB limit',
    ...props,
  })

export const showToastMaximum = (...props: any) =>
  showToast({ key: 'upload-limits-failed', title: 'Upload failed', description: 'Maximum of 12 uploads', ...props })
