import z from 'zod'
import { tnzeTypes } from './tnzeTypes'
import { envVar } from '~/envVar'

/** ff14 (Tnze) 八大生產系配方材料 API */
export const tnzeApp = {
  async searchRecipes(name = '') {
    const url = new URL(`${envVar.FF14_TNZE_API_URL}/recipe_table`)
    url.searchParams.set('page_id', '0')
    url.searchParams.set('search_name', `%${name}%`)

    return await fetch(`${url}`).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch recipes: ${res.statusText}`)
      }

      const json = (await res.json()) as { data: unknown }

      return z.array(tnzeTypes.RecipeTable).safeParse(json.data)
    })
  },
  async findOneRecipeItems(tnzeRecipeId: number) {
    const url = new URL(`${envVar.FF14_TNZE_API_URL}/recipes_ingredientions`)
    url.searchParams.set('recipe_id', `${tnzeRecipeId}`)

    return await fetch(`${url}`).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch recipes: ${res.statusText}`)
      }

      const json = (await res.json()) as unknown

      return z.array(tnzeTypes.RecipeItems).safeParse(json)
    })
  },
  async findOneItemInfo(tnzeItemId: number) {
    const url = new URL(`${envVar.FF14_TNZE_API_URL}/item_info`)
    url.searchParams.set('item_id', `${tnzeItemId}`)

    return await fetch(`${url}`).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch item info: ${res.statusText}`)
      }

      const json = (await res.json()) as unknown

      return tnzeTypes.ItemInfo.safeParse(json)
    })
  },
}
