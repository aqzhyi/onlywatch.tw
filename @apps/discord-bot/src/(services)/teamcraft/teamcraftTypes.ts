import z from 'zod'

export const teamcraftTypes = {
  /**
   * TW item names — `{ "itemId": { "tw": "繁中物品名稱" } }`
   *
   * @see https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/tw/tw-items.json
   */
  TwItems: z.record(z.string(), z.object({ tw: z.string() })),

  /**
   * TW job names — `{ "jobId": { "tw": "職業名稱" } }`
   *
   * @example
   *   { "13": { "tw": "裁縫師" } }
   *
   * @see https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/tw/tw-job-name.json
   */
  TwJobNames: z.record(z.string(), z.object({ tw: z.string() })),

  /**
   * A single TW recipe entry (`LazyTwRecipe`).
   *
   * Only the fields used by the bot are declared; extra fields from the source
   * JSON are silently stripped by zod's default strip mode.
   *
   * @see https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/tw/tw-recipes.json
   */
  TwRecipe: z.object({
    id: z.number(),
    result: z.number(),
    yields: z.number(),
    job: z.number(),
    rlvl: z.number(),
    ingredients: z.array(
      z.object({
        id: z.number(),
        amount: z.number(),
        quality: z.number().nullable(),
      }),
    ),
  }),
}
