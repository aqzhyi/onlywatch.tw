/**
 * get segments array from pathname string
 *
 * @example
 *   // returns: ['zh-TW', 'mall', 'brand', 'nvidia', 'query', 'rtx 5090']
 *   extractSegmentsFromPathname('/zh-TW/mall/brand/nvidia/query/rtx 5090')
 *
 * @example
 *   // 💡 handle URL encoding
 *   // returns: ['brand', 'nvidia', 'query', 'rtx 5090']
 *   extractSegmentsFromPathname('/brand/nvidia/query/rtx%205090')
 *
 * @example
 *   // 💡 handle empty pathname
 *   // returns: []
 *   extractSegmentsFromPathname('/')
 *
 * @example
 *   // 💡 handle extra slashes
 *   // returns: ['brand', 'nvidia']
 *   extractSegmentsFromPathname('//brand///nvidia//')
 *
 * @complexity
 *   - Time: O(n) where n is the length of pathname
 *   - Space: O(m) where m is the number of segments
 */
export function extractSegmentsFromPathname(pathname: string): string[] {
  // remove leading and trailing slashes, then split
  return (
    pathname
      .split('/')
      // filter out empty strings (handle multiple slashes in a row)
      .filter((segment) => segment.length > 0)
      // decode URL encoded characters
      .map((segment) => decodeURIComponent(segment))
  )
}
