import { useRef, useState } from 'react'
import RegisterLogin from '@/module/LoginRegister/RegisterLoginCommon'
import { EnumCheckSource } from '@/types'
import Image from 'next/image'
import HeadImage from './images/head.svg'
import { useInfiniteScroll } from 'ahooks'
import { postApiPostPostRecommend } from '@/services/post'
import { PostSkeleton } from '@/module/Post/PostSkeleton'
import PostCard from '@/module/Post/PostCard'
import { Loading } from '@x-vision/design'

const PAGE_SIZE = 10

export function PostNotLogin() {
  const targetRef = useRef<HTMLDivElement>(null)

  const { error, data, loading, loadMore, loadingMore, noMore } = useInfiniteScroll(
    async (d) => {
      const res = await postApiPostPostRecommend({ type: 1, page: d?.nextPage || 1, size: PAGE_SIZE })
      const noMore = !res?.total || !res?.records?.length || res.records.length < PAGE_SIZE

      return {
        noMore,
        list: res.records || [],
        total: res.total || 0,
        size: res.size || 0,
        current: res.current || 1,
        nextPage: (res.current || 0) + 1,
      }
    },
    {
      target: targetRef.current,
      isNoMore: (d) => d?.noMore,
    },
  )
  return (
    <div className="overflow-y-auto" ref={targetRef}>
      <Image src={HeadImage} alt="head" className="w-full" />
      <div className="px-(--named-small)">
        <div className="typography-text-heading3-strong pt-(--named-large) pb-(--named-medium) ">Sign up-Login</div>
        <div className="py-(--named-mini)">
          <RegisterLogin checkSource={EnumCheckSource.ActiveLogin} />
        </div>
        <div className="typography-text-heading3-strong pt-(--named-large) pb-(--named-medium)">Latest</div>
      </div>
      {data?.list.map((item) => (
        <PostCard
          key={item.id}
          id={item.id}
          headImgUrl={item.userAvatar}
          online={true}
          nickName="Links" //{item.userName}
          userName="Linksofficial" //{item.userName}
          createTime={item.gmtCreate}
          content={item.content}
          media={item.media}
        />
      ))}
      <More loading={loading || loadingMore} noMore={noMore} />
    </div>
  )
}

function More({ ref, loading, noMore }: { loading?: boolean; noMore?: boolean } & React.ComponentProps<'div'>) {
  return (
    <div ref={ref} className="typography-text-body1-base py-(--named-large) text-center text-(--grayscale-black-01)">
      {noMore ? 'End of page' : loading && <Loading />}
    </div>
  )
}
