import { universalisTypes } from '~/(services)/universalis/universalisTypes'
import { envVar } from '~/envVar'

/**
 * ff14 (Universalis) 繁中服、國際服、日服等伺服器材料物價與銷售歷史等 API
 *
 * API 的速率限制為每秒 25 次請求（突發 50 次請求），而網站本身的限制則為每秒 15 次請求（突發 30 次請求），如果你是進行爬取的話。每個
 * IP 的同時連線數上限為 8。
 *
 * TODO: 規畫參數能夠給予不同 DataCenter name 功能，例如（暫定，尚未確定定案）：
 *
 * - 中國服(輸入參數為`中国`)
 * - 繁中服(輸入參數為`繁中服`) (此為現狀，目前為寫死的參數)
 * - 韓服(輸入參數為`한국`)
 * - 日服(輸入參數為`Japan` 或者 `Elemental` 或者 `Gaia` 或者 `Mana` 或者 `Meteor`)
 *
 * @see https://docs.universalis.app/
 */
export const universalisApp = {
  findItemSaleHistory: async function (id: number[]) {
    let error = null
    if (id.length === 0) {
      error = new Error('至少提供一個物品 ID 來查找物品的銷售歷史')
    }

    const url = new URL(
      `${envVar.FF14_UNIVERSALIS_API_URL}/history/繁中服/${id.join(',')}`,
    )
    url.searchParams.set('minSalePrice', '0')
    url.searchParams.set('maxSalePrice', '2147483647')

    return await fetch(`${url}`).then(async (res) => {
      return universalisTypes.itemSaleHistory.safeParse(await res.json())
    })
  },
  /**
   * 查詢過去 4 天之物品平均銷售情況
   *
   * 如果需要比較即時的物價資訊，請使用 {@link universalisApp.findManyItemsCurrentPrice} 方法。
   *
   * AverageSalePrice 和 DailySaleVelocity 是根據過去 4 天的銷售情況計算得出。
   *
   * 取得指定物品的整合市場板資料。最多可用逗號分隔的 100 個 item ID，以一次取得多個物品的資料。
   */
  findManyItemsAggregated: async function (id: number[]) {
    let error = null
    if (id.length === 0) {
      error = new Error('至少提供一個物品 ID 來查詢物價')
    }

    const url = new URL(
      `${envVar.FF14_UNIVERSALIS_API_URL}/aggregated/繁中服/${id.join(',')}`,
    )

    return await fetch(`${url}`).then(async (res) => {
      return universalisTypes.aggregatedItems.safeParse(await res.json())
    })
  },
  /**
   * 查詢現在拍賣版中之物品價格與銷售資訊
   *
   * 支援一次查詢多個物品（最多 100 個），返回即時的拍賣版價格與銷量資訊
   */
  findManyItemsCurrentPrice: async function (id: number[]) {
    let error = null
    if (id.length === 0) {
      error = new Error('至少提供一個物品 ID 來查詢物價')
    }

    const url = new URL(
      `${envVar.FF14_UNIVERSALIS_API_URL}/繁中服/${id.join(',')}`,
    )

    return await fetch(`${url}`).then(async (res) => {
      const json = await res.json()
      // 單個物品查詢時，直接返回物品資料
      if (id.length === 1) {
        return universalisTypes.OneItemCurrentPrice.safeParse(json)
      }
      // 多個物品查詢時，返回包含 items 字典的資料
      return universalisTypes.ManyItemsCurrentPrice.safeParse(json)
    })
  },
}
