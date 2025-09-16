/**
 * @example
 *   convertUrlSegmentsToParams('category/electronics/page/2')
 *   // Returns: { category: 'electronics', page: '2' }
 *
 *   convertUrlSegmentsToParams('search/hello%20world')
 *   // Returns: { search: 'hello world' }
 *
 *   convertUrlSegmentsToParams('')
 *   // Returns: {}
 *
 * @complexity O(n) where n is the number of path segments
 */
export function convertUrlSegmentsToParams(
  pathSegments: string,
): Record<string, string> {
  if (!pathSegments) {
    return {}
  }

  const segments = pathSegments.split('/')
  const params: Record<string, string> = {}

  for (let pairIndex = 0; pairIndex < segments.length; pairIndex += 2) {
    const paramName = segments[pairIndex]
    const paramValue = segments[pairIndex + 1]

    if (paramName && paramValue) {
      params[paramName] = decodeURIComponent(paramValue)
    }
  }

  return params
}
