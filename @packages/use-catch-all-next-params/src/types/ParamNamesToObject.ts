/**
 * 🔄 Convert extracted param names to required object type
 *
 * @example
 *   type Input = ['brand', 'search']
 *   type Output = { brand: string; search: string }
 *
 * @example
 *   type Input = ['id']
 *   type Output = { id: string }
 *
 * @example
 *   type Input = []
 *   type Output = {}
 *
 * @complexity Time: O(n) where n is the number of parameter names
 * @complexity Space: O(n) for storing the object type properties
 */
export type ParamNamesToObject<T extends readonly string[]> = {
  [K in T[number]]: string
}
