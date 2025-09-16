/**
 * @example
 *   type Input = ['brand', 'category']
 *   type Output = {
 *     brand?: string | undefined
 *     category?: string | undefined
 *   }
 *
 * @example
 *   type Input = ['search']
 *   type Output = { search?: string | undefined }
 *
 * @example
 *   type Input = []
 *   type Output = {}
 */
export type ParamsObject<T extends readonly string[]> = {
  [K in T[number]]?: string | undefined
}
