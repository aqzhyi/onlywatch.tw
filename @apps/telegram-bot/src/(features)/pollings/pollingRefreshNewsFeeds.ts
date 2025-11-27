import is from '@sindresorhus/is'
import { CronJob } from 'cron'
import spacetime from 'spacetime'
import { database } from '~/(services)/database'
import type { Tables } from '~/(services)/database/types'
import { fetchFeedItems } from '~/(services)/feeds/fetchFeedItems'

/**
 * 掃描所有 FeedUrls 並將 newsfeeds 存入資料庫
 */
export function pollingRefreshNewsFeeds() {
  CronJob.from({
    start: true,
    runOnInit: true,
    /**
     * Run every 60 seconds
     *
     * @see https://crontab.cronhub.io/
     */
    cronTime: '*/60 * * * * *',
    timeZone: 'Asia/Taipei',
    onTick: async () => {
      const { data: feeds, error: feedsError } = await database
        .from('tg_rss_feeds')
        .select('id, feed_type, feed_url, feed_config, enabled')
        .eq('enabled', true)

      const _newsfeeds = await Promise.all(
        (feeds || []).map(async (feed) => {
          try {
            return await fetchFeedItems(feed)
          } catch (error: unknown) {
            if (is.error(error)) {
              console.log(`🔴`, `[feed_id=${feed.id}]`, error)
            }
            return []
          }
        }),
      )
      const newsfeeds = _newsfeeds.flat()

      console.info('🆕 newsfeeds incoming count', newsfeeds.length)

      const { count, error: upsertNewsFeedsError } = await database
        .from('tg_rss_items')
        .upsert(
          newsfeeds
            .map((item) => {
              if (!item?.feed_id) return
              if (!item?.link) return
              if (!item?.pubDate) return
              if (!item?.title) return
              if (!item?.description) return

              return {
                feed_id: item.feed_id,
                title: item.title,
                link: item.link,
                description: item.description,
                pub_date: spacetime(item.pubDate).timezone('GMT+8').iso(),
              } satisfies Partial<Tables<'tg_rss_items'>>
            })
            .filter(Boolean),
          {
            onConflict: 'title',
            ignoreDuplicates: true,
          },
        )

      if (count && count > 0) {
        console.log(`🆕 Inserted ${count} new news feeds`)
      }

      if (upsertNewsFeedsError) {
        console.error('🔴 upsertNewsFeedsError', upsertNewsFeedsError)
      }
    },
  })
}
