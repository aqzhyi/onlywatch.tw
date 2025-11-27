import { match } from 'ts-pattern'
import { envVars } from '~/envVars'
import type { Tables } from '~/(services)/database/types'
import { fetchRssFeed } from './fetchers/fetchRssFeed'
import { fetchTradingViewNews } from './fetchers/fetchTradingViewNews'
import type { FeedItem, TradingViewConfig } from './types'

/**
 * Fetch feed items based on feed type
 *
 * Dispatches to appropriate fetcher based on `feed.feed_type`:
 *
 * - 'rss': Uses `fetchRssFeed` for XML-based RSS/Atom feeds
 * - 'tradingview': Uses `fetchTradingViewNews` for TradingView JSON API
 *
 * @example
 *   // RSS feed
 *   const rssItems = await fetchFeedItems({
 *     id: 1,
 *     feed_type: 'rss',
 *     feed_url: 'https://example.com/rss',
 *     feed_config: null,
 *   })
 *
 * @example
 *   // TradingView feed
 *   const tvItems = await fetchFeedItems({
 *     id: 2,
 *     feed_type: 'tradingview',
 *     feed_url: envVars.TRADINGVIEW_NEWS_API_URL,
 *     feed_config: { symbols: 'NASDAQ:AAPL', language: 'zh-Hant' },
 *   })
 */
export async function fetchFeedItems(
  feed: Pick<
    Tables<'tg_rss_feeds'>,
    'id' | 'feed_type' | 'feed_url' | 'feed_config'
  >,
): Promise<FeedItem[]> {
  const items = await match(feed.feed_type)
    .with('rss', async () => {
      return await fetchRssFeed(feed.feed_url)
    })
    .with('tradingview', async () => {
      if (!feed.feed_config) {
        console.error(`🔴 TradingView feed ${feed.id} missing feed_config`)
        return []
      }

      const config = feed.feed_config as unknown as TradingViewConfig
      return await fetchTradingViewNews(config)
    })
    .otherwise(() => {
      console.error(`🔴 Unknown feed type: ${feed.feed_type}`)
      return []
    })

  // Set feed_id for all items
  return items.map((item) => ({ ...item, feed_id: feed.id }))
}
