import { universalisTypes } from '~/(services)/universalis/universalisTypes'
import { envVar } from '~/envVar'

/**
 * ff14 (Universalis) 繁中服、國際服、日服等伺服器材料物價與銷售歷史等 API
 *
 * API 的速率限制為每秒 25 次請求（突發 50 次請求），而網站本身的限制則為每秒 15 次請求（突發 30 次請求），如果你是進行爬取的話。每個
 * IP 的同時連線數上限為 8。
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
  findManyItemsPrice: async function (id: number[]) {
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
}
