import { Skeleton } from '@x-vision/design'

export function PostSkeleton() {
  return (
    <div className="flex flex-col py-(--named-small)">
      <div className="flex items-center space-x-4 px-(--named-small)">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-2 w-[60px]" />
          <Skeleton className="h-2 w-[100px]" />
        </div>
        <Skeleton className="h-2 w-[30px]" />
      </div>
      <div className="flex flex-col px-(--named-small) space-y-2 my-(--named-micro)">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-[60%]" />
      </div>
      <Skeleton className="h-0 w-full pt-[100%] rounded-none" />
    </div>
  )
}
