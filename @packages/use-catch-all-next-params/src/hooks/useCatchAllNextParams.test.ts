import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

// 🎮 Mock Next.js hooks for testing
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/mall/brand/nvidia/search/rtx-4090'),
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
}))

const { useCatchAllNextParams } = await import('./useCatchAllNextParams')

describe('🎯 useCatchAllNextParams Hook', () => {
  let mockUsePathname: any

  beforeEach(async () => {
    // Get the mocked modules
    const navigation = await import('next/navigation')
    mockUsePathname = vi.mocked(navigation.usePathname)

    // 🧹 Reset mocks
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  // ============================================================================
  // 🚀 CORE FUNCTIONAL TESTS - Primary Business Logic (優先進行功能性測試)
  // ============================================================================

  describe('🎯 URL Parsing and Initialization', () => {
    beforeEach(() => {
      // 🧹 Reset mock to default URL before each test
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/rtx-4090')
    })

    it('should initialize with correct params from current URL', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Verify initial state from mocked URL
      expect(result.current.params).toEqual({
        brand: 'nvidia',
        search: 'rtx-4090',
      })
    })

    it('should handle empty parameter paths gracefully', () => {
      // 🎮 Mock URL that matches template exactly (no parameters)
      mockUsePathname.mockReturnValue('/mall')

      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Should return empty params object when no parameters in URL
      expect(result.current.params).toEqual({})
    })

    it('should parse parameters from different URL structures', () => {
      // Test case 1: Single parameter pattern
      mockUsePathname.mockReturnValue('/user/id/user123')
      const { result: singleParamResult } = renderHook(() =>
        useCatchAllNextParams('/user/id/{id}'),
      )
      expect(singleParamResult.current.params).toEqual({ id: 'user123' })

      // Test case 2: Multiple parameters with encoded values
      mockUsePathname.mockReturnValue(
        '/api/version/v1/userId/john%40example.com',
      )
      const { result: multiParamResult } = renderHook(() =>
        useCatchAllNextParams('/api/version/{version}/userId/{userId}'),
      )
      expect(multiParamResult.current.params).toEqual({
        version: 'v1',
        userId: 'john@example.com', // %40 → @
      })

      // Test case 3: Complex multi-parameter pattern
      mockUsePathname.mockReturnValue(
        '/shop/category/electronics/brand/apple/model/macbook%20pro',
      )
      const { result: complexParamResult } = renderHook(() =>
        useCatchAllNextParams(
          '/shop/category/{category}/brand/{brand}/model/{model}',
        ),
      )
      expect(complexParamResult.current.params).toEqual({
        category: 'electronics',
        brand: 'apple',
        model: 'macbook pro', // URL decoding
      })
    })
  })

  describe('🎮 URL Encoding Handling', () => {
    it('should parse URL-encoded parameters correctly', () => {
      // 🎮 Mock URL with encoded characters
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/gtx%205080')

      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Verify URL decoding works correctly
      expect(result.current.params).toEqual({
        brand: 'nvidia',
        search: 'gtx 5080', // Should decode %20 to space
      })
    })

    it('should handle complex URL-encoded parameters', () => {
      // 🎮 Mock URL with various encoded characters
      mockUsePathname.mockReturnValue(
        '/mall/brand/apple%20mac/search/macbook%20pro%2015%22%20%26%20air',
      )

      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Verify complex decoding
      expect(result.current.params).toEqual({
        brand: 'apple mac', // %20 → space
        search: 'macbook pro 15" & air', // %20 → space, %22 → ", %26 → &
      })
    })
  })

  describe('📖 JSDoc Examples and Parameter Management', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/rtx-4090')
      mockPush.mockClear()
      mockReplace.mockClear()
    })

    it('should match Basic Usage example from JSDoc', () => {
      // @example from JSDoc: Basic Usage
      mockUsePathname.mockReturnValue('/search/initial-query')

      const { result } = renderHook(() =>
        useCatchAllNextParams('/search/{query}'),
      )

      // should initialize with query from URL
      expect(result.current.params.query).toBe('initial-query')

      // set params to { query: 'rtx 5080' } as shown in @example
      act(() => {
        result.current.setParams({ query: 'rtx 5080' })
      })

      expect(result.current.params.query).toBe('rtx 5080')

      // navigates the URL to '/search/rtx 5080' when pushUrl() called
      act(() => {
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith('/search/rtx 5080')
    })

    it('should update params with object syntax (replacement mode)', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Replace params (object mode replaces all params as per JSDoc)
      act(() => {
        result.current.setParams({ brand: 'msi' })
      })
      expect(result.current.params.brand).toBe('msi')
      expect(result.current.params.search).toBeUndefined() // Other params removed per JSDoc

      // 🧪 Test: Replace multiple params
      act(() => {
        result.current.setParams({ brand: 'nvidia', search: 'rtx 2080' })
      })
      expect(result.current.params.brand).toBe('nvidia')
      expect(result.current.params.search).toBe('rtx 2080')
    })

    it('should update params with functional syntax (merge mode)', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Functional update pattern
      act(() => {
        result.current.setParams((prev) => ({ ...prev, search: 'rtx 5090' }))
      })
      expect(result.current.params.brand).toBe('nvidia') // Preserved
      expect(result.current.params.search).toBe('rtx 5090') // Updated

      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: 'amd' }))
      })
      expect(result.current.params.brand).toBe('amd') // Updated
      expect(result.current.params.search).toBe('rtx 5090') // Preserved
    })

    it('should handle partial parameter setting with other parameters removed', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Set only search parameter (brand should be removed)
      act(() => {
        result.current.setParams({ search: 'rtx 5090' })
      })
      expect(result.current.params.brand).toBeUndefined()
      expect(result.current.params.search).toBe('rtx 5090')

      // 🧪 Test: Set only brand parameter (search should be removed)
      act(() => {
        result.current.setParams({ brand: 'amd' })
      })
      expect(result.current.params.brand).toBe('amd')
      expect(result.current.params.search).toBeUndefined()
    })

    it('should work with different URL template patterns', () => {
      // 🧪 Single parameter template
      const { result: singleParam } = renderHook(() =>
        useCatchAllNextParams('/user/{id}/profile'),
      )
      expect(typeof singleParam.current.params).toBe('object')

      // 🧪 No parameters template
      const { result: noParams } = renderHook(() =>
        useCatchAllNextParams('/about-us'),
      )
      expect(typeof noParams.current.params).toBe('object')

      // 🧪 Multiple parameters template
      const { result: multiParams } = renderHook(() =>
        useCatchAllNextParams('/api/{version}/users/{userId}/posts/{postId}'),
      )
      expect(typeof multiParams.current.params).toBe('object')
    })
  })

  describe('🗑️ Parameter Removal Handling', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/rtx-4090')
    })

    it('should demonstrate remove both parameters with undefined as in @example', () => {
      mockUsePathname.mockReturnValue('/mall/brand/amd/search/rtx%205090')

      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🚀 remove both parameters as shown in @example:
      // setParams((prev) => ({ ...prev, brand: undefined, search: undefined }))
      act(() => {
        result.current.setParams({
          brand: undefined,
          search: undefined,
        } as any)
      })

      expect(result.current.params.brand).toBeUndefined()
      expect(result.current.params.search).toBeUndefined()

      // now the URL will be '/mall' when pushUrl() called
      act(() => {
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith('/mall')
    })

    it('should demonstrate remove specific parameter with null as in @example', () => {
      mockUsePathname.mockReturnValue('/mall/brand/amd/search/rtx%205090')

      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🚀 remove the specified parameter 'search' as shown in @example:
      // setParams((prev) => ({ ...prev, search: null }))
      act(() => {
        result.current.setParams((prev) => ({ ...prev, search: null }) as any)
      })

      expect(result.current.params.search).toBeUndefined()
      expect(result.current.params.brand).toBe('amd') // should preserve other params
    })

    it('should remove parameters when set to undefined', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Remove brand param using function mode (to preserve search param per JSDoc)
      act(() => {
        result.current.setParams((prev) => ({ ...prev, brand: undefined }))
      })
      expect(result.current.params.brand).toBeUndefined()
      expect(result.current.params.search).toBe('rtx-4090') // Preserved due to function mode
    })

    it('should treat undefined, null, and empty string equivalently for parameter removal', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      const removalValues = [undefined, null, '']
      const testCases = [
        { mode: 'object', description: 'object mode' },
        { mode: 'functional', description: 'functional mode' },
      ]

      testCases.forEach(({ mode }) => {
        removalValues.forEach((value) => {
          if (mode === 'object') {
            // 🧪 Test object mode - replaces all params
            act(() => {
              result.current.setParams({
                brand: 'nvidia',
                search: value,
              } as any)
            })
            expect(result.current.params.brand).toBe('nvidia')
            expect(result.current.params.search).toBeUndefined()
          } else {
            // 🧪 Test functional mode - preserves other params
            act(() => {
              result.current.setParams({ brand: 'nvidia', search: 'rtx-4090' })
            })
            act(() => {
              result.current.setParams(
                (prev) => ({ ...prev, search: value }) as any,
              )
            })
            expect(result.current.params.brand).toBe('nvidia') // Preserved
            expect(result.current.params.search).toBeUndefined()
          }
        })
      })

      // 🧪 Test all removal values result in the same final state
      act(() => {
        result.current.setParams({ brand: '', search: null } as any)
      })
      expect(result.current.params.brand).toBeUndefined()
      expect(result.current.params.search).toBeUndefined()
    })
  })

  describe('🌐 URL Navigation Features', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/mall/brand/nvidia/search/rtx-4090')
      mockPush.mockClear()
      mockReplace.mockClear()
    })

    it('should navigate using router.push and router.replace', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Push navigation
      act(() => {
        result.current.setParams({ brand: 'nvidia', search: 'rtx 2080' })
      })
      act(() => {
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        '/mall/brand/nvidia/search/rtx 2080',
      )

      // 🧪 Test: Replace navigation
      act(() => {
        result.current.setParams((prev) => ({ ...prev, search: 'rtx 5090' }))
      })
      act(() => {
        result.current.replaceUrl()
      })

      expect(mockReplace).toHaveBeenCalledTimes(1)
      expect(mockReplace).toHaveBeenCalledWith(
        '/mall/brand/nvidia/search/rtx 5090',
      )
    })

    it('should handle URL encoding for special characters', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Special characters encoding
      act(() => {
        result.current.setParams({
          brand: 'brand with spaces',
          search: 'search/with/slashes',
        })
      })
      act(() => {
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith(
        '/mall/brand/brand with spaces/search/search/with/slashes',
      )
    })

    it('should handle partial param updates in navigation', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Using function mode to preserve existing params
      act(() => {
        result.current.setParams((prev) => ({
          ...prev,
          brand: 'updated-brand',
        }))
      })
      act(() => {
        result.current.pushUrl()
      })

      expect(mockPush).toHaveBeenCalledWith(
        '/mall/brand/updated-brand/search/rtx-4090',
      )
    })

    it('should work with different parameter combinations', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      const testCases = [
        {
          brand: 'msi',
          search: 'gaming laptop',
          expected: '/mall/brand/msi/search/gaming laptop',
        },
        {
          brand: 'apple',
          search: 'macbook pro',
          expected: '/mall/brand/apple/search/macbook pro',
        },
      ]

      testCases.forEach(({ brand, search, expected }) => {
        act(() => {
          result.current.setParams({ brand, search })
        })
        act(() => {
          result.current.pushUrl()
        })
        expect(mockPush).toHaveBeenCalledWith(expected)
      })
    })

    it('should generate correct URLs for parameter removal scenarios', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Remove all parameters - should navigate to base URL
      act(() => {
        result.current.setParams({ brand: undefined, search: undefined })
      })
      act(() => {
        result.current.pushUrl()
      })
      expect(mockPush).toHaveBeenCalledWith('/mall')

      // 🧪 Test: Only search parameter
      act(() => {
        result.current.setParams({ search: 'rtx 5090' })
      })
      act(() => {
        result.current.pushUrl()
      })
      expect(mockPush).toHaveBeenCalledWith('/mall/search/rtx 5090')

      // 🧪 Test: Only brand parameter
      act(() => {
        result.current.setParams({ brand: 'amd' })
      })
      act(() => {
        result.current.pushUrl()
      })
      expect(mockPush).toHaveBeenCalledWith('/mall/brand/amd')
    })
  })

  // ============================================================================
  // 🧬 Type Safety & API Interface Tests
  // ============================================================================

  describe('🧬 TypeScript Type Integration', () => {
    it('should provide type-safe params based on URL template', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Type inference for params
      expectTypeOf(result.current.params).toEqualTypeOf<{
        brand: string
        search: string
      }>()

      // 🧪 Test: Type safety for setParams function (should support undefined)
      expectTypeOf(result.current.setParams).toEqualTypeOf<
        (
          updater:
            | {
                brand?: string | null | undefined
                search?: string | null | undefined
              }
            | ((prev: { brand: string; search: string }) => {
                brand?: string | null | undefined
                search?: string | null | undefined
              }),
        ) => void
      >()

      // Basic interface validation
      expect(result.current.pushUrl).toBeTypeOf('function')
      expect(result.current.replaceUrl).toBeTypeOf('function')
      expect(result.current.setParams).toBeTypeOf('function')
    })

    it('should support different URL template patterns with correct types', () => {
      // 🧪 Test: Single parameter template
      const { result: singleParam } = renderHook(() =>
        useCatchAllNextParams('/user/{id}/profile'),
      )
      expectTypeOf(singleParam.current.params).toEqualTypeOf<{ id: string }>()

      // 🧪 Test: No parameters template
      const { result: noParams } = renderHook(() =>
        useCatchAllNextParams('/about-us'),
      )
      expectTypeOf(noParams.current.params).toEqualTypeOf<{}>()

      // 🧪 Test: Multiple parameters template
      const { result: multiParams } = renderHook(() =>
        useCatchAllNextParams('/api/{version}/users/{userId}/posts/{postId}'),
      )
      expectTypeOf(multiParams.current.params).toEqualTypeOf<{
        version: string
        userId: string
        postId: string
      }>()
    })

    it('should support type-safe setParams usage patterns', () => {
      const { result } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )

      // 🧪 Test: Object updater type compatibility (including undefined)
      expectTypeOf(result.current.setParams).toBeCallableWith({
        brand: 'nvidia',
        search: 'rtx 4090',
      })
      expectTypeOf(result.current.setParams).toBeCallableWith({ brand: 'msi' })
      expectTypeOf(result.current.setParams).toBeCallableWith({
        brand: undefined,
        search: undefined,
      })
      expectTypeOf(result.current.setParams).toBeCallableWith({
        search: undefined,
      })

      // 🧪 Test: Functional updater type compatibility
      expectTypeOf(result.current.setParams).toBeCallableWith(
        (prev: { brand: string; search: string }) => ({
          ...prev,
          brand: 'amd',
        }),
      )
    })

    it('should provide consistent interface across different templates', () => {
      const { result: mallHook } = renderHook(() =>
        useCatchAllNextParams('/mall/brand/{brand}/search/{search}'),
      )
      const { result: userHook } = renderHook(() =>
        useCatchAllNextParams('/user/{id}/settings/{tab}'),
      )

      // 🧪 Test: Consistent interface structure
      expect(mallHook.current.pushUrl).toBeTypeOf('function')
      expect(mallHook.current.replaceUrl).toBeTypeOf('function')
      expect(userHook.current.pushUrl).toBeTypeOf('function')
      expect(userHook.current.replaceUrl).toBeTypeOf('function')

      // 🧪 Test: Template-specific param types
      expectTypeOf(mallHook.current.params).toEqualTypeOf<{
        brand: string
        search: string
      }>()
      expectTypeOf(userHook.current.params).toEqualTypeOf<{
        id: string
        tab: string
      }>()
    })
  })
})
