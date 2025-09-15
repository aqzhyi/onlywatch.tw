import { describe, it, expect } from 'vitest'
import { buildParamsToUrl } from './buildParamsToUrl'

describe('buildParamsToUrl', () => {
  it('should build URL with valid parameters', () => {
    const result = buildParamsToUrl(
      { category: 'electronics', page: 2 },
      '/products',
    )
    expect(result).toBe('/products/category/electronics/page/2')
  })

  it('should return base URL when no parameters provided', () => {
    const result = buildParamsToUrl({}, '/products')
    expect(result).toBe('/products')
  })

  it('should encode special characters in parameter values', () => {
    const result = buildParamsToUrl({ query: 'search term' }, '/search')
    expect(result).toBe('/search/query/search%20term')
  })

  it('should handle complex characters that need encoding', () => {
    const result = buildParamsToUrl(
      { query: 'hello/world&test=value' },
      '/search',
    )
    expect(result).toBe('/search/query/hello%2Fworld%26test%3Dvalue')
  })

  it('should filter out invalid parameters (null, undefined, empty)', () => {
    const result = buildParamsToUrl(
      {
        valid: 'value',
        empty: '',
        nullValue: null,
        undefinedValue: undefined,
      },
      '/base',
    )
    expect(result).toBe('/base/valid/value')
  })

  it('should handle numeric and boolean values by converting to strings', () => {
    const result = buildParamsToUrl(
      {
        page: 1,
        active: true,
        count: 0,
        disabled: false,
      },
      '/api',
    )
    expect(result).toBe('/api/page/1/active/true/count/0/disabled/false')
  })

  it('should handle Unicode characters correctly', () => {
    const unicodeParams = {
      chinese: '中文',
      emoji: '🚀💯',
      japanese: 'こんにちは',
      arabic: 'مرحبا',
    }

    const result = buildParamsToUrl(unicodeParams, '/test')
    expect(result).toContain('/test')
    expect(result).toContain('chinese')
    expect(result).toContain('emoji')
    expect(result).toContain('japanese')
    expect(result).toContain('arabic')
  })

  it('should handle special URL characters', () => {
    const specialChars = {
      symbols: '!@#$%^&*()',
      brackets: '[]{}()',
      quotes: '\'"',
    }

    const result = buildParamsToUrl(specialChars, '/test')
    expect(result).toContain('/test')
    expect(result).toContain('symbols')
    expect(result).toContain('brackets')
    expect(result).toContain('quotes')
  })

  it('should handle zero values correctly', () => {
    const zeroValues = {
      zero: 0,
      zeroString: '0',
      falsy: false,
      falsyString: 'false',
    }

    const result = buildParamsToUrl(zeroValues, '/test')
    expect(result).toBe(
      '/test/zero/0/zeroString/0/falsy/false/falsyString/false',
    )
  })

  it('should handle maximum safe integer values', () => {
    const bigNumbers = {
      maxSafe: Number.MAX_SAFE_INTEGER,
      minSafe: Number.MIN_SAFE_INTEGER,
      infinity: Number.POSITIVE_INFINITY,
      negInfinity: Number.NEGATIVE_INFINITY,
      nan: Number.NaN,
    }

    const result = buildParamsToUrl(bigNumbers, '/test')
    expect(result).toContain('/test')
    expect(result).toContain('maxSafe')
    expect(result).toContain('minSafe')
    expect(result).toContain('infinity')
    expect(result).toContain('negInfinity')
    expect(result).toContain('nan')
  })
})
