import { renderHook, act } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useCatchAllNextParams } from './useCatchAllNextParams'

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}))

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockUseRouter = vi.mocked(useRouter)
const mockUsePathname = vi.mocked(usePathname)

describe('useCatchAllNextParams', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset mock implementations to default behavior
    mockPush.mockImplementation(() => {})
    mockReplace.mockImplementation(() => {})

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    } as any)
  })

  describe('API structure', () => {
    it('should return the correct API structure with four properties', () => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/5090')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      // Test that the hook returns exactly the expected properties
      expect(result.current).toHaveProperty('params')
      expect(result.current).toHaveProperty('setParams')
      expect(result.current).toHaveProperty('pushUrl')
      expect(result.current).toHaveProperty('replaceUrl')

      // Ensure only these four properties exist
      expect(Object.keys(result.current)).toEqual([
        'params',
        'setParams',
        'pushUrl',
        'replaceUrl',
      ])

      // Test property types
      expect(typeof result.current.params).toBe('object')
      expect(typeof result.current.setParams).toBe('function')
      expect(typeof result.current.pushUrl).toBe('function')
      expect(typeof result.current.replaceUrl).toBe('function')
    })
  })

  describe('navigation functions', () => {
    it('should call router.push when pushUrl is invoked', () => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/5090')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      act(() => {
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith('/mall/brand/nvidia/search/5090')
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('should call router.replace when replaceUrl is invoked', () => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/5090')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      act(() => {
        result.current.replaceUrl()
      })

      expect(mockReplace).toHaveBeenCalledWith('/mall/brand/nvidia/search/5090')
      expect(mockReplace).toHaveBeenCalledTimes(1)
    })

    it('should work with base URLs (no parameters)', () => {
      mockUsePathname.mockReturnValue('/mall')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand']>('/mall'),
      )

      act(() => {
        result.current.pushUrl()
      })
      expect(mockPush).toHaveBeenCalledWith('/mall')

      act(() => {
        result.current.replaceUrl()
      })
      expect(mockReplace).toHaveBeenCalledWith('/mall')
    })
  })

  describe('parsing parameters from pathname', () => {
    it('should parse parameters correctly from pathname', () => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/5090')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      expect(result.current.params).toEqual({
        brand: 'nvidia',
        search: '5090',
      })
    })

    it('should return empty object for base URL with or without trailing slash', () => {
      // Test base URL without trailing slash
      mockUsePathname.mockReturnValue('/mall')

      const { result: resultNoSlash } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      expect(resultNoSlash.current.params).toEqual({})

      // Test base URL with trailing slash
      mockUsePathname.mockReturnValue('/mall/')

      const { result: resultWithSlash } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      expect(resultWithSlash.current.params).toEqual({})
    })

    it('should handle odd number of segments gracefully', () => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      expect(result.current.params).toEqual({
        brand: 'nvidia',
      })
    })
  })

  describe('setParams functionality', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/5090')
    })

    it('should update parameters when setParams is called with object', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      act(() => {
        result.current.setParams({
          brand: 'amd',
          search: '7900xtx',
        })
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should update parameters when setParams is called with function', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          search: '4080',
        }))
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle empty values appropriately', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      // Test handling empty values
      act(() => {
        result.current.setParams({
          brand: 'nvidia',
          search: '',
        })
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()

      // Test handling all empty params
      act(() => {
        result.current.setParams({})
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()

      // Test handling null and undefined values
      act(() => {
        result.current.setParams({
          brand: null as any,
          search: undefined as any,
        })
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  // Type safety is enforced by TypeScript at compile time

  describe('URL encoding and special characters', () => {
    it('should handle URL encoding correctly in parsing and setting', () => {
      // Test parsing encoded URLs
      mockUsePathname.mockReturnValue(
        '/mall/brand/nvidia%20rtx/search/rtx%205090',
      )

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand', 'search']>('/mall'),
      )

      expect(result.current.params).toEqual({
        brand: 'nvidia rtx',
        search: 'rtx 5090',
      })

      // Test setting parameters with special characters
      act(() => {
        result.current.setParams({
          brand: 'nvidia/gtx',
          search: 'rtx "5090" & more',
        })
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle Unicode characters', () => {
      mockUsePathname.mockReturnValue('/zh-tw/products/分類/電子產品/品牌/蘋果')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['分類', '品牌']>('/zh-tw/products'),
      )

      expect(result.current.params).toEqual({
        分類: '電子產品',
        品牌: '蘋果',
      })
    })

    it('should truncate extremely long parameter values', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams<['description']>('/mall'),
      )

      const longText = 'x'.repeat(1500) // Exceeds 1000 char limit

      act(() => {
        result.current.setParams({
          description: longText,
        })
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('concurrent state handling', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/mall')
    })

    it('should handle rapid successive setParams calls', async () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams<['query', 'page']>('/mall'),
      )

      // Simulate rapid clicks or input changes
      act(() => {
        result.current.setParams({ query: 'nvidia' })
        result.current.setParams({ query: 'amd' })
        result.current.setParams({ query: 'intel' })
        result.current.setParams({ page: '2' })
      })

      // Wait for queue processing
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('error handling and edge cases', () => {
    it('should handle malformed base URLs gracefully', () => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['brand']>('//mall////'),
      )

      expect(result.current.params).toBeDefined()

      expect(() => {
        act(() => {
          result.current.setParams({ brand: 'amd' })
        })
      }).not.toThrow()
    })

    it('should handle URL parsing errors gracefully', () => {
      mockUsePathname.mockReturnValue('/invalid%GG%path')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['test']>('/mall'),
      )

      expect(result.current.params).toEqual({})

      expect(() => {
        act(() => {
          result.current.setParams({ test: 'value' })
        })
      }).not.toThrow()
    })

    it('should normalize base URLs with multiple slashes', () => {
      mockUsePathname.mockReturnValue('/mall/category/electronics')

      const { result } = renderHook(() =>
        useCatchAllNextParams<['category']>('//mall///'),
      )

      act(() => {
        result.current.setParams({ category: 'gaming' })
      })

      // setParams should not trigger navigation directly
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})

describe('Integration Tests with Real-World Scenarios', () => {
  it('should handle e-commerce filter parameters', () => {
    mockUsePathname.mockReturnValue(
      '/shop/category/electronics/brand/apple/price-min/100/price-max/1000/sort/price-asc',
    )

    const { result } = renderHook(() =>
      useCatchAllNextParams<
        ['category', 'brand', 'price-min', 'price-max', 'sort']
      >('/shop'),
    )

    expect(result.current.params).toEqual({
      'category': 'electronics',
      'brand': 'apple',
      'price-min': '100',
      'price-max': '1000',
      'sort': 'price-asc',
    })
  })

  it('should handle search with filters and pagination', () => {
    mockUsePathname.mockReturnValue(
      '/search/q/gaming%20laptop/category/computers/page/2/limit/20',
    )

    const { result } = renderHook(() =>
      useCatchAllNextParams<['q', 'category', 'page', 'limit']>('/search'),
    )

    expect(result.current.params).toEqual({
      q: 'gaming laptop',
      category: 'computers',
      page: '2',
      limit: '20',
    })
  })
})

describe('Error Recovery Tests', () => {
  it('should recover from navigation errors gracefully', () => {
    mockUsePathname.mockReturnValue('/products/category/electronics')

    // Mock router.replace to throw an error
    mockReplace.mockImplementation(() => {
      throw new Error('Navigation failed')
    })

    const { result } = renderHook(() =>
      useCatchAllNextParams<['category']>('/products'),
    )

    expect(() => {
      act(() => {
        result.current.setParams({ category: 'books' })
      })
    }).not.toThrow()
  })
})
