import { useEffect, useRef, useState } from 'react'

/**
 * A custom hook that triggers a callback function at a specified interval.
 *
 * similar to `setInterval` or `useInterval`, but the internal implementation
 * does not use `setInterval`, instead it uses `requestAnimationFrame`.
 *
 * @example
 *   // basic usage
 *   useIntervalTick({
 *     refreshInterval: 1000,
 *     onTick: () => {
 *       console.info('tick!')
 *       // triggers every second
 *     },
 *   })
 *
 * @example
 *   // pausing and disabling
 *   useIntervalTick({
 *     refreshInterval: 1000,
 *     enabled: () => false,
 *     onTick: () => {
 *       console.info('tick!')
 *       // will not trigger while disabled
 *     },
 *   })
 */
export function useIntervalTick(options: {
  refreshInterval?: number
  /**
   * keep the interval running or pausing
   *
   * @default true
   */
  enabled?: () => boolean
  onTick: () => unknown
}) {
  const { refreshInterval = 1000, onTick, enabled: getHasEnabled } = options

  const getHasEnabledRef = useRef(getHasEnabled)
  const onTickRef = useRef(onTick)

  useEffect(() => {
    let rafId = 0
    let nowTime = 0
    let prevTime = 0

    const checkTick = () => {
      const hasEnabled = getHasEnabledRef.current?.() ?? true

      nowTime = performance.now()

      if (!hasEnabled) {
        // when changing from paused state to enabled state,
        // reset `prevTime` to avoid a large time difference that causes `onTick`
        // to be triggered immediately
        prevTime = performance.now()
        rafId = requestAnimationFrame(checkTick)
        return
      }

      const currentTickMs = nowTime - prevTime

      if (currentTickMs >= refreshInterval) {
        onTickRef.current()
        prevTime = nowTime
      }

      rafId = requestAnimationFrame(checkTick)
    }

    rafId = requestAnimationFrame(checkTick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [refreshInterval])
}
