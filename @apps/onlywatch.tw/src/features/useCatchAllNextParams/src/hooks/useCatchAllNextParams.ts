'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { ParamsObject } from '~/features/useCatchAllNextParams/src/types/ParamsObject'
import { buildParamsToUrl } from '~/features/useCatchAllNextParams/src/utils/buildParamsToUrl'
import { filterValidParams } from '~/features/useCatchAllNextParams/src/utils/filterValidParams'
import { parseUrlToParams } from '~/features/useCatchAllNextParams/src/utils/parseUrlToParams'

const DEFAULT_MAX_PARAM_VALUE_LENGTH = 1000

/**
 * Hook for managing Next.js catch-all route parameters with type safety
 *
 * Provides separated concerns for parameter management and navigation:
 *
 * - setParams: Updates parameter state without triggering navigation
 * - pushUrl/replaceUrl: Navigates using router.push/replace with current
 *   parameter state
 *
 * Key features:
 *
 * - Automatic URL parsing and parameter extraction from pathname
 * - Type-safe parameter object with specified keys
 * - Concurrent state update protection with queuing system
 * - URL encoding/decoding for special characters and Unicode
 * - Parameter value length truncation to prevent URL overflow
 * - Graceful error handling for malformed URLs and base paths
 *
 * @example
 *   // Basic e-commerce filter usage
 *   const { params, setParams, pushUrl, replaceUrl } =
 *     useCatchAllNextParams<['brand', 'search']>('/mall')
 *
 *   // URL: /mall/brand/nvidia/search/5090
 *   // params: { brand: 'nvidia', search: '5090' }
 *
 *   setParams({ brand: 'amd', search: '7900xtx' }) // Updates state only
 *   pushUrl() // Navigates to /mall/brand/amd/search/7900xtx
 *
 * @example
 *   // Functional updates and navigation workflow
 *   setParams((prev) => ({ ...prev, search: '4080' })) // Merge with existing params
 *   replaceUrl() // Replace current URL without adding to history
 *
 * @example
 *   // Complex search with multiple filters
 *   const { params, setParams } =
 *     useCatchAllNextParams<
 *       ['q', 'category', 'price-min', 'price-max', 'sort']
 *     >('/search')
 *
 *   // URL: /search/q/gaming%20laptop/category/computers/page/2
 *   // params: { q: 'gaming laptop', category: 'computers', page: '2' }
 *
 * @example
 *   // Custom parameter value length limit
 *   const { params, setParams } = useCatchAllNextParams<['description']>(
 *     '/products',
 *     { maxParamValueLength: 500 },
 *   )
 *
 * @complexity O(n + m * k) where n is pathname parsing, m is number of parameters, and k is average parameter value length
 */
export function useCatchAllNextParams<
  SearchParamsKeys extends readonly string[],
>(
  baseUrl: string,
  options: UseCatchAllNextParamsOptions = {},
): UseCatchAllNextParamsReturn<SearchParamsKeys> {
  const pathname = usePathname()
  const router = useRouter()

  const { maxParamValueLength = DEFAULT_MAX_PARAM_VALUE_LENGTH } = options

  /** Prevent circular updates and manage concurrent calls */
  const isUpdatingRef = useRef(false)
  const updateQueueRef = useRef<Array<() => void>>([])

  const normalizedBaseUrl = useMemo(() => normalizeBaseUrl(baseUrl), [baseUrl])

  // Initialize parameters from URL
  const initialParams = useMemo(() => {
    try {
      const parsedParams = parseUrlToParams(pathname, normalizedBaseUrl)
      return parsedParams as ParamsObject<SearchParamsKeys>
    } catch {
      return {} as ParamsObject<SearchParamsKeys>
    }
  }, [pathname, normalizedBaseUrl])

  // Use internal state to manage parameters
  const [params, setInternalParams] =
    useState<ParamsObject<SearchParamsKeys>>(initialParams)

  // Sync internal state with URL changes
  useMemo(() => {
    try {
      const parsedParams = parseUrlToParams(pathname, normalizedBaseUrl)
      setInternalParams(parsedParams as ParamsObject<SearchParamsKeys>)
    } catch {
      setInternalParams({} as ParamsObject<SearchParamsKeys>)
    }
  }, [pathname, normalizedBaseUrl])

  const processNextQueuedUpdate = useCallback(() => {
    const nextUpdate = updateQueueRef.current.shift()
    nextUpdate?.()
  }, [])

  const setParams = useCallback(
    (
      updater:
        | ParamsObject<SearchParamsKeys>
        | ((
            prev: ParamsObject<SearchParamsKeys>,
          ) => ParamsObject<SearchParamsKeys>),
    ) => {
      // Queue concurrent calls to prevent race conditions
      if (isUpdatingRef.current) {
        updateQueueRef.current.push(() => setParams(updater))
        return
      }

      isUpdatingRef.current = true

      try {
        const newParams =
          typeof updater === 'function' ? updater(params) : updater
        const processedParams = processParameterValues(
          newParams,
          maxParamValueLength,
        )

        // Update internal parameter state
        setInternalParams(processedParams as ParamsObject<SearchParamsKeys>)
      } catch (error) {
        console.warn('Failed to update URL parameters:', error)
      } finally {
        isUpdatingRef.current = false
        // Process next queued update asynchronously
        setTimeout(processNextQueuedUpdate, 0)
      }
    },
    [params, processNextQueuedUpdate, maxParamValueLength],
  )

  const pushUrl = useCallback(() => {
    // Build URL from current parameters and push
    const currentPath = buildParamsToUrl(params, normalizedBaseUrl)
    router.push(currentPath)
  }, [params, normalizedBaseUrl, router])

  const replaceUrl = useCallback(() => {
    // Build URL from current parameters and replace
    const currentPath = buildParamsToUrl(params, normalizedBaseUrl)
    router.replace(currentPath)
  }, [params, normalizedBaseUrl, router])

  return { params, setParams, pushUrl, replaceUrl }
}

type UseCatchAllNextParamsOptions = {
  /**
   * Maximum allowed length for URL parameter values to prevent overflow
   *
   * @default 1000
   */
  maxParamValueLength?: number
}

type UseCatchAllNextParamsReturn<T extends readonly string[]> = {
  params: ParamsObject<T>
  setParams: (
    updater: ParamsObject<T> | ((prev: ParamsObject<T>) => ParamsObject<T>),
  ) => void
  /**
   * Trigger navigation using router.push with current URL
   *
   * Forces the router to push the current URL to history stack
   */
  pushUrl: () => void
  /**
   * Trigger navigation using router.replace with current URL
   *
   * Forces the router to replace the current URL in history stack
   */
  replaceUrl: () => void
}

/**
 * Normalizes base URL by removing trailing slashes and duplicate slashes
 */
function normalizeBaseUrl(baseUrl: string): string {
  try {
    const cleaned = baseUrl.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
    return cleaned === '/' ? '' : cleaned
  } catch {
    return ''
  }
}

/**
 * Filters and processes parameters with length truncation
 *
 * Combines filtering of valid parameters with truncation of overly long values
 * to prevent URL overflow while maintaining data integrity
 */
function processParameterValues(
  params: Record<string, unknown>,
  maxParamValueLength: number,
): Record<string, unknown> {
  const validParams = filterValidParams(params)
  const processed: Record<string, unknown> = {}

  for (const [key, value] of validParams) {
    const truncatedValue =
      value.length > maxParamValueLength
        ? value.slice(0, maxParamValueLength) + '...'
        : value
    processed[key] = truncatedValue
  }

  return processed
}
