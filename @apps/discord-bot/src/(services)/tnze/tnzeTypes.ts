import z, { number } from 'zod'

export const tnzeTypes = {
  /**
   * @example
   *   return {
   *     p: 0,
   *     data: [
   *       {
   *         id: 1,
   *         rlv: 1,
   *         item_id: 5056,
   *         item_name: '青銅錠',
   *         item_amount: 1,
   *         job: '鍛造',
   *         difficulty_factor: 50,
   *         quality_factor: 80,
   *         durability_factor: 67,
   *         material_quality_factor: 0,
   *         required_craftsmanship: 0,
   *         required_control: 0,
   *         can_hq: true,
   *         recipe_notebook_list: 0,
   *       },
   *     ],
   *   }
   */
  RecipeTable: z.object({
    can_hq: z.boolean(),
    difficulty_factor: z.number(),
    durability_factor: z.number(),
    id: z.number(),
    item_amount: z.number(),
    item_id: z.number(),
    item_name: z.string(),
    job: z.string(),
    material_quality_factor: z.number(),
    quality_factor: z.number(),
    recipe_notebook_list: z.number(),
    required_control: z.number(),
    required_craftsmanship: z.number(),
    rlv: z.number(),
  }),
  /**
   * @example
   *   return [
   *     [item_id, materials_amount],
   *     [item_id, materials_amount],
   *     // ...
   *   ]
   */
  RecipeItems: z.tuple([z.number(), z.number()]),
  /**
   * @example
   *   return {
   *     id: 19957,
   *     name: '輝鉬礦',
   *     level: 285,
   *     can_be_hq: 0,
   *     item_ui_category_id: 48,
   *     item_search_category_id: 47,
   *     item_action_id: 3001,
   *   }
   */
  ItemInfo: z.object({
    can_be_hq: z.number(),
    id: z.number(),
    item_action_id: z.number(),
    item_search_category_id: z.number(),
    item_ui_category_id: z.number(),
    level: z.number(),
    name: z.string(),
  }),
}
