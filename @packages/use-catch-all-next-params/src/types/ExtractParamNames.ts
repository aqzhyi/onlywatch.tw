/**
 * 💡 Extract parameter names from URL template
 *
 * @example
 *   type Input = '/mall/brand/{brand}/search/{search}'
 *   type Output = ['brand', 'search']
 *
 * @example
 *   type Input = '/user/{id}/profile'
 *   type Output = ['id']
 *
 * @example
 *   type Input = '/static-page'
 *   type Output = []
 *
 * @complexity Time: O(n) where n is the length of the string template
 * @complexity Space: O(k) where k is the number of parameters found
 */
export type ExtractParamNames<T extends string> =
  T extends `${string}{${infer Param}}${infer Rest}`
    ? [Param, ...ExtractParamNames<Rest>]
    : []
