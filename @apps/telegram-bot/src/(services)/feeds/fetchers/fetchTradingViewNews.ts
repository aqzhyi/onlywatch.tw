import { parseJsonFeed } from 'feedsmith'
import { envVars } from '~/envVars'
import type { FeedItem, TradingViewConfig } from '../types'

interface TradingViewResponseItem {
  id: string
  title: string
  published: number
  storyPath: string
  relatedSymbols?: Array<{ symbol: string; logoid: string }>
  provider?: { id: string; name: string; logo_id: string }
}

interface TradingViewResponse {
  items: TradingViewResponseItem[]
}

/**
 * Build TradingView API URL with query parameters
 *
 * @example
 *   buildTradingViewUrl({
 *     symbols: 'NASDAQ:AAPL',
 *     language: 'zh-Hant',
 *   })
 *
 * @param config - TradingView configuration (symbols, language)
 * @returns Complete API URL with query string
 */
function buildTradingViewUrl(config: TradingViewConfig): string {
  const url = new URL(envVars.TRADINGVIEW_NEWS_API_URL)
  url.searchParams.append('filter', `lang:${config.language}`)
  url.searchParams.append('filter', `symbol:${config.symbols}`)
  url.searchParams.set('streaming', 'false')
  url.searchParams.set('user_prostatus', 'premium')
  url.searchParams.set('client', 'screener')
  url.searchParams.set('username', 'aqzhyi')
  return url.toString()
}

/**
 * Fetch and parse TradingView news feed
 *
 * @example
 *   const items = await fetchTradingViewNews({
 *     symbols: 'NASDAQ:AAPL',
 *     language: 'zh-Hant',
 *   })
 *
 * @param config - TradingView configuration
 * @returns Array of feed items
 */
export async function fetchTradingViewNews(
  config: TradingViewConfig,
): Promise<FeedItem[]> {
  const apiUrl = buildTradingViewUrl(config)
  const tvResponse = (await fetch(apiUrl).then((res) =>
    res.json(),
  )) as TradingViewResponse

  // Transform to JSON Feed format
  const jsonFeedObject = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'tradingview news flow',
    home_page_url: 'https://tradingview.com',
    items: tvResponse.items
      .filter(
        (item) =>
          item.relatedSymbols?.length &&
          item.provider &&
          item.title &&
          item.published &&
          item.storyPath,
      )
      .map((item) => ({
        id: item.id,
        title: item.title,
        url: `https://tradingview.com${item.storyPath}`,
        content_text: `此新聞提及 ${item.relatedSymbols!.map((s) => s.symbol).join(', ')} 並由 ${item.provider!.name} 提供`,
        date_published: new Date(item.published * 1000).toISOString(),
      })),
  }

  // Parse using feedsmith
  const jsonFeed = parseJsonFeed(jsonFeedObject)

  return (jsonFeed.items || []).map((item) => ({
    feed_id: 0, // Will be set by caller
    title: item.title || '',
    link: item.url || '',
    description: item.content_text || item.summary || '',
    pubDate: item.date_published || '',
  }))
}
