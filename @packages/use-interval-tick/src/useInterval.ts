import { useEffect } from 'react'

/**
 * A custom hook that triggers a callback function at a specified interval.
 *
 * @example
 *   // basic usage
 *   useInterval({
 *     refreshInterval: 1000,
 *     onTick: () => {
 *       console.info('tick!')
 *       // triggers every second (not immediately)
 *     },
 *   })
 *
 * @example
 *   // trigger immediately on mount
 *   useInterval({
 *     refreshInterval: 1000,
 *     tickOnMount: true,
 *     onTick: () => {
 *       console.info('tick!')
 *       // triggers immediately and then every second
 *     },
 *   })
 *
 * @example
 *   // pausing with null or zero
 *   useInterval({
 *     refreshInterval: null,
 *     onTick: () => {
 *       console.info('tick!')
 *       // interval is paused
 *     },
 *   })
 */
export function useInterval(options: {
  refreshInterval: null | number
  tickOnMount?: boolean
  onTick: () => unknown
}) {
  const { refreshInterval, tickOnMount = false, onTick } = options

  useEffect(() => {
    if (refreshInterval === null || refreshInterval <= 0) return

    if (tickOnMount) {
      onTick()
    }

    const interval = setInterval(() => {
      onTick()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [onTick, refreshInterval, tickOnMount])
}
