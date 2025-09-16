/**
 * @example
 *   filterValidParams({ name: 'John', age: 25, empty: '', invalid: null })
 *   // Returns: [['name', 'John'], ['age', '25']]
 *
 *   filterValidParams({ page: 1, limit: undefined })
 *   // Returns: [['page', '1']]
 *
 *   filterValidParams({})
 *   // Returns: []
 *
 * @complexity O(n) where n is the number of parameters
 */
export function filterValidParams(
  params: Record<string, unknown>,
): Array<[string, string]> {
  return Object.entries(params)
    .filter(
      ([key, value]) => value !== undefined && value !== null && value !== '',
    )
    .map(([key, value]) => [key, String(value)])
}
