import { universalisTypes } from '~/(services)/universalis/universalisTypes'
import { envVar } from '~/envVar'

/** ff14 (Universalis) 繁中服、國際服、日服等伺服器材料物價與銷售歷史等 API */
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
