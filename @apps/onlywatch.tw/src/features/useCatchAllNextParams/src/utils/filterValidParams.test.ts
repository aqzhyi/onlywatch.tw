import { describe, it, expect } from 'vitest'
import { filterValidParams } from './filterValidParams'

describe('filterValidParams', () => {
  it('should filter out null, undefined, and empty string values', () => {
    const result = filterValidParams({
      name: 'John',
      age: 25,
      empty: '',
      invalid: null,
      missing: undefined,
    })
    expect(result).toEqual([
      ['name', 'John'],
      ['age', '25'],
    ])
  })

  it('should convert all values to strings', () => {
    const result = filterValidParams({
      page: 1,
      active: true,
      count: 0,
      disabled: false,
    })
    expect(result).toEqual([
      ['page', '1'],
      ['active', 'true'],
      ['count', '0'],
      ['disabled', 'false'],
    ])
  })

  it('should handle empty object', () => {
    const result = filterValidParams({})
    expect(result).toEqual([])
  })

  it('should handle object with all invalid values', () => {
    const result = filterValidParams({
      empty: '',
      nullValue: null,
      undefinedValue: undefined,
    })
    expect(result).toEqual([])
  })

  it('should preserve zero values', () => {
    const result = filterValidParams({
      count: 0,
      percentage: 0.0,
      index: 0,
    })
    expect(result).toEqual([
      ['count', '0'],
      ['percentage', '0'],
      ['index', '0'],
    ])
  })

  it('should handle special object types', () => {
    const result = filterValidParams({
      date: new Date('2023-01-01'),
      array: [1, 2, 3],
      object: { nested: 'value' },
    })
    expect(result).toHaveLength(3)
    expect(result[0]?.[0]).toBe('date')
    expect(result[1]?.[0]).toBe('array')
    expect(result[2]?.[0]).toBe('object')
  })

  it('should handle large parameter objects efficiently', () => {
    const largeParams: Record<string, string> = {}
    for (let i = 0; i < 100; i++) {
      largeParams[`param${i}`] = `value${i}`
    }

    const result = filterValidParams(largeParams)
    expect(result).toHaveLength(100)
  })

  it('should handle parameters with very long values', () => {
    const longValue = 'x'.repeat(5000)
    const result = filterValidParams({ longParam: longValue })
    expect(result).toHaveLength(1)
    expect(result[0]?.[1]).toBe(longValue)
  })

  it('should handle Unicode characters correctly', () => {
    const unicodeParams = {
      chinese: '中文',
      emoji: '🚀💯',
      japanese: 'こんにちは',
      arabic: 'مرحبا',
    }

    const result = filterValidParams(unicodeParams)
    expect(result).toHaveLength(4)
    expect(result).toContainEqual(['chinese', '中文'])
    expect(result).toContainEqual(['emoji', '🚀💯'])
    expect(result).toContainEqual(['japanese', 'こんにちは'])
    expect(result).toContainEqual(['arabic', 'مرحبا'])
  })

  it('should handle maximum safe integer values', () => {
    const bigNumbers = {
      maxSafe: Number.MAX_SAFE_INTEGER,
      minSafe: Number.MIN_SAFE_INTEGER,
      infinity: Number.POSITIVE_INFINITY,
      negInfinity: Number.NEGATIVE_INFINITY,
      nan: Number.NaN,
    }

    const result = filterValidParams(bigNumbers)
    expect(result).toHaveLength(5)
  })
})
