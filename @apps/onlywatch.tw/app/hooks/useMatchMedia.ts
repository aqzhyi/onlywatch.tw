import { useEffect, useState } from 'react'
import { isClientSide } from '~/utils/isClientSide'

const breakpointQueries = new Map([
  ['sm', '(min-width: 40rem)'],
  ['md', '(min-width: 48rem)'],
  ['lg', '(min-width: 64rem)'],
  ['xl', '(min-width: 80rem)'],
  ['2xl', '(min-width: 96rem)'],
])

/**
 * @example
 *   const isMD = useMatchMedia('md') // true if screen width >= 768px
 *
 * @returns `boolean` - whether the media query matches or not
 */
export function useMatchMedia(
  /**
   * @example
   *   // here are the breakpoints that align with the Tailwind CSS defaults
   *   'sm' // 40rem (640px)
   *   'md' // 48rem (768px)
   *   'lg' // 64rem (1024px)
   *   'xl' // 80rem (1280px)
   *   '2xl' // 96rem (1536px)
   *
   * @example
   *   // you can pass any valid media query string
   *   'screen and (max-width: 700px)'
   */
  query: (string & {}) | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
) {
  const [queryState, setQueryState] = useState(() => {
    const query_ = breakpointQueries.get(query) || query

    if (isClientSide) {
      return globalThis.window.matchMedia(query_).matches
    }

    return false
  })

  useEffect(() => {
    const clearController = new AbortController()
    const query_ = breakpointQueries.get(query) || query
    const mediaQueryList = globalThis.window.matchMedia(query_)

    setQueryState(() => mediaQueryList.matches)

    mediaQueryList.addEventListener(
      'change',
      () => {
        setQueryState(() => mediaQueryList.matches)
      },
      {
        signal: clearController.signal,
      },
    )

    return () => {
      clearController.abort()
    }
  }, [query])

  return queryState
}
