import { describe, test, expect } from 'vitest'
import { rebuildPathname } from './rebuildPathname'

describe('rebuildPathname', () => {
  describe('basic functionality', () => {
    test('updates with new parameters', () => {
      const result = rebuildPathname('/mall/brand/nvidia', ['brand', 'query'], {
        brand: 'nvidia',
        query: 'rtx 5090',
      })

      expect(result).toBe('/mall/brand/nvidia/query/rtx%205090')
    })

    test('updates a single parameter', () => {
      const result = rebuildPathname('/zh-TW/mall/brand/nvidia', ['brand'], {
        brand: 'amd',
      })

      expect(result).toBe('/zh-TW/mall/brand/amd')
    })

    test('updates multiple parameters', () => {
      const result = rebuildPathname(
        '/zh-TW/mall/brand/nvidia/query/rtx 5090',
        ['brand', 'query'],
        { brand: 'amd', query: 'rx 7900 xtx' },
      )

      expect(result).toBe('/zh-TW/mall/brand/amd/query/rx%207900%20xtx')
    })

    test('maintains parameter order', () => {
      const result = rebuildPathname(
        '/brand/nvidia/category/gpu/query/rtx',
        ['brand', 'category', 'query'],
        { brand: 'amd', category: 'cpu', query: 'ryzen' },
      )

      expect(result).toBe('/brand/amd/category/cpu/query/ryzen')
    })
  })

  describe('preserving unmanaged segments', () => {
    test('preserves unmanaged segments at the beginning', () => {
      const result = rebuildPathname('/zh-TW/mall/brand/nvidia', ['brand'], {
        brand: 'amd',
      })

      expect(result).toBe('/zh-TW/mall/brand/amd')
    })

    test('preserves unmanaged segments in the middle', () => {
      const result = rebuildPathname(
        '/brand/nvidia/page/1/sort/price',
        ['brand', 'sort'],
        { brand: 'amd', sort: 'name' },
      )

      expect(result).toBe('/brand/amd/page/1/sort/name')
    })

    test('preserves unmanaged segments at the end', () => {
      const result = rebuildPathname('/brand/nvidia/extra/data', ['brand'], {
        brand: 'amd',
      })

      expect(result).toBe('/brand/amd/extra/data')
    })

    test('preserves multiple scattered unmanaged segments', () => {
      const result = rebuildPathname('/a/b/c/d/e/f', ['b', 'e'], {
        b: 'B',
        e: 'E',
      })

      // 'a', 'c', 'd', 'f' are not managed keys, so they remain as-is
      // But 'c', 'd', 'f' are treated as values of b and e, so they are actually skipped
      expect(result).toBe('/a/b/B/d/e/E')
    })
  })

  describe('handling undefined values', () => {
    test('removes parameter pairs with undefined values', () => {
      const result = rebuildPathname(
        '/brand/nvidia/query/rtx',
        ['brand', 'query'],
        { brand: 'amd', query: undefined },
      )

      expect(result).toBe('/brand/amd')
    })

    test('removes multiple undefined parameters', () => {
      const result = rebuildPathname(
        '/brand/nvidia/query/rtx/sort/price',
        ['brand', 'query', 'sort'],
        { brand: undefined, query: undefined, sort: 'name' },
      )

      expect(result).toBe('/sort/name')
    })

    test('preserves unmanaged segments when removing', () => {
      const result = rebuildPathname(
        '/zh-TW/mall/brand/nvidia/page/1',
        ['brand'],
        { brand: undefined },
      )

      expect(result).toBe('/zh-TW/mall/page/1')
    })

    test('handles all undefined values', () => {
      const result = rebuildPathname(
        '/brand/nvidia/query/rtx',
        ['brand', 'query'],
        { brand: undefined, query: undefined },
      )

      expect(result).toBe('/')
    })
  })

  describe('handling missing keys', () => {
    test('removes keys not provided in params', () => {
      const result = rebuildPathname(
        '/brand/nvidia/query/rtx',
        ['brand', 'query'],
        { brand: 'amd' }, // query not provided, will be removed
      )

      // Keys in segmentsKeys but missing in params are removed
      expect(result).toBe('/brand/amd')
    })

    test('handles partially missing keys', () => {
      const result = rebuildPathname(
        '/brand/nvidia/query/rtx/sort/price',
        ['brand', 'query', 'sort'],
        { sort: 'name' }, // brand and query not provided
      )

      // brand and query don't exist in params, will be removed
      expect(result).toBe('/sort/name')
    })
  })

  describe('handling URL encoding', () => {
    test('encodes values containing spaces', () => {
      const result = rebuildPathname('/query/rtx', ['query'], {
        query: 'rtx 5090',
      })

      expect(result).toBe('/query/rtx%205090')
    })

    test('encodes special characters', () => {
      const result = rebuildPathname('/query/test', ['query'], {
        query: '中文測試',
      })

      expect(result).toBe('/query/%E4%B8%AD%E6%96%87%E6%B8%AC%E8%A9%A6')
    })

    test('encodes percent signs', () => {
      const result = rebuildPathname('/discount/10', ['discount'], {
        discount: '50%',
      })

      expect(result).toBe('/discount/50%25')
    })

    test('encodes slashes', () => {
      const result = rebuildPathname('/path/test', ['path'], { path: 'a/b/c' })

      expect(result).toBe('/path/a%2Fb%2Fc')
    })

    test('maintains already-encoded unmanaged segments', () => {
      const result = rebuildPathname(
        '/locale/zh-TW/query/rtx%205090',
        ['query'],
        { query: 'rx 7900 xtx' },
      )

      // locale and its value should remain as-is (not re-encoded)
      expect(result).toBe('/locale/zh-TW/query/rx%207900%20xtx')
    })
  })

  describe('edge cases', () => {
    test('handles empty pathname', () => {
      const result = rebuildPathname('/', ['brand'], { brand: 'nvidia' })

      expect(result).toBe('/brand/nvidia')
    })

    test('handles empty keys array', () => {
      const result = rebuildPathname('/brand/nvidia', [], {})

      expect(result).toBe('/brand/nvidia')
    })

    test('handles empty params object', () => {
      const result = rebuildPathname(
        '/brand/nvidia/query/rtx',
        ['brand', 'query'],
        {},
      )

      // Empty params object, all keys have no provided values, will be removed
      expect(result).toBe('/')
    })

    test('handles case with only unmanaged segments', () => {
      const result = rebuildPathname(
        '/zh-TW/mall/products',
        ['brand'], // brand doesn't exist in segments
        { brand: 'nvidia' },
      )

      expect(result).toBe('/zh-TW/mall/products/brand/nvidia')
    })

    test('handles key not existing in segments', () => {
      const result = rebuildPathname(
        '/brand/nvidia',
        ['brand', 'query'], // query not in segments
        { brand: 'amd', query: 'rtx' },
      )

      // query will be added at the end
      expect(result).toBe('/brand/amd/query/rtx')
    })

    test('handles odd number of segments (last key has no value)', () => {
      const result = rebuildPathname('/brand/nvidia/query', ['brand'], {
        brand: 'amd',
      })

      expect(result).toBe('/brand/amd/query')
    })
  })

  describe('real-world examples', () => {
    test('handles e-commerce filter updates', () => {
      const result = rebuildPathname(
        '/zh-TW/mall/category/gpu/brand/nvidia/page/1',
        ['category', 'brand', 'page'],
        { category: 'cpu', brand: 'amd', page: '2' },
      )

      expect(result).toBe('/zh-TW/mall/category/cpu/brand/amd/page/2')
    })

    test('handles search query updates', () => {
      const result = rebuildPathname(
        '/search/query/rtx 4090/sort/price/order/asc',
        ['query', 'sort', 'order'],
        { query: 'rx 7900 xtx', sort: 'rating', order: 'desc' },
      )

      expect(result).toBe(
        '/search/query/rx%207900%20xtx/sort/rating/order/desc',
      )
    })

    test('handles filter clearing (set to undefined)', () => {
      const result = rebuildPathname(
        '/zh-TW/products/category/gpu/brand/nvidia/price/1000',
        ['category', 'brand', 'price'],
        { category: 'gpu', brand: undefined, price: undefined },
      )

      expect(result).toBe('/zh-TW/products/category/gpu')
    })

    test('handles pagination navigation', () => {
      const result = rebuildPathname('/zh-TW/products/page/1', ['page'], {
        page: '5',
      })

      expect(result).toBe('/zh-TW/products/page/5')
    })
  })

  describe('complex scenarios', () => {
    test('handles multiple updates to the same path', () => {
      const keys = ['brand', 'query']

      // First update
      let pathname = rebuildPathname('/brand/nvidia/query/rtx', keys, {
        brand: 'amd',
        query: 'rx 7900',
      })
      expect(pathname).toBe('/brand/amd/query/rx%207900')

      // Second update (using first result)
      pathname = rebuildPathname(pathname, keys, {
        brand: 'intel',
        query: undefined,
      })
      expect(pathname).toBe('/brand/intel')
    })

    test('handles very long paths', () => {
      const pathname =
        '/locale/zh-TW/store/mall/category/electronics/subcategory/gpu/brand/nvidia/series/rtx-40/model/rtx-4090/page/1'
      const keys = ['category', 'brand', 'page']

      const result = rebuildPathname(pathname, keys, {
        category: 'components',
        brand: 'amd',
        page: '3',
      })

      expect(result).toBe(
        '/locale/zh-TW/store/mall/category/components/subcategory/gpu/brand/amd/series/rtx-40/model/rtx-4090/page/3',
      )
    })
  })

  describe('type safety (runtime checks)', () => {
    test('handles numeric type values', () => {
      const result = rebuildPathname('/page/1', ['page'], {
        page: '5', // Always string
      })

      expect(result).toBe('/page/5')
    })

    test('handles empty string values (treats as removal)', () => {
      const result = rebuildPathname('/brand/nvidia', ['brand'], {
        brand: '',
      })

      expect(result).toBe('/')
    })

    test('handles values with only spaces', () => {
      const result = rebuildPathname('/brand/nvidia', ['brand'], {
        brand: '   ',
      })

      expect(result).toBe('/brand/%20%20%20')
    })
  })
})
