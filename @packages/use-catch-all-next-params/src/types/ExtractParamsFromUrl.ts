import type { ExtractParamNames } from './ExtractParamNames'
import type { ParamNamesToObject } from './ParamNamesToObject'

/**
 * 🎯 Main utility: Extract params object type from URL template
 *
 * @example
 *   type Input = '/mall/brand/{brand}/search/{search}'
 *   type Output = { brand: string; search: string }
 *
 * @complexity Time: O(n) where n is the length of the URL template
 * @complexity Space: O(k) where k is the number of parameters extracted
 */
export type ExtractParamsFromUrl<T extends string> = ParamNamesToObject<
  ExtractParamNames<T>
>
