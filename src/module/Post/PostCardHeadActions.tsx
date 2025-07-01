import { cln, Divider } from '@x-vision/design'
import { Icon } from '@x-vision/icons'

export interface PostHeadActionsProps {
  /**
   * 是否是自己的帖子
   */
  isMine: boolean
  /**
   * 举报
   */
  onReport: () => void
  /**
   * 取消关注
   */
  onUnfollow: () => void
  /**
   * 删除
   */
  onDelete: () => void
}

const Item = ({
  icon,
  text,
  className,
  ...props
}: { icon: React.ReactNode; text: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cln(
      'flex items-center gap-(--named-micro) py-(--control-moderate-padding-vertical) px-(--control-moderate-padding-horizontal)',
      className,
    )}
    {...props}
  >
    {icon}
    <span>{text}</span>
  </div>
)

export function PostHeadActions({ isMine, onReport, onUnfollow, onDelete }: PostHeadActionsProps) {
  return (
    <div className="typography-numbers-body1-base flex flex-col p-(--named-micro)">
      {!isMine && (
        <>
          <Item icon={<Icon icon="x:Alert02StyleStroke" fontSize={20} />} text="Report" onClick={onReport} />
          <Divider level={1} />
          <Item icon={<Icon icon="x:Alert02StyleStroke" fontSize={20} />} text="Unfollow" onClick={onUnfollow} />
        </>
      )}
      {isMine && (
        <Item
          className="text-(color:--light-spectrum-saffron-00)"
          icon={<Icon icon="x:Delete01StyleStroke" fontSize={20} />}
          text="Delete"
          onClick={onDelete}
        />
      )}
    </div>
  )
}
