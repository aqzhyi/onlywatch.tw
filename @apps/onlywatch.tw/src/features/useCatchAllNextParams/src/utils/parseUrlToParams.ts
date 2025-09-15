import { convertUrlSegmentsToParams } from '~/features/useCatchAllNextParams/src/utils/convertUrlSegmentsToParams'
import { getRelativePathFromUrl } from '~/features/useCatchAllNextParams/src/utils/getRelativePathFromUrl'

/**
 * @example
 *   parseUrlToParams('/products/category/electronics/page/2', '/products')
 *   // Returns: { category: 'electronics', page: '2' }
 *
 *   parseUrlToParams('/products/', '/products')
 *   // Returns: {}
 *
 *   parseUrlToParams('/search/query/hello%20world', '/search')
 *   // Returns: { query: 'hello world' }
 *
 * @complexity O(n) where n is the number of path segments
 */
export function parseUrlToParams(
  pathname: string,
  baseUrl: string,
): Record<string, string> {
  const cleanPath = getRelativePathFromUrl(pathname, baseUrl)
  return convertUrlSegmentsToParams(cleanPath)
}
