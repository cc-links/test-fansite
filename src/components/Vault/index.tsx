import { setVaultDrawerVisible } from '@/models/message/model'
import { Navbar } from '@x-vision/design/index.js'

interface IProps {
  toUserId?: string
  userId: string
}
export default function Vault(props: IProps) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 顶部 */}
      <Navbar
        leftArrow
        onLeftArrowClick={() => {
          setVaultDrawerVisible(false)
        }}
        right={
          // TODO 需要判断是使用端还是创建端
          <div className="flex items-center gap-2">
            <div>1</div>
            <div>+</div>
          </div>
        }
      >
        Vault
      </Navbar>
      {/* 搜索栏 */}
      {/* 收藏tag */}
      {/* 分类 */}
      {/* 列表 */}
    </div>
  )
}
