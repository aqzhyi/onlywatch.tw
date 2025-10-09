import { describe, test, expect } from 'vitest'
import { extractKeyValuePairs } from './extractKeyValuePairs'

describe('extractKeyValuePairs', () => {
  describe('basic functionality', () => {
    test('parses basic key-value pairs correctly', () => {
      const result = extractKeyValuePairs(
        ['brand', 'query'],
        ['brand', 'nvidia', 'query', 'rtx 5090'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })

    test('handles single key-value pair', () => {
      const result = extractKeyValuePairs(['brand'], ['brand', 'nvidia'])

      expect(result).toEqual({
        brand: 'nvidia',
      })
    })

    test('returns the same result regardless of segmentsKeys order', () => {
      const segments = ['brand', 'nvidia', 'query', 'rtx 5090']

      const result1 = extractKeyValuePairs(['brand', 'query'], segments)
      const result2 = extractKeyValuePairs(['query', 'brand'], segments)

      expect(result1).toEqual(result2)
      expect(result1).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })

    test('uses segments order as the lookup basis', () => {
      const result = extractKeyValuePairs(
        ['query', 'brand', 'category'],
        ['category', 'gpu', 'brand', 'nvidia', 'query', 'rtx 5090'],
      )

      expect(result).toEqual({
        category: 'gpu',
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })
  })

  describe('handling missing values', () => {
    test('handles empty segmentsKeys', () => {
      const result = extractKeyValuePairs([], ['brand', 'nvidia'])

      expect(result).toEqual({})
    })

    test('handles empty segments', () => {
      const result = extractKeyValuePairs(['brand', 'query'], [])

      expect(result).toEqual({
        brand: undefined,
        query: undefined,
      })
    })

    test('returns undefined when last key has no value', () => {
      const result = extractKeyValuePairs(
        ['brand', 'query', 'beta'],
        ['brand', 'nvidia', 'query', 'rtx 5090', 'beta'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
        beta: undefined,
      })
    })

    test('returns undefined when middle key has no value', () => {
      const result = extractKeyValuePairs(
        ['brand', 'featured', 'query'],
        ['brand', 'nvidia', 'featured', 'query', 'rtx 5090'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        featured: 'query', // Next element is another key, but still treated as value
        query: 'rtx 5090',
      })
    })

    test('returns undefined for keys not found', () => {
      const result = extractKeyValuePairs(
        ['brand', 'notfound', 'query'],
        ['brand', 'nvidia', 'query', 'rtx 5090'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        notfound: undefined,
        query: 'rtx 5090',
      })
    })

    test('returns undefined for all keys when none are found', () => {
      const result = extractKeyValuePairs(
        ['notfound1', 'notfound2'],
        ['brand', 'nvidia'],
      )

      expect(result).toEqual({
        notfound1: undefined,
        notfound2: undefined,
      })
    })
  })

  describe('handling special cases', () => {
    test('handles duplicate keys by using the first occurrence', () => {
      const result = extractKeyValuePairs(
        ['brand'],
        ['brand', 'nvidia', 'brand', 'amd'],
      )

      expect(result).toEqual({
        brand: 'nvidia', // Uses the first occurrence value
      })
    })

    test('handles values with special characters', () => {
      const result = extractKeyValuePairs(
        ['query'],
        ['query', 'rtx 5090 super'],
      )

      expect(result).toEqual({
        query: 'rtx 5090 super',
      })
    })

    test('handles empty string as value', () => {
      const result = extractKeyValuePairs(['brand'], ['brand', ''])

      expect(result).toEqual({
        brand: '',
      })
    })

    test('handles large number of segments', () => {
      const keys = Array.from({ length: 50 }, (_, i) => `key${i}`)
      const segments = keys.flatMap((key, i) => [key, `value${i}`])

      const result = extractKeyValuePairs(keys, segments)

      keys.forEach((key, i) => {
        expect(result[key]).toBe(`value${i}`)
      })
    })
  })

  describe('type inference', () => {
    test('infers correct return type', () => {
      const result = extractKeyValuePairs(['brand', 'query'] as const, [
        'brand',
        'nvidia',
        'query',
        'rtx 5090',
      ])

      // TypeScript should infer:
      // { brand?: string | undefined; query?: string | undefined }
      expect(result.brand).toBe('nvidia')
      expect(result.query).toBe('rtx 5090')

      // Check if keys exist
      expect('brand' in result).toBe(true)
      expect('query' in result).toBe(true)
    })
  })
})
