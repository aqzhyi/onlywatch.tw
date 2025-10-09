import { describe, test, expect } from 'vitest'
import { parseSegments } from './parseSegments'

describe('parseSegments', () => {
  describe('basic functionality', () => {
    test('parses single key-value pair correctly', () => {
      const result = parseSegments(['brand'], ['brand', 'nvidia'])

      expect(result).toEqual({ brand: 'nvidia' })
    })

    test('parses multiple key-value pairs correctly', () => {
      const result = parseSegments(
        ['brand', 'query'],
        ['brand', 'nvidia', 'query', 'rtx 5090'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })

    test('parses three or more key-value pairs correctly', () => {
      const result = parseSegments(
        ['brand', 'query', 'sort'],
        ['brand', 'nvidia', 'query', 'rtx 5090', 'sort', 'price'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
        sort: 'price',
      })
    })

    test('is unaffected by segments order', () => {
      const result = parseSegments(
        ['brand', 'query'],
        ['query', 'rtx 5090', 'brand', 'nvidia'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })

    test('builds result object based on keys order', () => {
      const result = parseSegments(
        ['query', 'brand'],
        ['brand', 'nvidia', 'query', 'rtx 5090'],
      )

      expect(Object.keys(result)).toEqual(['query', 'brand'])
    })

    test('ignores segments not in keys', () => {
      const result = parseSegments(
        ['brand'],
        ['brand', 'nvidia', 'extra', 'data'],
      )

      expect(result).toEqual({ brand: 'nvidia' })
    })

    test('ignores extra segments at the beginning', () => {
      const result = parseSegments(
        ['brand'],
        ['locale', 'zh-TW', 'brand', 'nvidia'],
      )

      expect(result).toEqual({ brand: 'nvidia' })
    })

    test('handles key in segmentsKeys with odd segments - matches jsdoc example', () => {
      const result = parseSegments(
        ['brand', 'query', 'beta'],
        ['brand', 'nvidia', 'query', 'rtx 5090', 'beta'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
        beta: undefined,
      })
    })
  })

  describe('real-world examples', () => {
    test('parses e-commerce filter path', () => {
      const result = parseSegments(
        ['category', 'brand', 'page'],
        ['zh-TW', 'mall', 'category', 'gpu', 'brand', 'nvidia', 'page', '1'],
      )

      expect(result).toEqual({
        category: 'gpu',
        brand: 'nvidia',
        page: '1',
      })
    })

    test('parses search page path', () => {
      const result = parseSegments(
        ['query', 'sort', 'order'],
        ['search', 'query', 'rtx 5090', 'sort', 'price', 'order', 'asc'],
      )

      expect(result).toEqual({
        query: 'rtx 5090',
        sort: 'price',
        order: 'asc',
      })
    })

    test('handles partial filtering case', () => {
      const result = parseSegments(
        ['category', 'brand', 'price', 'inStock'],
        ['zh-TW', 'products', 'category', 'gpu', 'brand', 'nvidia'],
      )

      expect(result).toEqual({
        category: 'gpu',
        brand: 'nvidia',
        price: undefined,
        inStock: undefined,
      })
    })
  })

  describe('handling empty inputs and missing values', () => {
    test('returns empty object when keys is empty array', () => {
      const result = parseSegments([], ['brand', 'nvidia'])

      expect(result).toEqual({})
    })

    test('returns empty object when both are empty arrays', () => {
      const result = parseSegments([], [])

      expect(result).toEqual({})
    })

    test('returns undefined when key does not exist in segments', () => {
      const result = parseSegments(['brand', 'query'], ['brand', 'nvidia'])

      expect(result).toEqual({
        brand: 'nvidia',
        query: undefined,
      })
    })

    test('returns undefined when key exists but has no matching value', () => {
      const result = parseSegments(
        ['brand', 'query'],
        ['brand', 'nvidia', 'query'],
      )

      expect(result).toEqual({
        brand: 'nvidia',
        query: undefined,
      })
    })

    test('returns undefined when segment has only a single key', () => {
      const result = parseSegments(['brand'], ['brand'])

      expect(result).toEqual({ brand: undefined })
    })

    test('returns undefined for all keys when segments is empty array', () => {
      const result = parseSegments(['brand', 'query', 'sort'], [])

      expect(result).toEqual({
        brand: undefined,
        query: undefined,
        sort: undefined,
      })
    })
  })

  describe('handling special characters and values', () => {
    test('handles values containing spaces', () => {
      const result = parseSegments(['query'], ['query', 'rtx 5090'])

      expect(result).toEqual({ query: 'rtx 5090' })
    })

    test('handles values containing Chinese characters', () => {
      const result = parseSegments(['brand'], ['brand', '英偉達'])

      expect(result).toEqual({ brand: '英偉達' })
    })

    test('handles values containing special symbols', () => {
      const result = parseSegments(
        ['query'],
        ['query', 'nvidia-rtx-5090 (new)'],
      )

      expect(result).toEqual({ query: 'nvidia-rtx-5090 (new)' })
    })

    test('handles empty string values', () => {
      const result = parseSegments(['brand'], ['brand', ''])

      expect(result).toEqual({ brand: '' })
    })

    test('handles segments containing numbers', () => {
      const result = parseSegments(
        ['page', 'limit'],
        ['page', '5', 'limit', '20'],
      )

      expect(result).toEqual({
        page: '5',
        limit: '20',
      })
    })
  })

  describe('URL encoding handling', () => {
    test('decodes URL encoded Chinese characters', () => {
      const result = parseSegments(
        ['query'],
        ['query', '%E5%88%A9%E7%8E%87%E6%B1%BA%E8%AD%B0'],
      )

      expect(result).toEqual({ query: '利率決議' })
    })

    test('decodes URL encoded characters with spaces', () => {
      const result = parseSegments(
        ['query'],
        [
          'query',
          '%E5%88%A9%E7%8E%87%E6%B1%BA%E8%AD%B0%20%E7%BE%8E%E8%81%AF%E5%84%B2',
        ],
      )

      expect(result).toEqual({ query: '利率決議 美聯儲' })
    })

    test('decodes space encoded as %20', () => {
      const result = parseSegments(['query'], ['query', 'rtx%205090'])

      expect(result).toEqual({ query: 'rtx 5090' })
    })

    test('decodes percent sign itself (%25)', () => {
      const result = parseSegments(['discount'], ['discount', '50%25'])

      expect(result).toEqual({ discount: '50%' })
    })

    test('decodes multiple encoded values', () => {
      const result = parseSegments(
        ['brand', 'query'],
        ['brand', '%E8%8B%B1%E5%81%89%E9%81%94', 'query', 'rtx%205090'],
      )

      expect(result).toEqual({
        brand: '英偉達',
        query: 'rtx 5090',
      })
    })

    test('handles already decoded values (no double decoding)', () => {
      const result = parseSegments(['query'], ['query', '利率決議'])

      expect(result).toEqual({ query: '利率決議' })
    })

    test('handles + symbol (does not convert to space)', () => {
      const result = parseSegments(['query'], ['query', 'rtx+5090'])

      // decodeURIComponent does not convert + to space in path segments
      expect(result).toEqual({ query: 'rtx+5090' })
    })

    test('throws error for invalid URL encoding', () => {
      expect(() => {
        parseSegments(['query'], ['query', '%'])
      }).toThrow()
    })

    test('throws error for malformed percent encoding', () => {
      expect(() => {
        parseSegments(['query'], ['query', '%E5%88%A9%E7%8E%'])
      }).toThrow()
    })
  })

  describe('edge cases', () => {
    test('handles duplicate keys by taking the first occurrence value', () => {
      const result = parseSegments(
        ['brand'],
        ['brand', 'nvidia', 'other', 'data', 'brand', 'amd'],
      )

      expect(result).toEqual({ brand: 'nvidia' })
    })

    test('handles very long arrays', () => {
      const longSegments = Array.from({ length: 100 }, (_, index) =>
        index % 2 === 0 ? `key${index / 2}` : `value${(index - 1) / 2}`,
      )

      const result = parseSegments(['key0', 'key49'], longSegments)

      expect(result).toEqual({
        key0: 'value0',
        key49: 'value49',
      })
    })
  })

  describe('type inference validation', () => {
    test('returns type structure matching keys', () => {
      const result = parseSegments(['brand', 'query'] as const, [
        'brand',
        'nvidia',
        'query',
        'rtx 5090',
      ])

      expect('brand' in result).toBe(true)
      expect('query' in result).toBe(true)
      expect(result.brand).toBe('nvidia')
      expect(result.query).toBe('rtx 5090')
    })

    test('correctly handles readonly arrays', () => {
      const keys = ['brand', 'query'] as const
      const segments: readonly string[] = [
        'brand',
        'nvidia',
        'query',
        'rtx 5090',
      ]

      const result = parseSegments(keys, segments as string[])

      expect(result).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })
  })
})
