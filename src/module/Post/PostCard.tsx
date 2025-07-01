import { Popover } from '@x-vision/design'
import { UserItemCell } from '@/views/more/Setting/UserItemCell'
import PostCardMedia, { IPostCardMedia } from './PostCardMedia'
import { Icon } from '@x-vision/icons'

interface PostCardProps {
  id: string
  headImgUrl: string
  online?: boolean
  content: string
  nickName: string
  userName: string
  createTime: string
  media?: IPostCardMedia[]
  headActionsRender?: React.ReactNode
  footActionsRender?: React.ReactNode
}

export default function PostCard({
  headImgUrl,
  online,
  nickName,
  userName,
  createTime,
  content,
  media,
  headActionsRender,
  footActionsRender,
}: PostCardProps) {
  return (
    <div className="flex flex-col">
      <UserItemCell
        className="pl-(--named-small) pt-(--named-small) pb-(--named-micro)"
        online={online}
        headImgUrl={headImgUrl}
        nickName={nickName}
        userName={userName}
        right={
          <div className="flex items-center gap-(--named-mini)">
            {createTime && <span className="typography-numbers-caption1-base">{createTime}</span>}
            {headActionsRender ? (
              <Popover
                size="sm"
                hasArrow={false}
                triggerProps={{ asChild: true }}
                sideOffset={-4}
                align="end"
                alignOffset={8}
                content={headActionsRender}
              >
                <span className="p-(--named-micro)">
                  <Icon icon="x:MoreHorizontalStyleSolid" fontSize={20} />
                </span>
              </Popover>
            ) : (
              <span></span>
            )}
          </div>
        }
      />
      <div className="typography-numbers-body1-base px-(--named-small) pt-(--named-micro) pb-(--named-small)">
        {content}
      </div>
      <PostCardMedia media={media} />
      {footActionsRender && <div className="px-(--named-small) py-(--named-mini)">{footActionsRender}</div>}
    </div>
  )
}
