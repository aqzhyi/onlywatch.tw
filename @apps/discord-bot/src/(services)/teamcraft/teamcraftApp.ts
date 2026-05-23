import z from 'zod'
import { teamcraftTypes } from './teamcraftTypes'

const TC_TW_BASE_URL =
  'https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/tw'

type TwRecipe = z.infer<typeof teamcraftTypes.TwRecipe>

export type TcRecipeInfo = {
  resultItemId: number
  resultItemName: string
  rlvl: number
  jobName: string
  yields: number
}

// ─── module-level caches ─────────────────────────────────────────────────────

let _idToName: Map<number, string> | null = null
let _nameToId: Map<string, number> | null = null
let _jobNames: Map<number, string> | null = null
let _recipeByResultId: Map<number, TwRecipe> | null = null

// ─── private loaders ─────────────────────────────────────────────────────────

async function loadTwItems(): Promise<void> {
  if (_idToName) return
  const json = (await fetch(`${TC_TW_BASE_URL}/tw-items.json`).then((r) =>
    r.json(),
  )) as unknown
  const parsed = teamcraftTypes.TwItems.parse(json)
  _idToName = new Map()
  _nameToId = new Map()
  for (const [k, v] of Object.entries(parsed)) {
    const id = Number(k)
    _idToName.set(id, v.tw)
    _nameToId.set(v.tw, id)
  }
}

async function loadTwJobNames(): Promise<void> {
  if (_jobNames) return
  const json = (await fetch(`${TC_TW_BASE_URL}/tw-job-name.json`).then((r) =>
    r.json(),
  )) as unknown
  const parsed = teamcraftTypes.TwJobNames.parse(json)
  _jobNames = new Map()
  for (const [k, v] of Object.entries(parsed)) {
    _jobNames.set(Number(k), v.tw)
  }
}

async function loadTwRecipes(): Promise<void> {
  if (_recipeByResultId) return
  const json = (await fetch(`${TC_TW_BASE_URL}/tw-recipes.json`).then((r) =>
    r.json(),
  )) as unknown
  const parsed = z.array(teamcraftTypes.TwRecipe).parse(json)
  _recipeByResultId = new Map()
  for (const recipe of parsed) {
    _recipeByResultId.set(recipe.result, recipe)
  }
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * ff14 TeamCraft TW data service.
 *
 * All three data files (`tw-items.json`, `tw-recipes.json`, `tw-job-name.json`)
 * are lazy-loaded on first use and cached in memory for the lifetime of the
 * process.
 *
 * Data source: TeamCraft TW 7.1
 *
 * @see https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/tree/master/libs/data/src/lib/json/tw
 */
export const teamcraftApp = {
  /**
   * Returns the TW item name for a given FFXIV item ID, or `null` if not found.
   */
  async findItemName(itemId: number): Promise<string | null> {
    await loadTwItems()
    return _idToName!.get(itemId) ?? null
  },

  /**
   * Returns the FFXIV item ID for a given TW item name, or `null` if not found.
   */
  async findItemId(name: string): Promise<number | null> {
    await loadTwItems()
    return _nameToId!.get(name) ?? null
  },

  /**
   * Returns the TW job name for a given job ID, or `null` if not found.
   *
   * @example
   *   await teamcraftApp.findJobName(13) // "裁縫師"
   */
  async findJobName(jobId: number): Promise<string | null> {
    await loadTwJobNames()
    return _jobNames!.get(jobId) ?? null
  },

  /**
   * Searches for a crafting recipe by the exact TW item name.
   *
   * Returns a {@link TcRecipeInfo} or `null` if no recipe is found.
   */
  async searchRecipes(name: string): Promise<TcRecipeInfo | null> {
    await Promise.all([loadTwItems(), loadTwRecipes(), loadTwJobNames()])
    const resultItemId = _nameToId!.get(name)
    if (resultItemId === undefined) return null
    const recipe = _recipeByResultId!.get(resultItemId)
    if (!recipe) return null
    const jobName = _jobNames!.get(recipe.job) ?? '未知職業'
    return {
      resultItemId: recipe.result,
      resultItemName: name,
      rlvl: recipe.rlvl,
      jobName,
      yields: recipe.yields,
    }
  },

  /**
   * Returns the ingredients for a recipe identified by its result item ID.
   *
   * Returns an empty array if no matching recipe is found.
   */
  async findRecipeIngredients(
    resultItemId: number,
  ): Promise<Array<{ id: number; amount: number }>> {
    await loadTwRecipes()
    const recipe = _recipeByResultId!.get(resultItemId)
    if (!recipe) return []
    return recipe.ingredients.map(({ id, amount }) => ({ id, amount }))
  },
}
