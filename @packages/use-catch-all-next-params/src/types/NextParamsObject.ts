import type { ExtractParamsFromUrl } from './ExtractParamsFromUrl'

/**
 * 🎯 Extract params object type from URL template
 *
 * @example
 *   type Input = '/mall/brand/{brand}/search/{search}'
 *   type Output = { brand: string; search: string }
 *
 * @example
 *   type Input = '/user/{id}/profile'
 *   type Output = { id: string }
 *
 * @example
 *   type Input = '/static-page'
 *   type Output = {}
 */
export type NextParamsObject<TUrlTemplate extends string = string> =
  ExtractParamsFromUrl<TUrlTemplate>

/**
 * 🔄 Partial params object for updates (allows partial updates as shown in
 * README examples)
 *
 * @example
 *   type Input = '/mall/brand/{brand}/search/{search}'
 *   type Output = {
 *     brand?: string | undefined | null
 *     search?: string | undefined | null
 *   }
 *
 * @example
 *   // Usage: setParams({ brand: 'nvidia' }) // ✅ Only brand needed
 *   // Usage: setParams({ search: 'rtx 4090' }) // ✅ Only search needed
 *   // Usage: setParams({ brand: undefined }) // ✅ Remove brand parameter
 *   // Usage: setParams({ search: null }) // ✅ Remove search parameter
 */
export type NextParamsObjectNilable<TUrlTemplate extends string = string> = {
  [K in keyof ExtractParamsFromUrl<TUrlTemplate>]?:
    | ExtractParamsFromUrl<TUrlTemplate>[K]
    | undefined
    | null
}
