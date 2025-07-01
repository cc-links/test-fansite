import { request } from '@/common/request'

/** creatorRecommend POST /api/post/creatorRecommend */
export async function postApiPostCreatorRecommend(
  body: {
    type?: number
    page?: number
    size?: number
  },
  options?: { [key: string]: any },
) {
  return request<{ userId?: number; userName?: string; nickName?: string; avatar?: string }>(
    '/api/post/creatorRecommend',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  )
}

/** Post内容推荐 POST /api/post/postRecommend */
export async function postApiPostPostRecommend(
  body: {
    /** 1=未登陆推荐、2=粉丝推荐 */
    type?: number
    /** 1 */
    page?: number
    /** 10 */
    size?: number
  },
  options?: { [key: string]: any },
) {
  return request<{
    records?: {
      id?: number
      creatorId?: number
      content?: string
      label?: string
      documentTsvector?: string
      likeSize?: number
      commentSize?: number
      mediaList?: string
      mediaUrlList?: {
        id?: number
        type?: string
        likesCount?: number
        thumbUrl?: string
        thumbPayUrl?: string
        thumbMidUrl?: string
        thumbMidPayUrl?: string
        thumbLargeUrl?: string
        thumbLargePayUrl?: string
        avPreviewUrl?: string
        avUrl?: string
        duration?: number
        thumbWidth?: number
        thumbHeight?: number
        thumbMidWidth?: number
        thumbMidHeight?: number
        thumbLargeWidth?: number
        thumbLargeHeight?: number
        status?: string
      }[]
      gmtCreate?: { seconds?: number; nanos?: number }
      gmtModified?: { seconds?: number; nanos?: number }
      gmtDeleted?: { seconds?: number; nanos?: number }
    }[]
    total?: number
    size?: number
    current?: number
    orders?: { column?: string; asc?: boolean }[]
    optimizeCountSql?: boolean
    searchCount?: boolean
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
  }>('/api/post/postRecommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 下架 GET /api/post/record/delById */
export async function getApiPostRecordDelById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id?: string
  },
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/post/record/delById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 查询指定Creator PostList POST /api/post/record/findByCreatorId */
export async function postApiPostRecordFindByCreatorId(
  body: {
    creatorId?: number
    page?: number
    size?: number
  },
  options?: { [key: string]: any },
) {
  return request<{
    records?: {
      id?: number
      gmtCreate?: { seconds?: number; nanos?: number }
      gmtModified?: { seconds?: number; nanos?: number }
      gmtDeleted?: { seconds?: number; nanos?: number }
      creatorId?: number
      content?: string
      label?: string
      documentTsvector?: string
      likeSize?: number
      commentSize?: number
      lookSize?: number
      status?: number
      mediaList?: string
    }[]
    total?: number
    size?: number
    current?: number
  }>('/api/post/record/findByCreatorId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 通过Label搜索Post GET /api/post/record/findByLabel */
export async function getApiPostRecordFindByLabel(
  body: {
    /** 标签 */
    label?: string
    /** 页码 */
    page?: number
    /** 数量 */
    size?: number
  },
  options?: { [key: string]: any },
) {
  return request<{
    records?: {
      id?: number
      gmtCreate?: { seconds?: number; nanos?: number }
      gmtModified?: { seconds?: number; nanos?: number }
      gmtDeleted?: { seconds?: number; nanos?: number }
      creatorId?: number
      content?: string
      label?: string
      documentTsvector?: string
      likeSize?: number
      commentSize?: number
      lookSize?: number
      status?: number
      mediaList?: string
    }[]
    total?: number
    size?: number
    current?: number
  }>('/api/post/record/findByLabel', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 点赞 POST /api/post/record/like */
export async function postApiPostRecordLike(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    postId?: string
    userId?: string
  },
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/post/record/like', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 更新浏览量 POST /api/post/record/look */
export async function postApiPostRecordLook(
  body: {
    postIds?: number[]
  },
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/post/record/look', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发布 POST /api/post/record/save */
export async function postApiPostRecordSave(
  body: {
    content?: string
    label?: string
    mediaList?: { id?: number }[]
    creatorId?: number
  },
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/post/record/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
