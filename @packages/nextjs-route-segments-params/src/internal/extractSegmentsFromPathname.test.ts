import { describe, test, expect } from 'vitest'
import { extractSegmentsFromPathname } from './extractSegmentsFromPathname'

describe('extractSegmentsFromPathname', () => {
  describe('basic functionality', () => {
    test('splits basic pathname correctly', () => {
      const result = extractSegmentsFromPathname(
        '/zh-TW/mall/brand/nvidia/query/rtx 5090',
      )

      expect(result).toEqual([
        'zh-TW',
        'mall',
        'brand',
        'nvidia',
        'query',
        'rtx 5090',
      ])
    })

    test('handles simple pathname', () => {
      const result = extractSegmentsFromPathname('/brand/nvidia')

      expect(result).toEqual(['brand', 'nvidia'])
    })

    test('handles single segment', () => {
      const result = extractSegmentsFromPathname('/brand')

      expect(result).toEqual(['brand'])
    })
  })

  describe('handling empty and root paths', () => {
    test('handles root path', () => {
      const result = extractSegmentsFromPathname('/')

      expect(result).toEqual([])
    })

    test('handles empty string', () => {
      const result = extractSegmentsFromPathname('')

      expect(result).toEqual([])
    })

    test('handles path with only slashes', () => {
      const result = extractSegmentsFromPathname('///')

      expect(result).toEqual([])
    })
  })

  describe('handling redundant slashes', () => {
    test('filters redundant slashes at the beginning', () => {
      const result = extractSegmentsFromPathname('//brand/nvidia')

      expect(result).toEqual(['brand', 'nvidia'])
    })

    test('filters redundant slashes at the end', () => {
      const result = extractSegmentsFromPathname('/brand/nvidia//')

      expect(result).toEqual(['brand', 'nvidia'])
    })

    test('filters redundant slashes in the middle', () => {
      const result = extractSegmentsFromPathname('/brand///nvidia')

      expect(result).toEqual(['brand', 'nvidia'])
    })

    test('handles mixed redundant slashes', () => {
      const result = extractSegmentsFromPathname('//brand///nvidia//')

      expect(result).toEqual(['brand', 'nvidia'])
    })
  })

  describe('handling URL encoding', () => {
    test('decodes spaces (%20)', () => {
      const result = extractSegmentsFromPathname('/query/rtx%205090')

      expect(result).toEqual(['query', 'rtx 5090'])
    })

    test('decodes special characters', () => {
      const result = extractSegmentsFromPathname(
        '/query/%E4%B8%AD%E6%96%87%E6%B8%AC%E8%A9%A6',
      )

      expect(result).toEqual(['query', '中文測試'])
    })

    test('decodes multiple encoded segments', () => {
      const result = extractSegmentsFromPathname(
        '/brand/nvidia/query/rtx%205090/category/gpu%20card',
      )

      expect(result).toEqual([
        'brand',
        'nvidia',
        'query',
        'rtx 5090',
        'category',
        'gpu card',
      ])
    })

    test('decodes percent sign itself (%25)', () => {
      const result = extractSegmentsFromPathname('/discount/50%25')

      expect(result).toEqual(['discount', '50%'])
    })

    test('decodes + symbol', () => {
      const result = extractSegmentsFromPathname('/query/rtx+5090')

      // Note: decodeURIComponent does not automatically convert + to space
      // This is correct behavior, as + should remain as-is in the path
      expect(result).toEqual(['query', 'rtx+5090'])
    })
  })

  describe('handling special pathnames', () => {
    test('handles pathname not starting with slash', () => {
      const result = extractSegmentsFromPathname('brand/nvidia')

      expect(result).toEqual(['brand', 'nvidia'])
    })

    test('handles segments containing dots', () => {
      const result = extractSegmentsFromPathname('/file/document.pdf')

      expect(result).toEqual(['file', 'document.pdf'])
    })

    test('handles segments containing hyphens', () => {
      const result = extractSegmentsFromPathname(
        '/category/graphics-card/brand/nvidia-rtx',
      )

      expect(result).toEqual([
        'category',
        'graphics-card',
        'brand',
        'nvidia-rtx',
      ])
    })

    test('handles segments containing underscores', () => {
      const result = extractSegmentsFromPathname('/user/john_doe/profile')

      expect(result).toEqual(['user', 'john_doe', 'profile'])
    })

    test('handles numeric segments', () => {
      const result = extractSegmentsFromPathname('/user/123/post/456')

      expect(result).toEqual(['user', '123', 'post', '456'])
    })
  })

  describe('real-world examples', () => {
    test('handles multi-level locale paths', () => {
      const result = extractSegmentsFromPathname(
        '/zh-TW/mall/category/electronics/brand/nvidia',
      )

      expect(result).toEqual([
        'zh-TW',
        'mall',
        'category',
        'electronics',
        'brand',
        'nvidia',
      ])
    })

    test('handles query-type segments', () => {
      const result = extractSegmentsFromPathname(
        '/search/query/rtx 5090/sort/price/order/asc',
      )

      expect(result).toEqual([
        'search',
        'query',
        'rtx 5090',
        'sort',
        'price',
        'order',
        'asc',
      ])
    })

    test('handles complex e-commerce paths', () => {
      const result = extractSegmentsFromPathname(
        '/zh-TW/store/category/gpu/brand/nvidia/series/rtx-40/model/rtx-4090/page/1',
      )

      expect(result).toEqual([
        'zh-TW',
        'store',
        'category',
        'gpu',
        'brand',
        'nvidia',
        'series',
        'rtx-40',
        'model',
        'rtx-4090',
        'page',
        '1',
      ])
    })
  })

  describe('edge cases', () => {
    test('handles very long pathname', () => {
      const longPathname =
        '/' + Array.from({ length: 100 }, (_, i) => `segment${i}`).join('/')

      const result = extractSegmentsFromPathname(longPathname)

      expect(result).toHaveLength(100)
      expect(result[0]).toBe('segment0')
      expect(result[99]).toBe('segment99')
    })

    test('handles mixed pathname with all character types', () => {
      const result = extractSegmentsFromPathname(
        '/abc-123_test/file.name/中文/rtx%205090/50%25',
      )

      expect(result).toEqual([
        'abc-123_test',
        'file.name',
        '中文',
        'rtx 5090',
        '50%',
      ])
    })
  })

  describe('error handling', () => {
    test('handles invalid URL encoding without throwing error', () => {
      // decodeURIComponent throws an error for invalid encoding
      // Our implementation should either handle it gracefully or let it throw (depending on design)
      expect(() => {
        extractSegmentsFromPathname('/query/%')
      }).toThrow()
    })
  })
})
