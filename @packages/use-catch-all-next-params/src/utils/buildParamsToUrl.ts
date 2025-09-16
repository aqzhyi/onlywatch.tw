import { filterValidParams } from './filterValidParams'

/**
 * @example
 *   buildParamsToUrl({ category: 'electronics', page: 2 }, '/products')
 *   // Returns: '/products/category/electronics/page/2'
 *
 *   buildParamsToUrl({}, '/products')
 *   // Returns: '/products'
 *
 *   buildParamsToUrl({ query: 'search term' }, '/search')
 *   // Returns: '/search/query/search%20term'
 *
 * @complexity O(n) where n is the number of parameters
 */
export function buildParamsToUrl(
  params: Record<string, unknown>,
  baseUrl: string,
): string {
  const validParams = filterValidParams(params)

  if (validParams.length === 0) {
    return baseUrl
  }

  const segments = validParams.flatMap(([key, value]) => [
    key,
    encodeURIComponent(String(value)),
  ])

  return `${baseUrl}/${segments.join('/')}`
}
