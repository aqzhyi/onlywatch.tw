import { parseRssFeed } from 'feedsmith'
import type { FeedItem } from '../types'

/**
 * Fetch and parse RSS feed from URL
 *
 * @example
 *   const items = await fetchRssFeed('https://example.com/rss')
 *
 * @param feedUrl - RSS feed URL to fetch
 * @returns Array of feed items
 * @throws {Error} When fetch fails or RSS parsing fails
 */
export async function fetchRssFeed(feedUrl: string): Promise<FeedItem[]> {
  const rssXmlString = await fetch(feedUrl).then((res) => res.text())
  const rss = parseRssFeed(rssXmlString)

  return (rss.items || []).map((item) => ({
    feed_id: 0, // Will be set by caller
    title: item.title || '',
    link: item.link || '',
    description: item.description || '',
    pubDate: item.pubDate || '',
  }))
}
