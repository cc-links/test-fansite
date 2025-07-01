import { useEffect, useState } from 'react'
import PostCard from './PostCard'
import PostCardActions from './PostCardActions'
import { PostHeadActions } from './PostCardHeadActions'
import { Drawer } from '@x-vision/design'
import ReportMain from '@/module/MessageList/Drawer/ReportMessageDrawer/ReportMain'
import TipsMain from '@/module/MessageList/Drawer/TipsDrawer/TipsMain'

export default function PostList() {
  const headImgUrl = ''
  const nickName = 'Nick Name'
  const userName = 'userName'
  const createTime = '4:11 pm'
  const content =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  // 帖子举报弹窗
  const [reportPostDrawerVisible, setReportPostDrawerVisible] = useState(false)
  const [openTipsDrawer, setOpenTipsDrawer] = useState(false)

  /**
   * 举报
   * @param id 帖子id
   */
  async function handleReport(id: string) {
    setReportPostDrawerVisible(true)
    //
  }

  /**
   * 取消关注
   * @param id 帖子id
   */
  async function handleUnfollow(id: string) {
    //
  }

  /**
   * 删除帖子
   * @param id 帖子id
   */
  async function handleDelete(id: string) {
    //
  }

  /**
   * 发送私信
   * @param id 帖子id
   */
  async function handleSendMessage(id: string) {
    //
  }

  /**
   * 点赞 / 取消点赞
   * @param id 帖子id
   */
  async function handleLikeChange(id: string) {
    //
  }

  /**
   * 小费
   * @param id 帖子id
   */
  async function handleTips(id: string) {
    setOpenTipsDrawer(true)
    //
  }

  /**
   * 分享
   * @param id 帖子id
   */
  async function handleShare(id: string) {
    //
  }

  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <PostCard
          key={index}
          id={`${index}`}
          headImgUrl={headImgUrl}
          online={true}
          nickName={nickName}
          userName={userName}
          createTime={createTime}
          content={content}
          media={Array.from({ length: index }).map((_, index) =>
            index === 1
              ? { type: 'video', src: 'https://video.699pic.com/videos/14/93/71/b_YucsQKb8xkrp1562149371_10s.mp4' }
              : { type: 'image', src: `https://dummyimage.com/300x300/63b95a/fff/?text=${index}` },
          )}
          // media={[
          //   ...Array.from({ length: index }).map((_, index) => ({ type: 'image', src: `https://dummyimage.com/300x300/63b95a/fff/?text=${index}` })),
          //   // { type: 'image', src: `https://dummyimage.com/300x300/63b95a/fff/?text=${index + 3}` },
          //   // { type: 'video', src: 'https://video.699pic.com/videos/14/93/71/b_YucsQKb8xkrp1562149371_10s.mp4' }
          // ]}
          headActionsRender={
            index % 2 === 0 && (
              <PostHeadActions
                isMine={true}
                onReport={() => handleReport(`${index}`)}
                onUnfollow={() => handleUnfollow(`${index}`)}
                onDelete={() => handleDelete(`${index}`)}
              />
            )
          }
          footActionsRender={
            <PostCardActions
              readonly={index % 2 === 0}
              like={index % 3 === 0}
              viewCount={`${index * 2}`}
              likeCount={`${index * 3}`}
              tipsCount={`$${index * 4}`}
              onSendMessage={() => handleSendMessage(`${index}`)}
              onLikeChange={() => handleLikeChange(`${index}`)}
              onTips={() => handleTips(`${index}`)}
              onShare={() => handleShare(`${index}`)}
            />
          }
        />
      ))}
      <Drawer
        open={reportPostDrawerVisible}
        onOpenChange={setReportPostDrawerVisible}
        direction="right"
        handleSlot={false}
        closeSlot={false}
        header={false}
        footer={false}
        nested={true}
        className="max-w-full !w-full"
        // dismissible={false}
      >
        {reportPostDrawerVisible && (
          <div className="max-w-full !w-full">
            <ReportMain userId="" toUserId="" />
          </div>
        )}
      </Drawer>

      <Drawer
        shouldScaleBackground
        handleSlot={false}
        open={openTipsDrawer}
        onOpenChange={setOpenTipsDrawer}
        className="max-h-[95dvh]!"
        header={false}
        footer={false}
      >
        <TipsMain
          name={''} // 对方名称
        />
      </Drawer>
    </div>
  )
}
