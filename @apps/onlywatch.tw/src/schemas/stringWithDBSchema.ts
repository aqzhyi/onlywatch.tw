import z from 'zod'

/**
 * provide an input element schema for user input
 *
 * especially the input element related to database queries
 *
 * ! has consider preventing SQL Injection attacks
 */
export const stringWithDBSchema = z.string().refine(
  (userInputQuery) => {
    // Normalize the input to prevent Unicode bypass attacks
    const normalizedInput = userInputQuery.normalize('NFKC')

    // ! prevent SQL injection attacks
    const sqlInjectionPatterns = [
      // More specific SQL keywords to avoid false positives
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION)\b)/i,
      // Dangerous logical operators in SQL context (more specific)
      /(\bOR\b\s+\d+\s*[=<>]+\s*\d+)/i,
      /(\bAND\b\s+\d+\s*[=<>]+\s*\d+)/i,
      // SQL special characters and comments
      /(--|\/\*|\*\/|;|'|"|`)/,
      // Union-based injection
      /(\bUNION\b\s+\bSELECT\b)/i,
      // Schema manipulation
      /(\bDROP\b\s+\bTABLE\b)/i,
      /(\bALTER\b\s+\bTABLE\b)/i,
      // Script injection
      /(<script|javascript:|data:|vbscript:)/i,
      // Function calls that could be dangerous
      /(exec\s*\(|eval\s*\(|system\s*\()/i,
      // SQL functions that shouldn't be in user input
      /(\b(LOAD_FILE|INTO\s+OUTFILE|DUMPFILE)\b)/i,
    ]

    const containsSqlInjection = sqlInjectionPatterns.some((pattern) =>
      pattern.test(normalizedInput),
    )

    // Extended Chinese character ranges and common symbols
    const allowedCharactersOnly =
      /^[a-zA-Z0-9\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6Df\u2A700-\u2B73f\u2B740-\u2B81f\u2B820-\u2CEAf\uF900-\uFAFF\u3300-\u33FF\uFE30-\uFE4F\uFF00-\uFFEF\s+\-_()（）]*$/.test(
        normalizedInput,
      )

    return !containsSqlInjection && allowedCharactersOnly
  },
  {
    message:
      'you can only input Chinese, English, numbers, spaces, and basic punctuation',
  },
)

export type inputSchemaTypes = z.infer<typeof stringWithDBSchema>
