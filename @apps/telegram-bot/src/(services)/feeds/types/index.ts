/**
 * Represents a feed item from any source (RSS or TradingView)
 */
export interface FeedItem {
  /** Feed ID this item belongs to */
  feed_id: number
  /** Item title */
  title: string
  /** Item link URL */
  link: string
  /** Item description/content */
  description: string
  /** Publication date in ISO 8601 format */
  pubDate: string
}

/**
 * Configuration for TradingView news feed
 */
export interface TradingViewConfig {
  /**
   * Stock symbols to filter and should be sorted
   *
   * @example
   *   'FX_IDC:JPYTWD,FX_IDC:USDTWD,NASDAQ:TLT,PEPPERSTONE:AUDNZD,PEPPERSTONE:AUDUSD,PEPPERSTONE:EURGBP,PEPPERSTONE:EURUSD,PEPPERSTONE:GBPUSD,PEPPERSTONE:NZDUSD,PEPPERSTONE:USDCAD,PEPPERSTONE:USDCHF,PEPPERSTONE:USDJPY,PEPPERSTONE:USDX,TVC:DXY,TVC:JP20Y,TVC:US01Y,TVC:US02Y,TVC:US03Y,TVC:US20Y,TVC:VIX'
   */
  symbols: string
  /** Language code (e.g., "zh-Hant") */
  language: string
}
