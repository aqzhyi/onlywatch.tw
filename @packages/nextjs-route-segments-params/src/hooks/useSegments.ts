'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import {
  extractKeyValuePairs,
  extractSegmentsFromPathname,
  rebuildPathname,
} from '../internal'

/**
 * React Hook to get URL segments from current pathname and manage state with
 * URL sync
 *
 * @example
 *   // 💡 full example: Use in Client Component
 *   // current pathname is `'/zh-TW/mall/brand/nvidia/query/rtx 5090'`
 *
 *   'use client'
 *
 *   import { useSegments } from '@onlywatch/nextjs-route-segments-params/hooks'
 *
 *   export function ProductSearchComponent() {
 *     const { params, setParams, replaceUrl, pushUrl } = useSegments([
 *       'query',
 *     ])
 *
 *     // ✅ params gets type from the array
 *     // params: { query?: string | undefined }
 *     console.log(params.query) // 'rtx 5090'
 *
 *     // ✅ setParams only takes a function updater
 *     // updates internal state, URL does not change yet
 *     setParams((prev) => ({ ...prev, query: 'rtx 4080' }))
 *
 *     // ✅ replaceUrl() - uses nextjs router.replace()
 *     // rebuilds URL segments part based on current params state
 *     // other URL parts stay the same
 *     // result: '/zh-TW/mall/brand/nvidia/query/rtx 4080'
 *     replaceUrl() // Does not add history entry
 *
 *     // ✅ pushUrl() - uses nextjs router.push()
 *     // rebuilds URL segments part based on current params state
 *     // other URL parts stay the same
 *     // result: '/zh-TW/mall/brand/nvidia/query/rtx 4080'
 *     pushUrl() // Adds history entry, can use browser back button
 *
 *     return elements
 *   }
 *
 * @example
 *   // 💡 type safety with multiple keys
 *   // current pathname is `'/mall/brand/nvidia/query/rtx 5090'`
 *
 *   const { params, setParams } = useSegments(['brand', 'query'])
 *
 *   // ✅ params gets correct type automatically
 *   // params: { brand?: string | undefined; query?: string | undefined }
 *   console.log(params.brand) // 'nvidia'
 *   console.log(params.query) // 'rtx 5090'
 *
 *   // ✅ setParams has full type checking
 *   setParams((prev) => ({
 *     ...prev,
 *     brand: 'amd', // ✅ correct
 *     query: 'rx 7900', // ✅ correct
 *     // invalid: 'test' // ❌ TypeScript error: key does not exist
 *   }))
 *
 * @example
 *   // 💡 order of keys does not matter
 *   // assume pathname is `'/mall/brand/nvidia/query/rtx 5090'`
 *
 *   // result1.params: { brand: 'nvidia', query: 'rtx 5090' }
 *   const result1 = useSegments(['brand', 'query'])
 *
 *   // different order, same result ✅
 *   // result2.params: { brand: 'nvidia', query: 'rtx 5090' }
 *   const result2 = useSegments(['query', 'brand'])
 *
 * @example
 *   // 💡 handle key not found
 *   // Current pathname is `'/mall/brand/nvidia/articles'`
 *
 *   const { params } = useSegments(['brand', 'pages'])
 *
 *   // ✅ 'pages' is not in pathname
 *   // params: { brand: 'nvidia', pages: undefined }
 *   console.log(params.brand) // 'nvidia'
 *   console.log(params.pages) // undefined
 *   console.log('pages' in params) // true (property exists but value is undefined)
 *
 * @example
 *   // 💡 handle key with no matching value (odd number of segments)
 *   // current pathname is `'/mall/brand/nvidia/articles'`
 *
 *   const { params } = useSegments(['brand', 'articles'])
 *
 *   // ✅ 'articles' exists in pathname but has no matching value
 *   // params: { brand: 'nvidia', articles: undefined }
 *   console.log(params.brand) // 'nvidia'
 *   console.log(params.articles) // undefined
 *
 * @example
 *   // 💡 how URL rebuild works
 *   // assume pathname is `'/zh-TW/mall/brand/nvidia/query/rtx 5090/featured/sale'`
 *
 *   const { params, setParams, replaceUrl } = useSegments(['query'])
 *
 *   // only manage 'query' segment
 *   setParams((prev) => ({ ...prev, query: 'rtx 4080' }))
 *   replaceUrl()
 *
 *   // ✅ new URL: '/zh-TW/mall/brand/nvidia/query/rtx 4080/featured/sale'
 *   // - '/zh-TW/mall' stays same (route prefix)
 *   // - 'brand/nvidia' stays same (not in segmentsKeys)
 *   // - 'query/rtx 5090' → 'query/rtx 4080' (updated)
 *   // - '/featured/sale' stays same (not in segmentsKeys)
 *
 * @complexity
 *   - Time: O(n) where n is the number of segments in pathname
 *   - Space: O(k) where k is the length of segmentsKeys
 */
export function useSegments<const Keys extends readonly string[]>(
  segmentsKeys: Keys,
): {
  params: {
    [K in Keys[number]]?: string | undefined
  }
  setParams: (
    updater: (prev: {
      [K in Keys[number]]?: string | undefined
    }) => {
      [K in Keys[number]]?: string | undefined
    },
  ) => void
  replaceUrl: () => void
  pushUrl: () => void
} {
  const keysStringified = JSON.stringify(segmentsKeys)
  const pathname = usePathname()
  const router = useRouter()

  const initialSegments = useMemo(() => {
    try {
      const segments = extractSegmentsFromPathname(pathname)

      return extractKeyValuePairs(segmentsKeys, segments)
    } catch (error) {
      console.warn('Failed to parse segments from pathname:', error)
      return {} as {
        [K in Keys[number]]?: string | undefined
      }
    }
  }, [pathname, keysStringified])

  // internal state management
  const [segments, setSegmentsState] = useState(initialSegments)

  // update params when pathname or segmentsKeys change
  useMemo(() => {
    setSegmentsState(initialSegments)
  }, [initialSegments])

  const setParams = useCallback(
    (
      updater: (prev: {
        [K in Keys[number]]?: string | undefined
      }) => {
        [K in Keys[number]]?: string | undefined
      },
    ) => {
      setSegmentsState((prev) => {
        const newParams = updater(prev)
        return newParams
      })
    },
    [],
  )

  const replaceUrl = useCallback(() => {
    try {
      setSegmentsState((currentParams) => {
        const newPathname = rebuildPathname(
          pathname,
          segmentsKeys,
          currentParams,
        )
        router.replace(newPathname)
        return currentParams // do not change state, just get latest value
      })
    } catch (error) {
      console.error('Failed to replace URL:', error)
    }
  }, [pathname, keysStringified, router])

  const pushUrl = useCallback(() => {
    try {
      setSegmentsState((currentParams) => {
        const newPathname = rebuildPathname(
          pathname,
          segmentsKeys,
          currentParams,
        )
        router.push(newPathname)
        return currentParams // do not change state, just get latest value
      })
    } catch (error) {
      console.error('Failed to push URL:', error)
    }
  }, [pathname, keysStringified, router])

  return {
    params: segments,
    setParams,
    replaceUrl,
    pushUrl,
  }
}
