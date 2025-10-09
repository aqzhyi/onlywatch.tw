import { extractKeyValuePairs } from '../internal'

/**
 * get matching key-value pairs from segmentsParams based on given keys
 *
 * @example
 *   // 💡 how to get `segmentsParams` in React Server Component (RSC)
 *   // assume route is `'/[locale]/mall/[[...segmentsParams]]'`
 *   // assume pathname is `'/zh-TW/mall/brand/nvidia/query/rtx 5090'`
 *
 *   // ℹ️ `PageProps` and `LayoutProps` are built-in types in `next.js@^15.0.0`
 *   export default async function NextPage(
 *     props: PageProps<'/[locale]/mall/[[...segmentsParams]]'>,
 *   ) {
 *     // Get `segmentsParams` from NextPage `props.params`
 *     const { segmentsParams = [] } = await props.params
 *     // segmentsParams: ['brand', 'nvidia', 'query', 'rtx 5090']
 *
 *     // Use parseSegments to parse, automatically get correct type
 *     const params = parseSegments(['brand', 'query'], segmentsParams)
 *     // params: { brand: 'nvidia', query: 'rtx 5090' }
 *     // params type: { brand?: string | undefined; query?: string | undefined }
 *   }
 *
 * @example
 *   // 💡 basic usage: parse given keys
 *   // assume segmentsParams is `['brand', 'nvidia', 'query', 'rtx 5090']`
 *
 *   // returns: { brand: 'nvidia', query: 'rtx 5090' }
 *   // inferred: { brand?: string | undefined; query?: string | undefined }
 *   const params = parseSegments(['brand', 'query'], segmentsParams)
 *
 *   console.log(params.brand) // 'nvidia'
 *   console.log(params.query) // 'rtx 5090'
 *
 * @example
 *   // 💡 order of keys does not matter
 *   // assume segmentsParams is `['brand', 'nvidia', 'query', 'rtx 5090']`
 *
 *   // returns: { brand: 'nvidia', query: 'rtx 5090' }
 *   const params1 = parseSegments(['brand', 'query'], segmentsParams)
 *
 *   // Different order, same result ✅
 *   // returns: { brand: 'nvidia', query: 'rtx 5090' }
 *   const params2 = parseSegments(['query', 'brand'], segmentsParams)
 *
 * @example
 *   // 💡 handle odd number of segments (key exists but has no matching value)
 *   // assume segmentsParams is `['brand', 'nvidia', 'query', 'rtx 5090', 'beta']`
 *
 *   // returns: { brand: 'nvidia', query: 'rtx 5090', beta: undefined }
 *   // inferred: { brand?: string | undefined; query?: string | undefined; beta?: string | undefined }
 *   const params = parseSegments(['brand', 'query', 'beta'], segmentsParams)
 *
 *   console.log(params.beta) // undefined (because 'beta' has no matching value after it)
 *
 * @example
 *   // 💡 handle key not found
 *   // assume segmentsParams is `['brand', 'nvidia', 'query', 'rtx 5090']`
 *
 *   // returns: { brand: 'nvidia', notfound: undefined, query: 'rtx 5090' }
 *   // inferred: { brand?: string | undefined; notfound?: string | undefined; query?: string | undefined }
 *   const params = parseSegments(
 *     ['brand', 'notfound', 'query'],
 *     segmentsParams,
 *   )
 *
 *   console.log(params.notfound) // undefined (because 'notfound' does not exist in segmentsParams)
 *
 * @example
 *   // 💡 handle URL encoded characters
 *   // assume segmentsParams is `['query', '%E5%88%A9%E7%8E%87%E6%B1%BA%E8%AD%B0']`
 *
 *   // returns: { query: '利率決議' }
 *   // inferred: { query?: string | undefined }
 *   const params = parseSegments(['query'], segmentsParams)
 *
 *   // 💡 handle URL encoded characters with spaces
 *   // assume segmentsParams is `['query', '%E5%88%A9%E7%8E%87%E6%B1%BA%E8%AD%B0%20%E7%BE%8E%E8%81%AF%E5%84%B2']`
 *
 *   // returns: { query: '利率決議 美聯儲' }
 *   // inferred: { query?: string | undefined }
 *   const params = parseSegments(['query'], segmentsParams)
 *
 * @complexity
 *   - Time: O(n × m) where n is length of segmentsKeys, m is length of segmentsParams
 *   - Space: O(n) where n is length of segmentsKeys
 */
export function parseSegments<const Keys extends readonly string[]>(
  segmentsKeys: Keys,
  segmentsParams: string[],
): {
  [K in Keys[number]]?: string | undefined
} {
  // Use shared core parsing logic
  return extractKeyValuePairs(segmentsKeys, segmentsParams)
}
