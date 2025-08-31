import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIntervalNow } from '~/hooks/useIntervalNow'
import type { AnyFunction } from '~/types/AnyFunction'

// Mock timers
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('useIntervalNow', () => {
  it('should call callback at specified intervals', () => {
    const mockCallback = vi.fn()
    const delay = 1000

    renderHook(() => useIntervalNow(mockCallback, delay))

    // Should be called immediately on mount
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Should be called after second interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(3)

    // Should be called after third interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(4)
  })

  it('should not set interval when delay is null', () => {
    const mockCallback = vi.fn()
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    renderHook(() => useIntervalNow(mockCallback, null))

    // Should not call setInterval
    expect(setIntervalSpy).not.toHaveBeenCalled()

    // Should not call callback even after time passes
    vi.advanceTimersByTime(5000)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not set interval when delay is zero', () => {
    const mockCallback = vi.fn()
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    renderHook(() => useIntervalNow(mockCallback, 0))

    // Should not call setInterval
    expect(setIntervalSpy).not.toHaveBeenCalled()

    // Should not call callback even after time passes
    vi.advanceTimersByTime(5000)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not set interval when delay is negative', () => {
    const mockCallback = vi.fn()
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    renderHook(() => useIntervalNow(mockCallback, -100))

    // Should not call setInterval
    expect(setIntervalSpy).not.toHaveBeenCalled()

    // Should not call callback even after time passes
    vi.advanceTimersByTime(5000)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should start interval when delay changes from zero to positive number', () => {
    const mockCallback = vi.fn()
    const delay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: number }) => useIntervalNow(mockCallback, delay),
      {
        initialProps: { delay: 0 },
      },
    )

    // Should not have interval initially with zero delay
    vi.advanceTimersByTime(1000)
    expect(mockCallback).not.toHaveBeenCalled()

    // Update delay to positive number
    rerender({ delay })

    // Should be called immediately when delay becomes valid
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  it('should start interval when delay changes from null to number', () => {
    const mockCallback = vi.fn()
    const delay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: null | number }) =>
        useIntervalNow(mockCallback, delay),
      {
        initialProps: { delay: null as null | number },
      },
    )

    // Should not have interval initially
    vi.advanceTimersByTime(1000)
    expect(mockCallback).not.toHaveBeenCalled()

    // Update delay to number
    rerender({ delay })

    // Should be called immediately when delay becomes valid
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  it('should stop interval when delay changes from positive number to zero', () => {
    const mockCallback = vi.fn()
    const delay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: number }) => useIntervalNow(mockCallback, delay),
      {
        initialProps: { delay },
      },
    )

    // Verify interval is running (immediate call + first interval)
    expect(mockCallback).toHaveBeenCalledTimes(1) // Immediate call

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2) // After first interval

    // Set delay to zero
    rerender({ delay: 0 })

    // Clear previous call records
    mockCallback.mockClear()

    // Time advances, callback should not be called anymore
    vi.advanceTimersByTime(delay * 3)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should stop interval when delay changes from number to null', () => {
    const mockCallback = vi.fn()
    const delay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: null | number }) =>
        useIntervalNow(mockCallback, delay),
      {
        initialProps: { delay: delay as null | number },
      },
    )

    // Verify interval is running (immediate call + first interval)
    expect(mockCallback).toHaveBeenCalledTimes(1) // Immediate call

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2) // After first interval

    // Set delay to null
    rerender({ delay: null })

    // Clear previous call records
    mockCallback.mockClear()

    // Time advances, callback should not be called anymore
    vi.advanceTimersByTime(delay * 3)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should use new delay when delay value changes', () => {
    const mockCallback = vi.fn()
    const initialDelay = 1000
    const newDelay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: number }) => useIntervalNow(mockCallback, delay),
      {
        initialProps: { delay: initialDelay },
      },
    )

    // Use initial delay (immediate call)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(initialDelay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Change delay value
    rerender({ delay: newDelay })

    // Should be called immediately with new delay
    expect(mockCallback).toHaveBeenCalledTimes(3)

    // Use new delay value
    vi.advanceTimersByTime(newDelay)
    expect(mockCallback).toHaveBeenCalledTimes(4)

    // Confirm new delay value continues to be effective
    vi.advanceTimersByTime(newDelay)
    expect(mockCallback).toHaveBeenCalledTimes(5)
  })

  it('should use new callback when callback function changes', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const delay = 1000

    const { rerender } = renderHook(
      ({ callback }: { callback: AnyFunction }) =>
        useIntervalNow(callback, delay),
      {
        initialProps: { callback: mockCallback1 },
      },
    )

    // Use first callback function (immediate call)
    expect(mockCallback1).toHaveBeenCalledTimes(1)
    expect(mockCallback2).not.toHaveBeenCalled()

    vi.advanceTimersByTime(delay)
    expect(mockCallback1).toHaveBeenCalledTimes(2)
    expect(mockCallback2).not.toHaveBeenCalled()

    // Change callback function
    rerender({ callback: mockCallback2 })

    // Should call new callback immediately
    expect(mockCallback1).toHaveBeenCalledTimes(2) // Should not increase
    expect(mockCallback2).toHaveBeenCalledTimes(1) // New callback called immediately

    // Use new callback function after interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback1).toHaveBeenCalledTimes(2) // Should not increase
    expect(mockCallback2).toHaveBeenCalledTimes(2) // New callback called again
  })

  it('should clear interval on component unmount', () => {
    const mockCallback = vi.fn()
    const delay = 1000
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    const { unmount } = renderHook(() => useIntervalNow(mockCallback, delay))

    // Confirm interval is running (immediate call)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Unmount component
    unmount()

    // Confirm clearInterval was called
    expect(clearIntervalSpy).toHaveBeenCalled()

    // Confirm interval has stopped
    mockCallback.mockClear()
    vi.advanceTimersByTime(delay * 2)
    expect(mockCallback).not.toHaveBeenCalled()
  })
})
