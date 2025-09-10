import { useEffect } from 'react'
import type { AnyFunction } from '~/types/AnyFunction'

export function useIntervalNow(callback: AnyFunction, delay: null | number) {
  useEffect(() => {
    if (delay === null || delay <= 0) return

    // Execute callback immediately on mount
    callback()

    const interval = setInterval(() => {
      callback()
    }, delay)

    return () => clearInterval(interval)
  }, [callback, delay])
}
