'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type {
  NextParamsObject,
  NextParamsObjectNilable,
} from '../types/NextParamsObject'
import { buildUrlFromTemplate } from '../utils/buildUrlFromTemplate'
import { parseUrlByTemplate } from '../utils/parseUrlByTemplate'

/**
 * 🎯 Hook for managing URL parameters with type safety
 *
 * @example
 *   // 🚀 Basic Interfaces
 *   const { params, setParams, pushUrl, replaceUrl } =
 *     useCatchAllNextParams('/search/{query}')
 *
 * @example
 *   // 🚀 More complex baseUrl
 *   useCatchAllNextParams('/mall/brand/{brand}/search/{query}')
 *   useCatchAllNextParams('/calendar/search/{query}/date/{date}/')
 *
 * @example
 *   // 🚀 Basic Usage
 *   const { params, setParams, pushUrl } =
 *     useCatchAllNextParams('/search/{query}')
 *
 *   // set params to { query: 'rtx 5080' }
 *   setParams({ query: 'rtx 5080' })
 *
 *   // navigates the URL to '/search/rtx 5080'
 *   pushUrl()
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 params is { brand: 'amd', search: 'rtx 5090' }
 *   console.info(params)
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 replace all params with new NextParams:
 *
 *   // now params is { brand: 'msi' }
 *   setParams({ brand: 'msi' })
 *
 *   // now params is { brand: 'gigabyte' }
 *   setParams({ brand: 'gigabyte' })
 *
 *   // now params is { search: '1080' }
 *   setParams({ search: 'rtx 1080' })
 *
 *   // now params is { brand: 'nvidia', search: 'rtx 2080' }
 *   setParams({ brand: 'nvidia', search: 'rtx 2080' })
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 merging with prev NextParams:
 *
 *   // now params is { brand: 'amd', search: 'rtx 2080' }
 *   setParams((prev) => ({ ...prev, search: 'rtx 2080' }))
 *
 *   // now params is { brand: 'nvda', search: 'rtx 5090' }
 *   setParams((prev) => ({ ...prev, brand: 'nvda' }))
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   // 🚀 remove both parameters:
 *   setParams((prev) => ({ ...prev, brand: undefined, search: undefined }))
 *
 *   // now the URL will be '/mall'
 *   pushUrl()
 *
 * @example
 *   // assume baseUrl set to '/mall/brand/{brand}/search/{search}'
 *   // assume current URL is '/mall/brand/amd/search/rtx 5090'
 *
 *   //
 *   // 🚀 remove the specified parameter 'search':
 *   setParams((prev) => ({ ...prev, search: null }))
 *
 *   // now the URL will be '/mall/brand/amd'
 *   pushUrl()
 *
 *   //
 *   // 🚀 remove the specified parameter 'brand':
 *   setParams((prev) => ({ ...prev, brand: null }))
 *
 *   // now the URL will be '/mall/search/rtx 5090'
 *   pushUrl()
 */
export function useCatchAllNextParams<RouteTemplate extends string>(
  /**
   * @example
   *   '/mall/brand/{brand}/search/{search}'
   */
  routeTemplate: RouteTemplate,
): UseCatchAllNextParamsReturn<RouteTemplate> {
  const pathname = usePathname()
  const router = useRouter()

  //  Parse current URL parameters
  const params = useMemo(() => {
    try {
      const parsedParams = parseUrlByTemplate(pathname, routeTemplate)
      return parsedParams as NextParamsObject<RouteTemplate>
    } catch {
      // Return empty params on parse error
      return {} as NextParamsObject<RouteTemplate>
    }
  }, [routeTemplate, pathname])

  // 🎯 Current merged params state for setParams operations
  const [currentParams, setCurrentParams] =
    useState<NextParamsObject<RouteTemplate>>(params)

  // 🔄 Sync params with URL changes
  useMemo(() => {
    setCurrentParams(params)
  }, [params])

  /**
   * 🎯 Set new parameters with state sync
   */
  const setParams = useCallback(
    (
      newParams:
        | NextParamsObjectNilable<RouteTemplate>
        | ((
            current: NextParamsObject<RouteTemplate>,
          ) => NextParamsObjectNilable<RouteTemplate>),
    ) => {
      const paramsToSet =
        typeof newParams === 'function' ? newParams(currentParams) : newParams

      // Handle parameter updates with proper logic
      let mergedParams: NextParamsObject<RouteTemplate>

      if (typeof newParams === 'function') {
        // Function mode: merge with current params (allows precise control)
        mergedParams = { ...currentParams }

        // Process each parameter in the new params
        for (const [key, value] of Object.entries(paramsToSet)) {
          if (value === undefined || value === null || value === '') {
            // Remove the parameter when value is undefined, null, or empty string
            delete mergedParams[key as keyof typeof mergedParams]
          } else {
            // Set or update the parameter
            ;(mergedParams as any)[key] = value
          }
        }
      } else {
        // Object mode: replace all params (as per JSDoc "replace all params with new NextParams")
        mergedParams = {} as NextParamsObject<RouteTemplate>

        // Only set parameters that have valid values
        for (const [key, value] of Object.entries(paramsToSet)) {
          if (value !== undefined && value !== null && value !== '') {
            ;(mergedParams as any)[key] = value
          }
        }
      }

      setCurrentParams(mergedParams)
    },
    [currentParams],
  )

  /**
   * 🚀 Navigate to new URL using router.push
   */
  const pushUrl = useCallback(() => {
    try {
      const newUrl = buildUrlFromTemplate(routeTemplate, currentParams)
      router.push(newUrl)
    } catch (buildError) {
      // Silently fail if URL building fails
      console.warn('Failed to build URL for navigation:', buildError)
    }
  }, [routeTemplate, currentParams, router])

  /**
   * 🔄 Navigate to new URL using router.replace
   */
  const replaceUrl = useCallback(() => {
    try {
      const newUrl = buildUrlFromTemplate(routeTemplate, currentParams)
      router.replace(newUrl)
    } catch (buildError) {
      // Silently fail if URL building fails
      console.warn('Failed to build URL for navigation:', buildError)
    }
  }, [routeTemplate, currentParams, router])

  return {
    params: currentParams,
    setParams,
    pushUrl,
    replaceUrl,
  }
}

/**
 * 🎯 Return type for useCatchAllNextParams hook
 */
export type UseCatchAllNextParamsReturn<TUrlTemplate extends string> = {
  /**
   * the current states maintained by the internal state of react-hook
   *
   * @example
   *   // assume baseUrl is '/mall/brand/{brand}/search/{search}'
   *   // the type of ParamsObject expect to be { brand: string; search: string }
   */
  params: NextParamsObject<TUrlTemplate>

  /** Function to update parameters */
  setParams: (
    newParams:
      | NextParamsObjectNilable<TUrlTemplate>
      | ((
          current: NextParamsObject<TUrlTemplate>,
        ) => NextParamsObjectNilable<TUrlTemplate>),
  ) => void

  /** Navigate to new URL with updated parameters using router.push */
  pushUrl: () => void

  /** Navigate to new URL with updated parameters using router.replace */
  replaceUrl: () => void
}
