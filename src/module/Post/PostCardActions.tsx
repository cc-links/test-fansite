import { cln } from '@x-vision/design/index.js'
import { Icon } from '@x-vision/icons'

export interface PostCardActionsProps {
  // 是否只读
  readonly?: boolean
  // 浏览量
  viewCount?: string
  // 喜欢数量
  likeCount?: string
  // 打赏数
  tipsCount?: string

  like?: boolean
  onSendMessage?: (e: React.MouseEvent) => void
  onLikeChange?: (like: boolean) => void
  onTips?: (e: React.MouseEvent) => void
  onShare?: (e: React.MouseEvent) => void
}

const IconWithText = ({
  readonly,
  icon,
  text,
  className,
  ...props
}: { readonly?: boolean; icon: React.ReactNode; text?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cln('text-[20px] p-(--named-micro) gap-(--named-micro) flex items-center', className)} {...props}>
      {icon}
      {readonly && <span className="typography-text-body1-strong pr-(--named-nano)">{text}</span>}
    </div>
  )
}

export default function PostCardActions({
  readonly,
  like,
  viewCount,
  likeCount,
  tipsCount,
  onSendMessage,
  onLikeChange,
  onTips,
  onShare,
}: PostCardActionsProps) {
  return (
    <div className="gap-(--named-micro) flex items-center text-[20px] ">
      {readonly ? (
        <IconWithText
          className="flex-1"
          readonly={readonly}
          icon={<Icon icon="x:ViewStyleStroke" />}
          text={viewCount}
        />
      ) : (
        <div
          className="flex-1 typography-numbers-body1-base rounded-full border border-(--surface-level-02-emphasis-02) bg-(--grayscale-black-07) py-(--named-micro) px-(--named-mini)"
          onClick={onSendMessage}
        >
          Type a message
        </div>
      )}
      <div className="gap-(--named-nano) flex items-center">
        <IconWithText
          readonly={readonly}
          icon={
            like && !readonly ? (
              <Icon icon="x:FavouriteStyleSolid" color="rgba(213, 72, 166, 1)" />
            ) : (
              <Icon icon="x:FavouriteStyleStroke" />
            )
          }
          text={likeCount}
          onClick={() => !readonly && onLikeChange?.(!like)}
        />
        <IconWithText
          readonly={readonly}
          icon={<Icon icon="x:MoneySendCircleStyleSolid" />}
          text={tipsCount}
          onClick={(e) => !readonly && onTips?.(e)}
        />
        <IconWithText readonly={readonly} icon={<Icon icon="x:Share03StyleSolid" />} onClick={onShare} />
      </div>
    </div>
  )
}
