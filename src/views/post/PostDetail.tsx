import { useState } from 'react'
import { EnumCheckSource } from '@/types'
import Image from 'next/image'
import HeadImage from './images/head.svg'
import PostHead from '@/module/Post/PostHead'
import PostList from '@/module/Post/PostList'

export function PostDetail() {
  const [login, setLogin] = useState(false)
  return (
    <div className="overflow-y-auto">
      <PostList />
    </div>
  )
}
