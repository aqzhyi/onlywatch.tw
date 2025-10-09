/**
 * build new pathname based on original pathname and updated params
 *
 * rebuild rules:
 *
 * - only update segments in segmentsKeys
 * - keep segments not managed
 * - keep pathname prefix and suffix
 * - append new key-value pairs that don't exist in original pathname
 *
 * @example
 *   // returns: '/zh-TW/mall/brand/nvidia/query/rtx 4080'
 *   rebuildPathname('/zh-TW/mall/brand/nvidia/query/rtx 5090', ['query'], {
 *     query: 'rtx 4080',
 *   })
 *
 * @example
 *   // 💡 handle multiple segments
 *   // returns: '/mall/brand/amd/query/rx 7900'
 *   rebuildPathname(
 *     '/mall/brand/nvidia/query/rtx 5090',
 *     ['brand', 'query'],
 *     { brand: 'amd', query: 'rx 7900' },
 *   )
 *
 * @example
 *   // 💡 keep segments not managed
 *   // returns: '/zh-TW/mall/brand/nvidia/query/rtx 4080/featured/sale'
 *   rebuildPathname(
 *     '/zh-TW/mall/brand/nvidia/query/rtx 5090/featured/sale',
 *     ['query'],
 *     { query: 'rtx 4080' },
 *   )
 *
 * @example
 *   // 💡 handle undefined value (remove that segment pair)
 *   // returns: '/mall/brand/nvidia'
 *   rebuildPathname('/mall/brand/nvidia/query/rtx 5090', ['query'], {
 *     query: undefined,
 *   })
 *
 * @example
 *   // 💡 handle multiple undefined values (remove segment pairs)
 *   // returns: '/mall'
 *   rebuildPathname(
 *     '/mall/brand/nvidia/query/rtx 5090',
 *     ['brand', 'query'],
 *     {
 *       brand: undefined,
 *       query: undefined,
 *     },
 *   )
 *
 * @example
 *   // 💡 append new key-value pairs
 *   // returns: '/mall/brand/nvidia/query/rtx%205090'
 *   rebuildPathname('/mall/brand/nvidia', ['brand', 'query'], {
 *     brand: 'nvidia',
 *     query: 'rtx 5090',
 *   })
 *
 *   // 💡 append new key-value pairs to baseUrl
 *   // returns: '/mall/brand/nvidia/query/rtx%205090'
 *   rebuildPathname('/mall', ['brand', 'query'], {
 *     brand: 'nvidia',
 *     query: 'rtx 5090',
 *   })
 *
 * @example
 *   // 💡 handle empty string
 *   // returns: '/mall/brand/nvidia'
 *   rebuildPathname('/mall/brand/nvidia/query/rtx 5090', ['query'], {
 *     query: '',
 *   })
 *
 * @example
 *   // 💡 handle root path
 *   // returns: '/query/rtx%205090'
 *   rebuildPathname('/', ['query'], { query: 'rtx 5090' })
 *
 * @example
 *   // 💡 handle multiple slashes
 *   // returns: '/mall/brand/nvidia/query/rtx%205090'
 *   rebuildPathname('/mall//brand/nvidia///query/rtx 5090', ['query'], {
 *     query: 'rtx 5090',
 *   })
 *
 * @complexity
 *   - Time: O(n) where n = number of segments in pathname
 *   - Space: O(n) where n = number of segments
 */
export function rebuildPathname<const Keys extends readonly string[]>(
  originalPathname: string,
  segmentsKeys: Keys,
  params: {
    [K in Keys[number]]?: string | undefined
  },
): string {
  // convert original pathname to segments array
  const segments = originalPathname
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => decodeURIComponent(segment))

  // build new segments array
  const newSegments: string[] = []
  let index = 0

  // track which keys have been processed
  const processedKeys = new Set<string>()

  while (index < segments.length) {
    const currentSegment = segments[index] as Keys[number]

    // check if current segment is a managed key
    if (segmentsKeys.includes(currentSegment)) {
      // this is a managed key
      const key = currentSegment
      const newValue = params[key]

      if (newValue !== undefined && newValue !== '') {
        // has new value (non-empty), use new value
        newSegments.push(key)
        newSegments.push(newValue)
      }
      // if new value is undefined or empty string, skip this key-value pair (remove it)

      // mark this key as processed
      processedKeys.add(key)

      // skip original value (if it exists and is not a managed key)
      if (
        index + 1 < segments.length &&
        !segmentsKeys.includes(segments[index + 1]!)
      ) {
        index += 2
      } else {
        index += 1
      }
    } else {
      // this is not a managed key, keep it as is
      newSegments.push(currentSegment)
      index += 1
    }
  }

  // append new key-value pairs that weren't in the original pathname
  for (const key of segmentsKeys) {
    if (!processedKeys.has(key)) {
      const keyTyped = key as Keys[number]
      const newValue = params[keyTyped]

      if (newValue !== undefined && newValue !== '') {
        newSegments.push(keyTyped)
        newSegments.push(newValue)
      }
    }
  }

  const newPathname =
    '/' + newSegments.map((segment) => encodeURIComponent(segment)).join('/')

  return newPathname
}
