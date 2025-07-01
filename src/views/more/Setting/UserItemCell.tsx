import { Avatar, cln } from '@x-vision/design'

export interface UserItemCellProps {
  online?: boolean
  nickName?: string
  userName?: string
  headImgUrl?: string
  right?: React.ReactNode
  className?: string
}

export const UserItemCell = ({
  online,
  nickName,
  userName = '',
  headImgUrl,
  right,
  className,
  ...props
}: UserItemCellProps) => {
  return (
    <div className={cln('flex items-center gap-(--named-mini) py-(--named-mini)', className)} {...props}>
      <span className="inline-flex relative w-fit overflow-hidden">
        <Avatar className="bg-black text-white" size="huge" src={headImgUrl}>
          {userName?.at(0)}
        </Avatar>
        {online && (
          <div className="absolute bottom-(--named-pico) right-(--named-pico) size-(--named-mini) ring-2 ring-white bg-(--light-spectrum-lichen-00) rounded-full" />
        )}
      </span>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="truncate typography-text-body1-strong text-(--element-emphasis-00)">{nickName}</div>
        <div className="truncate typography-numbers-body2-base text-(--element-emphasis-01)">@{userName}</div>
      </div>
      <span className="shrink-0">{right}</span>
    </div>
  )
}
