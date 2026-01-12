import { universalisTypes } from '~/(services)/universalis/universalisTypes'
import { envVar } from '~/envVar'

/** 用於查詢 ff14 各個伺服器（包含繁中服）材料物品之物價 */
export const universalisApp = {
  findManyItemsPrice: async function (id: number[]) {
    if (id.length === 0) throw new Error('需要提供至少一個物品 ID 才能查詢物價')

    const url = new URL(
      `${envVar.FF14_UNIVERSALIS_API_URL}/aggregated/繁中服/${id.join(',')}`,
    )

    return await fetch(`${url}`).then(async (res) => {
      return universalisTypes.aggregatedItems.safeParse(await res.json())
    })
  },
}
