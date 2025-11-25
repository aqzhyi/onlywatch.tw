import { CronJob } from 'cron'
import dedent from 'dedent'
import spacetime from 'spacetime'
import { database } from '~/(services)/database'
import type { Tables } from '~/(services)/database/types'
import { bot } from '~/(services)/telegram'

type ItemWithFeed = Tables<'tg_rss_items'> & {
  tg_rss_feeds: Pick<Tables<'tg_rss_feeds'>, 'id' | 'title' | 'enabled'>
}

type TelegramObserver = {
  observerId: number
  tgId: number
}

/**
 * 找出所有尚未推送的 newsfeeds 並推送到對應的 Telegram 群組
 *
 * 推送策略：
 *
 * - 只推送 1 小時內的新聞
 * - 透過 tg_push_history 追蹤推送狀態
 * - 失敗項目會自動重試（最多 3 次）
 * - 永久性錯誤（400/403/404）不再重試
 */
export function pollingPushNewsFeeds() {
  CronJob.from({
    start: true,
    runOnInit: true,
    /**
     * @see https://crontab.cronhub.io/
     */
    cronTime: '*/2 * * * *',
    timeZone: 'Asia/Taipei',
    onTick: async () => {
      const oneHourAgo = spacetime.now('Asia/Taipei').subtract(1, 'hour').iso()

      // Query items with their feed info
      const { data: rawItems, error: itemsError } = await database
        .from('tg_rss_items')
        .select(
          `
            *,
            tg_rss_feeds!inner (
              id,
              title,
              enabled
            )
          `,
        )
        .eq('tg_rss_feeds.enabled', true)
        .gte('pub_date', oneHourAgo)
        .order('pub_date', { ascending: false })
        .limit(100)

      if (itemsError) {
        console.error('❌ Failed to query items:', itemsError)
        return
      }

      if (!rawItems || rawItems.length === 0) {
        console.log('📭 No items found in last 1 hour')
        return
      }

      const items = rawItems as unknown as ItemWithFeed[]

      // Get all feed-observer relationships with tg_id
      const feedIds = items.map((item) => item.feed_id)
      const { data: rawFeedObservers, error: observersError } = await database
        .from('tg_watchers')
        .select(
          `
            feed_id,
            observer_id,
            tg_observers!inner (
              tg_id
            )
          `,
        )
        .in('feed_id', feedIds)

      if (observersError) {
        console.error('❌ Failed to query observers:', observersError)
        return
      }

      if (!rawFeedObservers || rawFeedObservers.length === 0) {
        console.log('📭 No subscribers found for these feeds')
        return
      }

      // Transform to include tg_id
      const feedObservers = rawFeedObservers.map((watcher) => ({
        feed_id: watcher.feed_id,
        observer_id: watcher.observer_id,
        tg_id: watcher.tg_observers.tg_id,
      }))

      // Get push history to filter out already-pushed items
      const itemIds = items.map((item) => item.id)
      const { data: pushHistory, error: historyError } = await database
        .from('tg_push_history')
        .select('item_id, observer_id, status, retry_count')
        .in('item_id', itemIds)

      if (historyError) {
        console.error('❌ Failed to query push history:', historyError)
        return
      }

      // Build push tasks
      const pushTasks: Array<{
        item: ItemWithFeed
        observerId: number
        tgId: number
      }> = []

      for (const item of items) {
        const subscribers = feedObservers.filter(
          (obs) => obs.feed_id === item.feed_id,
        )

        for (const subscriber of subscribers) {
          const historyRecord = pushHistory?.find(
            (history) =>
              history.item_id === item.id &&
              history.observer_id === subscriber.observer_id,
          )

          // Skip if already successfully pushed
          if (historyRecord?.status === 'success') {
            continue
          }

          // Skip if retry limit exceeded (retry_count >= 3 or === 999 for permanent failures)
          if (historyRecord && historyRecord.retry_count >= 3) {
            continue
          }

          pushTasks.push({
            item,
            observerId: subscriber.observer_id,
            tgId: subscriber.tg_id,
          })
        }
      }

      if (pushTasks.length === 0) {
        console.log('📭 No new items to push (all already sent)')
        return
      }

      console.log(
        `🔍 Found ${pushTasks.length} push tasks (within last 1 hour)`,
      )

      let successCount = 0
      let failureCount = 0

      for (const task of pushTasks) {
        const { item, observerId, tgId } = task
        const message = formatNewsMessage(item)

        try {
          await bot.api.sendMessage(tgId, message, {
            parse_mode: 'Markdown',
            link_preview_options: {
              is_disabled: false,
            },
          })

          // Success: record to history
          await database.from('tg_push_history').insert({
            item_id: item.id,
            observer_id: observerId,
            status: 'success',
            pushed_at: new Date().toISOString(),
            retry_count: 0,
          })

          console.log(
            `✅ Pushed item ${item.id} to subscriber ${observerId} (tg_id: ${tgId})`,
          )
          successCount++

          // Rate limit: 500ms between messages
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (error) {
          const errorInfo = extractTelegramError(error)

          console.error(
            `❌ Failed to push item ${item.id} to subscriber ${observerId} (tg_id: ${tgId}): ${errorInfo.message}`,
          )

          // Determine if it's a permanent failure
          const isPermanentFailure = [400, 403, 404].includes(
            errorInfo.statusCode,
          )
          const retryCount = isPermanentFailure ? 999 : 1

          await database.from('tg_push_history').insert({
            item_id: item.id,
            observer_id: observerId,
            status: 'failed',
            error_message: errorInfo.message,
            pushed_at: new Date().toISOString(),
            retry_count: retryCount,
          })

          if (isPermanentFailure) {
            console.warn(
              `⛔ Permanent failure for item ${item.id} to ${observerId} (tg_id: ${tgId}), will not retry`,
            )
          }

          failureCount++
        }
      }

      console.log(
        `📊 Push summary: ✅ ${successCount} success, ❌ ${failureCount} failed`,
      )
    },
  })
}

function formatNewsMessage(news: Tables<'tg_rss_items'>): string {
  return dedent`
    📺 ${new Date(news.pub_date).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
    🆕 [${news.title}](${news.link})
  `.trim()
}

type TelegramErrorInfo = {
  statusCode: number
  message: string
}

function extractTelegramError(error: unknown): TelegramErrorInfo {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>

    // Grammy/Telegram API error format
    if ('error_code' in err && typeof err.error_code === 'number') {
      return {
        statusCode: err.error_code,
        message: `[${err.error_code}] ${err.description || 'Unknown error'}`,
      }
    }

    // HTTP error format
    if (
      'response' in err &&
      err.response &&
      typeof err.response === 'object' &&
      'status' in err.response
    ) {
      const response = err.response as { status: number }
      const message =
        'message' in err && typeof err.message === 'string'
          ? err.message
          : 'HTTP error'

      return {
        statusCode: response.status,
        message: `[${response.status}] ${message}`,
      }
    }

    // Generic error
    if ('message' in err && typeof err.message === 'string') {
      return {
        statusCode: 500,
        message: `[500] ${err.message}`,
      }
    }
  }

  return {
    statusCode: 500,
    message: '[500] Unknown error',
  }
}
