'use client'

import { Button, cln, Drawer, DrawerClose, DrawerFooter, Loading } from '@x-vision/design'
import { useEffect, useRef, useState } from 'react'
import { BlockedUser, useBlockedValue } from './PrivacyBlocked.data'
import { postApiRelationUnblockUser } from '@/services/relation'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/views/more/Setting/PageContent'
import { UserItemCell } from '@/views/more/Setting/UserItemCell'

export default function PrivacyBlocked({ title = PAGE_NAMES.BLOCKED, className, ...props }: PageProps) {
  const { loading, blockState, setBlockState, fetchNextBlocked } = useBlockedValue()
  const [dialogData, setDialogData] = useState({
    open: false,
    loading: true,
    data: {} as BlockedUser,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (loading || !blockState.hasNext) return
          const next = (Number(blockState.cursor) || 0) + 1

          fetchNextBlocked(next)
        }
      },
      { root: containerRef.current, rootMargin: '10px', threshold: 0 },
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loading])

  async function unblock(user: BlockedUser) {
    const uid = user.userId
    if (!uid) return
    setDialogData((data) => ({ ...data, loading: true }))
    try {
      await postApiRelationUnblockUser({ blockUserId: uid })
      setDialogData({ open: false, loading: false, data: {} })

      const items = blockState.items.filter((item) => item.userId !== uid)

      setBlockState((v) => ({ ...v, items, cursor: '0' }))
    } catch (_) {
      setDialogData((v) => ({ ...v, open: true }))
    }
  }

  return (
    <PageContent screen className={cln('flex flex-col flex-1 overflow-hidden', className)} title={title} {...props}>
      <div ref={containerRef} className="size-full flex flex-col overflow-y-auto">
        {blockState.items.map((item, index) => (
          <UserItemCell
            {...item}
            key={`${item.userId}-${index}`}
            right={
              <Button
                className="shrink-0"
                size="generous"
                onClick={() => setDialogData({ open: true, data: item, loading: false })}
              >
                Unblock
              </Button>
            }
          />
        ))}
        {blockState.hasNext ? (
          <div ref={sentinelRef} className="flex items-center justify-center p-2">
            <Loading />
          </div>
        ) : (
          <div className="typography-numbers-body1-base text-center text-(--light-brand-primary-01) mt-(--named-small)">
            No more
          </div>
        )}
      </div>

      <Drawer
        handleSlot={false}
        open={dialogData.open}
        onOpenChange={(v) => setDialogData((data) => ({ ...data, open: v }))}
        className="h-[60vh]! py-(--sizing-named-huge) px-(--named-mini)"
      >
        <div className="overflow-y-auto gap-(--named-small) flex flex-col mb-(--named-medium) text-center">
          <div className="typography-text-body1-strong text-(--element-emphasis-00)">
            <div>Unblock</div>
            <div>{dialogData.data.nickName}</div>
          </div>
          <div className="typography-text-body1-open text-(--element-emphasis-01)">
            {dialogData.data.nickName} will be able to see your posts, follow and message you on X. They won’t be
            notified that you unblocked them.
          </div>
        </div>
        <DrawerFooter className="gap-(--named-medium) p-0">
          <Button size="huge" color="stop" onClick={() => unblock(dialogData.data)} loading={dialogData.loading}>
            Unblock
          </Button>
          <DrawerClose asChild>
            <Button size="huge">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </Drawer>
    </PageContent>
  )
}
