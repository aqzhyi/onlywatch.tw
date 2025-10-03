/**
 * Parse catch-all segments by matching against a template pattern
 *
 * @example
 *   //
 *   // 💡 input and output
 *
 *   parseCatchAllSegments(
 *     ['brand', 'nvidia', 'search', 'rtx 4090'], // the params from Catch-All Segments Route
 *     '/mall/brand/{brand}/search/{search}', // your designed route template
 *   )
 *   // returns: { brand: 'nvidia', search: 'rtx 4090' }
 *
 *   parseCatchAllSegments(['search', 'hello-world'], '/search/{query}')
 *   // returns: { query: 'hello-world' }
 *
 *   parseCatchAllSegments(['user', '123', 'profile'], '/user/{id}/profile')
 *   // returns: { id: '123' }
 *
 * @example
 *   //
 *   // 🚀 get NextParams in Server-Component
 *
 *   export default function NextPage(
 *     props: PageProps<'/mall/[[...nextParams]]'>,
 *   ) {
 *     // nextParams returns [ 'search', 'rtx 5090' ]
 *     const { nextParams } = await pageProps.params
 *
 *     // serverParams returns { search: 'rtx 5090' }
 *     const serverParams = parseCatchAllSegments(
 *       nextParams,
 *       '/mall/brand/{brand}/search/{search}',
 *     )
 *   }
 *
 * @example
 *   //
 *   // 🚀 get NextParams in Client-Component
 *
 *   'use client'
 *   export function MyComponent(props) {
 *     // 👀 also see the hook version `useCatchAllNextParams`
 *     parseCatchAllSegments(
 *       location.pathname, // the params from current URL
 *       '/mall/brand/{brand}/search/{search}', // your designed route template
 *     )
 *     // returns { brand: 'nvidia', search: 'rtx 4090' }
 *     // if current pathname is '/mall/brand/nvidia/search/rtx 4090'
 *   }
 *
 * @example
 *   //
 *   // ⛑️ edge cases
 *
 *   //
 *   // 💡 no params provided
 *   parseCatchAllSegments([], '/mall/brand/{brand}/search/{search}')
 *   // returns {}
 *
 *   //
 *   // 💡 only one param provided, should match `search/{search}`
 *   parseCatchAllSegments(
 *     ['search', 'rtx 5090'],
 *     '/mall/brand/{brand}/search/{search}',
 *   )
 *   // returns { search: 'rtx 5090' }
 *
 *   //
 *   // 💡 params do not match the template at all
 *   parseCatchAllSegments(
 *     ['nvidia', 'rtx 5090'],
 *     '/mall/brand/{brand}/search/{search}',
 *   )
 *   // returns {}
 *
 * @complexity Time: O(n) for string input, O(n×m) for array input; Space: O(1) where n is template segments, m is URL segments
 */
export function parseCatchAllSegments(
  /**
   * @example
   *   // 💡 in Server-Component
   *   // the `props.params` will return an array for NextParams of catch-all segments, e.g.:
   *   pathname = ['brand', 'nvidia', 'search', 'rtx 5090']
   *
   * @example
   *   // 💡 in Client-Component
   *   // you can directly use location.pathname to get the current path string as input for this parameter
   *   pathname = location.pathname // returns '/mall/brand/nvidia/search/rtx 5090'
   */
  pathname: string | string[],
  /**
   * @example
   *   //
   *   // 🚀 your designed route template with parameter placeholders and in order
   *   '/mall/brand/{brand}/search/{search}'
   */
  template: string,
): Record<string, string> {
  const templateSegments = template.split('/').filter(Boolean)

  if (Array.isArray(pathname)) {
    return parseArrayPathname(pathname, templateSegments)
  } else {
    return parseStringPathname(pathname, templateSegments)
  }
}

/**
 * Parse string pathname against template pattern
 *
 * @complexity Time: O(n), Space: O(1) where n is the number of template segments
 */
function parseStringPathname(
  pathname: string,
  templateSegments: string[],
): Record<string, string> {
  const params: Record<string, string> = {}
  const urlSegments = pathname.split('/').filter(Boolean)

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

  return params
}

/**
 * Parse array pathname (Next.js catch-all params) with simplified matching
 * logic
 *
 * @complexity Time: O(n×m), Space: O(1) where n is template segments length and m is URL segments length
 */
function parseArrayPathname(
  urlSegments: string[],
  templateSegments: string[],
): Record<string, string> {
  const params: Record<string, string> = {}

  // Empty array returns empty object
  if (urlSegments.length === 0) {
    return params
  }

  // Try to find the best match by testing different alignments
  // This handles cases where array should match different parts of template
  // Test from end to beginning to prefer end-matching
  for (
    let offset = templateSegments.length - urlSegments.length;
    offset >= 0;
    offset--
  ) {
    const currentParams: Record<string, string> = {}
    let isValidMatch = true

    // Test alignment at this offset
    for (let i = 0; i < urlSegments.length && isValidMatch; i++) {
      const templateIndex = offset + i
      const templateSegment = templateSegments[templateIndex]
      const urlSegment = urlSegments[i]

      if (!templateSegment) {
        isValidMatch = false
        break
      }

      if (
        templateSegment.startsWith('{') &&
        templateSegment.endsWith('}') &&
        urlSegment
      ) {
        // Parameter segment
        const paramName = templateSegment.slice(1, -1)
        currentParams[paramName] = decodeURIComponent(urlSegment)
      } else {
        // Static segment must match exactly
        if (templateSegment !== urlSegment) {
          isValidMatch = false
          break
        }
      }
    }

    if (isValidMatch) {
      // Found a valid match, return it
      Object.assign(params, currentParams)
      break
    }
  }

  return params
}
