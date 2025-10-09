import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSegments } from './useSegments'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockPathname = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => mockPathname(),
}))

describe('useSegments', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockReplace.mockClear()
    mockPathname.mockReset()
  })

  describe('core functionality', () => {
    test('parses initial params correctly', () => {
      mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      expect(result.current.params).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })
    })

    test('returns all necessary methods', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      expect(typeof result.current.setParams).toBe('function')
      expect(typeof result.current.replaceUrl).toBe('function')
      expect(typeof result.current.pushUrl).toBe('function')
    })

    test('handles e-commerce filtering scenario', () => {
      mockPathname.mockReturnValue(
        '/zh-TW/mall/category/gpu/brand/nvidia/page/1',
      )

      const { result } = renderHook(() =>
        useSegments(['category', 'brand', 'page'] as const),
      )

      expect(result.current.params).toEqual({
        category: 'gpu',
        brand: 'nvidia',
        page: '1',
      })

      // Update filters
      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          category: 'cpu',
          brand: 'amd',
          page: '1',
        }))
        result.current.replaceUrl()
      })

      expect(mockReplace).toHaveBeenCalledWith(
        '/zh-TW/mall/category/cpu/brand/amd/page/1',
      )

      // Change page
      act(() => {
        result.current.setParams((prev) => ({ ...prev, page: '2' }))
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith(
        '/zh-TW/mall/category/cpu/brand/amd/page/2',
      )
    })

    test('handles search query scenario', () => {
      mockPathname.mockReturnValue(
        '/search/query/rtx 5090/sort/price/order/asc',
      )

      const { result } = renderHook(() =>
        useSegments(['query', 'sort', 'order'] as const),
      )

      expect(result.current.params).toEqual({
        query: 'rtx 5090',
        sort: 'price',
        order: 'asc',
      })

      // Update search query
      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          query: 'rx 7900 xtx',
        }))
        result.current.replaceUrl()
      })

      expect(mockReplace).toHaveBeenCalledWith(
        '/search/query/rx%207900%20xtx/sort/price/order/asc',
      )

      // Change sorting
      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          sort: 'rating',
          order: 'desc',
        }))
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith(
        '/search/query/rx%207900%20xtx/sort/rating/order/desc',
      )
    })
  })

  describe('setParams functionality', () => {
    test('updates a single parameter', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
      })

      expect(result.current.params).toEqual({ brand: 'amd' })
    })

    test('updates multiple parameters', () => {
      mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          brand: 'amd',
          query: 'rx 7900 xtx',
        }))
      })

      expect(result.current.params).toEqual({
        brand: 'amd',
        query: 'rx 7900 xtx',
      })
    })

    test('supports functional updates', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          brand: (prev.brand || '') + '-updated',
        }))
      })

      expect(result.current.params).toEqual({ brand: 'nvidia-updated' })
    })

    test('handles undefined values to remove parameters', () => {
      mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          brand: 'amd',
          query: undefined,
        }))
      })

      expect(result.current.params).toEqual({
        brand: 'amd',
        query: undefined,
      })
    })

    test('does not trigger URL update', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
      })

      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    test('multiple calls retain only the last state', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
        result.current.setParams((prev) => ({ ...prev, brand: 'intel' }))
        result.current.setParams((prev) => ({ ...prev, brand: 'qualcomm' }))
      })

      expect(result.current.params).toEqual({ brand: 'qualcomm' })
    })
  })

  describe('URL navigation', () => {
    describe('replaceUrl', () => {
      test('calls router.replace to update URL', () => {
        mockPathname.mockReturnValue('/brand/nvidia')

        const { result } = renderHook(() => useSegments(['brand'] as const))

        act(() => {
          result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
          result.current.replaceUrl()
        })

        expect(mockReplace).toHaveBeenCalledWith('/brand/amd')
      })

      test('handles URL update with multiple parameters', () => {
        mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

        const { result } = renderHook(() =>
          useSegments(['brand', 'query'] as const),
        )

        act(() => {
          result.current.setParams((prev) => ({
            ...prev,
            brand: 'amd',
            query: 'rx 7900 xtx',
          }))
          result.current.replaceUrl()
        })

        expect(mockReplace).toHaveBeenCalledWith(
          '/brand/amd/query/rx%207900%20xtx',
        )
      })

      test('handles undefined values to remove parameters', () => {
        mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

        const { result } = renderHook(() =>
          useSegments(['brand', 'query'] as const),
        )

        act(() => {
          result.current.setParams((prev) => ({
            ...prev,
            brand: 'amd',
            query: undefined,
          }))
          result.current.replaceUrl()
        })

        expect(mockReplace).toHaveBeenCalledWith('/brand/amd')
      })

      test('supports URL navigation after functional update', () => {
        mockPathname.mockReturnValue('/brand/nvidia')

        const { result } = renderHook(() => useSegments(['brand'] as const))

        act(() => {
          result.current.setParams((prev) => ({
            ...prev,
            brand: (prev.brand || '') + '-updated',
          }))
          result.current.replaceUrl()
        })

        expect(mockReplace).toHaveBeenCalledWith('/brand/nvidia-updated')
      })
    })

    describe('pushUrl', () => {
      test('calls router.push to add new history entry', () => {
        mockPathname.mockReturnValue('/brand/nvidia')

        const { result } = renderHook(() => useSegments(['brand'] as const))

        act(() => {
          result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
          result.current.pushUrl()
        })

        expect(mockPush).toHaveBeenCalledWith('/brand/amd')
      })

      test('handles URL update with multiple parameters', () => {
        mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

        const { result } = renderHook(() =>
          useSegments(['brand', 'query'] as const),
        )

        act(() => {
          result.current.setParams((prev) => ({
            ...prev,
            brand: 'amd',
            query: 'rx 7900 xtx',
          }))
          result.current.pushUrl()
        })

        expect(mockPush).toHaveBeenCalledWith(
          '/brand/amd/query/rx%207900%20xtx',
        )
      })

      test('supports URL navigation after functional update', () => {
        mockPathname.mockReturnValue('/brand/nvidia')

        const { result } = renderHook(() => useSegments(['brand'] as const))

        act(() => {
          result.current.setParams((prev) => ({
            ...prev,
            brand: (prev.brand || '') + '-updated',
          }))
          result.current.pushUrl()
        })

        expect(mockPush).toHaveBeenCalledWith('/brand/nvidia-updated')
      })
    })
  })

  describe('pathname auto-sync', () => {
    test('automatically updates a single param when pathname changes', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result, rerender } = renderHook(() =>
        useSegments(['brand'] as const),
      )

      expect(result.current.params).toEqual({ brand: 'nvidia' })

      // Simulate pathname change
      mockPathname.mockReturnValue('/brand/amd')
      rerender()

      expect(result.current.params).toEqual({ brand: 'amd' })
    })

    test('automatically updates multiple params when pathname changes', () => {
      mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

      const { result, rerender } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      expect(result.current.params).toEqual({
        brand: 'nvidia',
        query: 'rtx 5090',
      })

      // Simulate pathname change
      mockPathname.mockReturnValue('/brand/amd/query/rx 7900 xtx')
      rerender()

      expect(result.current.params).toEqual({
        brand: 'amd',
        query: 'rx 7900 xtx',
      })
    })
  })

  describe('unmanaged segments', () => {
    test('preserves unmanaged segments in pathname', () => {
      mockPathname.mockReturnValue('/zh-TW/mall/brand/nvidia/page/1')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
        result.current.replaceUrl()
      })

      expect(mockReplace).toHaveBeenCalledWith('/zh-TW/mall/brand/amd/page/1')
    })

    test('preserves unmanaged segments across multiple updates', () => {
      mockPathname.mockReturnValue('/locale/zh-TW/brand/nvidia/sort/price')

      const { result } = renderHook(() =>
        useSegments(['brand', 'sort'] as const),
      )

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
        result.current.replaceUrl()
      })

      expect(mockReplace).toHaveBeenCalledWith(
        '/locale/zh-TW/brand/amd/sort/price',
      )

      // Second update
      act(() => {
        result.current.setParams((prev) => ({ ...prev, sort: 'name' }))
        result.current.replaceUrl()
      })

      // Note: pathname hasn't actually changed, so it's still based on the original pathname
      expect(mockReplace).toHaveBeenCalledWith(
        '/locale/zh-TW/brand/amd/sort/name',
      )
    })
  })

  describe('edge cases and error handling', () => {
    test('handles empty pathname', () => {
      mockPathname.mockReturnValue('/')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      expect(result.current.params).toEqual({
        brand: undefined,
        query: undefined,
      })
    })

    test('handles keys not present in pathname', () => {
      mockPathname.mockReturnValue('/other/data')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      expect(result.current.params).toEqual({
        brand: undefined,
        query: undefined,
      })
    })

    test('handles URL-encoded pathname', () => {
      mockPathname.mockReturnValue('/query/rtx%205090')

      const { result } = renderHook(() => useSegments(['query'] as const))

      expect(result.current.params).toEqual({ query: 'rtx 5090' })
    })

    test('handles pathname with Chinese characters', () => {
      mockPathname.mockReturnValue('/brand/%E8%8B%B1%E5%81%89%E9%81%94')

      const { result } = renderHook(() => useSegments(['brand'] as const))

      expect(result.current.params).toEqual({ brand: '英偉達' })
    })

    test('handles very long pathname', () => {
      const longPathname =
        '/a/1/b/2/c/3/d/4/e/5/f/6/g/7/h/8/i/9/j/10/brand/nvidia'

      mockPathname.mockReturnValue(longPathname)

      const { result } = renderHook(() => useSegments(['brand'] as const))

      expect(result.current.params).toEqual({ brand: 'nvidia' })
    })

    test('function references remain stable (useCallback)', () => {
      mockPathname.mockReturnValue('/brand/nvidia')

      const { result, rerender } = renderHook(() =>
        useSegments(['brand'] as const),
      )

      const firstSetParams = result.current.setParams

      rerender()

      // setParams should remain stable as it has no dependencies
      expect(result.current.setParams).toBe(firstSetParams)

      // replaceUrl and pushUrl stability depends on pathname, keysDep, router
      // In the test environment, router may not be stable, so we only check setParams
      // In actual usage, pathname and router come from Next.js hooks, and references are usually stable
    })
  })

  describe('type inference (runtime verification)', () => {
    test('params contain all keys', () => {
      mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      expect('brand' in result.current.params).toBe(true)
      expect('query' in result.current.params).toBe(true)
    })

    test('setParams accepts partial parameters', () => {
      mockPathname.mockReturnValue('/brand/nvidia/query/rtx 5090')

      const { result } = renderHook(() =>
        useSegments(['brand', 'query'] as const),
      )

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
      })

      expect(result.current.params).toEqual({
        brand: 'amd',
        query: 'rtx 5090',
      })
    })
  })
})
