/**
 * Build URL by replacing template placeholders with actual parameter values
 * Supports dynamic URL construction where missing parameters result in
 * truncated URLs
 *
 * @example
 *   buildUrlFromTemplate('/mall/brand/{brand}/search/{search}', {
 *     brand: 'nvidia',
 *     search: 'rtx 4090',
 *   })
 *   // Returns: '/mall/brand/nvidia/search/rtx 4090'
 *
 *   buildUrlFromTemplate('/user/{id}/profile', { id: '123' })
 *   // Returns: '/user/123/profile'
 *
 *   buildUrlFromTemplate('/static-page', {})
 *   // Returns: '/static-page'
 *
 *   buildUrlFromTemplate('/mall/brand/{brand}/search/{search}', {
 *     search: 'rtx 5090',
 *   })
 *   // Returns: '/mall/search/rtx 5090' (skip missing brand parameter)
 *
 *   buildUrlFromTemplate('/mall/brand/{brand}/search/{search}', {})
 *   // Returns: '/mall' (truncated to base static part)
 *
 * @complexity O(n) where n is the number of segments in the template
 */
export function buildUrlFromTemplate(
  template: string,
  params: Record<string, unknown>,
): string {
  // Split template into segments for analysis
  const segments = template.split('/').filter(Boolean)
  const resultSegments: string[] = []

  let index = 0
  while (index < segments.length) {
    const segment = segments[index]

    // Safety check for undefined segment
    if (!segment) {
      index++
      continue
    }

    // Check if this segment is a parameter placeholder
    if (segment.startsWith('{') && segment.endsWith('}')) {
      const paramName = segment.slice(1, -1) // Remove { and }
      const paramValue = params[paramName]

      // If parameter is missing, undefined, or null, skip this parameter
      if (paramValue === undefined || paramValue === null) {
        index++
        continue
      }

      // Add the parameter value as human-readable string
      resultSegments.push(String(paramValue))
      index++
    } else {
      // Check if next segment is a parameter placeholder for this parameter name
      const nextSegment = segments[index + 1]

      if (
        nextSegment &&
        nextSegment.startsWith('{') &&
        nextSegment.endsWith('}')
      ) {
        // This is a parameter name, check if the parameter exists
        const paramName = nextSegment.slice(1, -1)
        const paramValue = params[paramName]

        // If parameter is missing, undefined, or null, skip both segments
        if (paramValue === undefined || paramValue === null) {
          index += 2 // Skip both parameter name and placeholder
          continue
        }

        // Add both the parameter name and the human-readable value
        resultSegments.push(segment)
        resultSegments.push(String(paramValue))
        index += 2 // Skip both segments as we processed them
      } else {
        // This is a static segment, always include it
        resultSegments.push(segment)
        index++
      }
    }
  }

  // Build the final URL
  return resultSegments.length === 0 ? '/' : '/' + resultSegments.join('/')
}
