/**
 * Sanitize and split search query for database operations
 *
 * This utility function:
 *
 * 1. Sanitizes input query to prevent SQL injection
 * 2. Splits the query by commas and spaces
 * 3. Filters out empty strings
 * 4. Returns an array of clean query terms
 *
 * @example
 *   sanitizeAndSplitQuery('美國, GDP 數據') // ['美國', 'GDP', '數據']
 *   sanitizeAndSplitQuery('fed meeting, inflation') // ['fed', 'meeting', 'inflation']
 *   sanitizeAndSplitQuery('') // []
 *   sanitizeAndSplitQuery(undefined) // []
 */
export function sanitizeAndSplitQuery(query?: string): string[] {
  if (!query) {
    return []
  }

  return query
    .split(/[,\s]/)
    .map((singleQuery) => sanitizeQuery(singleQuery))
    .filter((singleQuery) => singleQuery.length > 0)
}

// ! ⛑️ avoid sql injection
const sanitizeQuery = (singleQuery: string): string => {
  return (
    singleQuery
      // First remove SQL comment symbols and dangerous patterns
      .replaceAll(/--+/g, '') // Remove SQL comment syntax
      .replaceAll(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      // Then allow only safe characters: Chinese, English, numbers, spaces, single hyphens, underscores, and dots
      .replaceAll(/[^a-zA-Z0-9\u4E00-\u9FFF\s_.-]/g, '')
      .trim()
  )
}
