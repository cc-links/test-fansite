import { loggerDB } from '@/npm/x-utils'
import { usePaging } from '@/npm/x-utils-rc'
import React from 'react'

import { XLoggerLogItem } from '@/npm/x-utils'
import { Button } from '@x-vision/design/index.js'
import { LogItem } from './_components/LogItem'
import { PageKeyLine } from './_components/PageKeyLine'

export default function ToolLogsConsolePage() {
  const logsPaging = usePaging<XLoggerLogItem, { cursor?: number; pageSize?: number }>({
    service: async (params, option) => {
      const data = await loggerDB.queryLogs(params.cursor, params.pageSize)
      console.log(data)
      option.pushData(data.data)
      if (!data.hasMore) {
        option.end()
      }
      option.setParams({
        cursor: data.cursor,
      })
    },
    queryParams: {
      pageSize: 50,
    },
  })

  return (
    <div>
      {logsPaging.data.map((item, index) => {
        const visiblePageKeyLine = item.commonMeta.pageKey !== logsPaging.data[index + 1]?.commonMeta.pageKey
        return (
          <>
            <LogItem key={item.id} item={item} />
            {visiblePageKeyLine && <PageKeyLine pageKey={logsPaging.data[index + 1]?.commonMeta.pageKey || ''} />}
          </>
        )
      })}

      <Button onClick={() => logsPaging.loadMore()}>load more</Button>
    </div>
  )
}
