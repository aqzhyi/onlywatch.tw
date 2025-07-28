import { useEffect } from 'react'
import type { AnyFunction } from '~/app/types/AnyFunction'

export function useIntervalNow(callback: AnyFunction, delay: number) {
  useEffect(() => {
    const interval = setInterval(() => {
      callback()
    }, delay)

    return () => clearInterval(interval)
  }, [callback, delay])
}
