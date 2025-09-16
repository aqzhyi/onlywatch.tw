/**
 * @example
 *   getRelativePathFromUrl('/products/category/electronics', '/products')
 *   // Returns: 'category/electronics'
 *
 *   getRelativePathFromUrl('/products/', '/products')
 *   // Returns: ''
 *
 *   getRelativePathFromUrl('/search/query/test', '/products')
 *   // Returns: ''
 *
 * @complexity O(n) where n is the length of pathname
 */
export function getRelativePathFromUrl(
  pathname: string,
  baseUrl: string,
): string {
  const relativePath = pathname.startsWith(baseUrl)
    ? pathname.slice(baseUrl.length)
    : ''

  if (!relativePath || relativePath === '/') {
    return ''
  }

  return relativePath.replace(/^\//, '')
}
