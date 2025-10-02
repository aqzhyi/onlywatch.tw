/**
 * Parse URL by matching against a template pattern
 *
 * @example
 *   // 🚀 get NextParams of Catch-All Segments in Server-Component
 *
 *   export default function Page(
 *     props: PageProps<'/mall/[[...nextParams]]'>,
 *   ) {
 *     // [ 'search', 'rtx 5090' ]
 *     const { nextParams } = await pageProps.params
 *
 *     // { search: 'rtx 5090' }
 *     const serverParams = parseUrlByTemplate(
 *       nextParams,
 *       '/mall/brand/{brand}/search/{search}',
 *     )
 *   }
 *
 * @example
 *   parseUrlByTemplate(
 *     '/mall/brand/nvidia/search/rtx 4090',
 *     '/mall/brand/{brand}/search/{search}',
 *   )
 *   // Returns: { brand: 'nvidia', search: 'rtx 4090' }
 *
 *   parseUrlByTemplate('/search/hello-world', '/search/{query}')
 *   // Returns: { query: 'hello-world' }
 *
 *   parseUrlByTemplate('/user/123/profile', '/user/{id}/profile')
 *   // Returns: { id: '123' }
 *
 * @complexity O(n) where n is the number of URL segments
 */
export function parseUrlByTemplate(
  /**
   * @example
   *   // client side pathname
   *   '/mall/brand/nvidia/search/rtx-4090'
   *
   * @example
   *   // server side props.params of Catch-All Segments
   *   ;['search', 'rtx 5090']
   */
  pathname: string | string[],
  /**
   * @example
   *   '/mall/brand/{brand}/search/{search}'
   */
  template: string,
): Record<string, string> {
  // Split both URL and template into segments
  const urlSegments = Array.isArray(pathname)
    ? pathname
    : pathname.split('/').filter(Boolean)
  const templateSegments = template.split('/').filter(Boolean)

  const params: Record<string, string> = {}

  // For arrays, try multiple matching strategies to find the best fit
  if (Array.isArray(pathname)) {
    let bestMatch = {}
    let bestMatchScore = 0

    // Try different starting positions in the template
    for (
      let startOffset = 0;
      startOffset <= templateSegments.length - urlSegments.length;
      startOffset++
    ) {
      const currentMatch: Record<string, string> = {}
      let score = 0
      let isValidMatch = true
      let staticMatches = 0
      let parameterMatches = 0

      for (let i = 0; i < urlSegments.length && isValidMatch; i++) {
        const templateIndex = startOffset + i
        const templateSegment = templateSegments[templateIndex]
        const urlSegment = urlSegments[i]

        if (!templateSegment) {
          isValidMatch = false
          break
        }

        // Check if template segment is a parameter placeholder
        if (templateSegment.startsWith('{') && templateSegment.endsWith('}')) {
          // Extract parameter name and decode URL value
          const paramName = templateSegment.slice(1, -1)
          if (urlSegment) {
            currentMatch[paramName] = decodeURIComponent(urlSegment)
            parameterMatches += 1
          }
        } else {
          // Static segment must match exactly
          if (templateSegment !== urlSegment) {
            isValidMatch = false
            break
          } else {
            staticMatches += 1
          }
        }
      }

      if (isValidMatch) {
        // Scoring strategy: prioritize static matches, then parameter matches
        // Static matches indicate a better structural alignment
        score = staticMatches * 10 + parameterMatches

        // Special case: if we have static matches, this is likely the intended match
        // Otherwise, for single values without static matches, prefer end-of-template matching
        const hasStaticMatch = staticMatches > 0
        if (!hasStaticMatch && urlSegments.length === 1) {
          // For single parameter arrays, prefer matching the last parameter in template
          const lastParameterIndex =
            templateSegments.length - 1 - urlSegments.length + 1
          if (startOffset === lastParameterIndex) {
            score += 5 // Boost score for end-matching single parameters
          }
        }

        // Update best match if this one is better
        if (score > bestMatchScore) {
          bestMatch = currentMatch
          bestMatchScore = score
        }
      }
    }

    // Use the best match found
    Object.assign(params, bestMatch)
  } else {
    // Original logic for string pathnames
    for (let index = 0; index < templateSegments.length; index++) {
      const templateSegment = templateSegments[index]
      const urlSegment = urlSegments[index]

      // If URL segment or template segment doesn't exist, we can't match
      if (!urlSegment || !templateSegment) {
        break
      }

      // Check if template segment is a parameter placeholder
      if (templateSegment.startsWith('{') && templateSegment.endsWith('}')) {
        // Extract parameter name and decode URL value
        const paramName = templateSegment.slice(1, -1)
        const paramValue = decodeURIComponent(urlSegment)
        params[paramName] = paramValue
      } else {
        // Static segment must match exactly
        if (templateSegment !== urlSegment) {
          // Mismatch in static segments, stop parsing
          break
        }
      }
    }
  }

  return params
}
