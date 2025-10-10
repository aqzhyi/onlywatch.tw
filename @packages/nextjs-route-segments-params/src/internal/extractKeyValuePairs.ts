/**
 * Get key-value pairs from segments array for the given keys
 *
 * This is the shared core logic for parseSegments and useSegments
 *
 * @example
 *   // returns: { brand: 'nvidia', query: 'rtx 5090' }
 *   extractKeyValuePairs(
 *     ['brand', 'query'],
 *     ['brand', 'nvidia', 'query', 'rtx 5090'],
 *   )
 *
 * @example
 *   // 💡 Handle odd number of segments
 *   // returns: { brand: 'nvidia', query: 'rtx 5090', beta: undefined }
 *   extractKeyValuePairs(
 *     ['brand', 'query', 'beta'],
 *     ['brand', 'nvidia', 'query', 'rtx 5090', 'beta'],
 *   )
 *
 * @example
 *   // 💡 Handle key not found
 *   // returns: { brand: 'nvidia', notfound: undefined, query: 'rtx 5090' }
 *   extractKeyValuePairs(
 *     ['brand', 'notfound', 'query'],
 *     ['brand', 'nvidia', 'query', 'rtx 5090'],
 *   )
 *
 * @example
 *   // 💡 URL decoding - automatically decodes URL encoded characters
 *   // returns: { query: '利率決議' }
 *   extractKeyValuePairs(
 *     ['query'],
 *     ['query', '%E5%88%A9%E7%8E%87%E6%B1%BA%E8%AD%B0'],
 *   )
 *
 * @complexity
 *   - Time: O(n × m) where n = segmentsKeys.length, m = segments.length
 *   - Space: O(n) where n = segmentsKeys.length
 */
export function extractKeyValuePairs<const Keys extends readonly string[]>(
  segmentsKeys: Keys,
  segments: string[],
): {
  [K in Keys[number]]?: string | undefined
} {
  const result = {} as {
    [K in Keys[number]]?: string | undefined
  }

  for (const key of segmentsKeys) {
    const keyIndex = segments.indexOf(key)

    if (keyIndex === -1) {
      result[key as Keys[number]] = undefined
    } else {
      const valueIndex = keyIndex + 1
      const value = segments[valueIndex]

      // decode URL encoded characters and use value if it exists
      // otherwise return undefined
      result[key as Keys[number]] =
        value !== undefined ? decodeURIComponent(value) : undefined
    }
  }

  return result
}
