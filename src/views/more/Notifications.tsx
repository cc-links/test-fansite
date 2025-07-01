'use client'

import { NOTIFICATIONS_ITEMS } from './constants/menu-routes'
import { PAGE_NAMES } from './constants/page-names'
import { PageProps } from '@/types/page'
import { PageContent } from '@/views/more/Setting/PageContent'
import { CellGroupItems } from '@/views/more/Setting/CellGroupItems'
import { useState } from 'react'
import NotificationsEmail from './NotificationsEmail'
import NotificationsPush from './NotificationsPush'

export default function Notifications({ title = PAGE_NAMES.NOTIFICATIONS, ...props }: PageProps) {
  const [page, setPage] = useState<string | null>(null)

  return (
    <>
      <PageContent title={title} {...props}>
        <CellGroupItems
          items={{ group: true, children: NOTIFICATIONS_ITEMS }}
          cellClick={(item) => {
            //  router.push(item.to)
            setPage(item.label)
          }}
        />
      </PageContent>

      {page === PAGE_NAMES.NOTIFICATION_PUSH && (
        <NotificationsPush rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
      {page === PAGE_NAMES.NOTIFICATION_EMAIL && (
        <NotificationsEmail rootClassName="absolute inset-0" onBack={() => setPage(null)} />
      )}
    </>
  )
}
