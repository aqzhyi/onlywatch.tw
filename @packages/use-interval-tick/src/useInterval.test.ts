import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInterval } from './useInterval'

// Mock timers
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('useInterval', () => {
  it('should not call callback immediately by default', () => {
    const mockCallback = vi.fn()
    const delay = 1000

    renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: delay,
      }),
    )

    // Should not be called immediately on mount (default behavior)
    expect(mockCallback).not.toHaveBeenCalled()

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Should be called after second interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Should be called after third interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  it('should call callback at specified intervals when tickOnMount is true', () => {
    const mockCallback = vi.fn()
    const delay = 1000

    renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: delay,
        tickOnMount: true,
      }),
    )

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

  it('should not call callback immediately when tickOnMount is false', () => {
    const mockCallback = vi.fn()
    const delay = 1000

    renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: delay,
        tickOnMount: false,
      }),
    )

    // Should not be called immediately on mount
    expect(mockCallback).not.toHaveBeenCalled()

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Should be called after second interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Should be called after third interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  it('should not set interval when delay is null', () => {
    const mockCallback = vi.fn()
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')

    renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: null,
      }),
    )

    // Should not call setInterval
    expect(setIntervalSpy).not.toHaveBeenCalled()

    // Should not call callback even after time passes
    vi.advanceTimersByTime(5000)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not set interval when delay is zero', () => {
    const mockCallback = vi.fn()
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')

    renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: 0,
      }),
    )

    // Should not call setInterval
    expect(setIntervalSpy).not.toHaveBeenCalled()

    // Should not call callback even after time passes
    vi.advanceTimersByTime(5000)
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not set interval when delay is negative', () => {
    const mockCallback = vi.fn()
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')

    renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: -100,
      }),
    )

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
      ({ delay }: { delay: number }) =>
        useInterval({
          onTick: mockCallback,
          refreshInterval: delay,
        }),
      {
        initialProps: { delay: 0 },
      },
    )

    // Should not have interval initially with zero delay
    vi.advanceTimersByTime(1000)
    expect(mockCallback).not.toHaveBeenCalled()

    // Update delay to positive number
    rerender({ delay })

    // Should not be called immediately (default tickOnMount: false)
    expect(mockCallback).not.toHaveBeenCalled()

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })

  it('should start interval when delay changes from null to number', () => {
    const mockCallback = vi.fn()
    const delay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: null | number }) =>
        useInterval({
          onTick: mockCallback,
          refreshInterval: delay,
        }),
      {
        initialProps: { delay: null as null | number },
      },
    )

    // Should not have interval initially
    vi.advanceTimersByTime(1000)
    expect(mockCallback).not.toHaveBeenCalled()

    // Update delay to number
    rerender({ delay })

    // Should not be called immediately (default tickOnMount: false)
    expect(mockCallback).not.toHaveBeenCalled()

    // Should be called after first interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })

  it('should stop interval when delay changes from positive number to zero', () => {
    const mockCallback = vi.fn()
    const delay = 500

    const { rerender } = renderHook(
      ({ delay }: { delay: number }) =>
        useInterval({
          onTick: mockCallback,
          refreshInterval: delay,
        }),
      {
        initialProps: { delay },
      },
    )

    // Verify interval is running (no immediate call with default tickOnMount: false)
    expect(mockCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1) // After first interval

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
        useInterval({
          onTick: mockCallback,
          refreshInterval: delay,
        }),
      {
        initialProps: { delay: delay as null | number },
      },
    )

    // Verify interval is running (no immediate call with default tickOnMount: false)
    expect(mockCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1) // After first interval

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
      ({ delay }: { delay: number }) =>
        useInterval({
          onTick: mockCallback,
          refreshInterval: delay,
        }),
      {
        initialProps: { delay: initialDelay },
      },
    )

    // Use initial delay (no immediate call with default tickOnMount: false)
    expect(mockCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(initialDelay)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Change delay value
    rerender({ delay: newDelay })

    // Should not be called immediately (default tickOnMount: false)
    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Use new delay value
    vi.advanceTimersByTime(newDelay)
    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Confirm new delay value continues to be effective
    vi.advanceTimersByTime(newDelay)
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  it('should use new callback when callback function changes', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const delay = 1000

    const { rerender } = renderHook(
      ({ callback }: { callback: (...args: unknown[]) => unknown }) =>
        useInterval({
          onTick: callback,
          refreshInterval: delay,
        }),
      {
        initialProps: { callback: mockCallback1 },
      },
    )

    // Use first callback function (no immediate call with default tickOnMount: false)
    expect(mockCallback1).not.toHaveBeenCalled()
    expect(mockCallback2).not.toHaveBeenCalled()

    vi.advanceTimersByTime(delay)
    expect(mockCallback1).toHaveBeenCalledTimes(1)
    expect(mockCallback2).not.toHaveBeenCalled()

    // Change callback function
    rerender({ callback: mockCallback2 })

    // Should not call new callback immediately (default tickOnMount: false)
    expect(mockCallback1).toHaveBeenCalledTimes(1) // Should not increase
    expect(mockCallback2).not.toHaveBeenCalled()

    // Use new callback function after interval
    vi.advanceTimersByTime(delay)
    expect(mockCallback1).toHaveBeenCalledTimes(1) // Should not increase
    expect(mockCallback2).toHaveBeenCalledTimes(1) // New callback called
  })

  it('should clear interval on component unmount', () => {
    const mockCallback = vi.fn()
    const delay = 1000
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    const { unmount } = renderHook(() =>
      useInterval({
        onTick: mockCallback,
        refreshInterval: delay,
      }),
    )

    // Confirm interval is set up (no immediate call with default tickOnMount: false)
    expect(mockCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(delay)
    expect(mockCallback).toHaveBeenCalledTimes(1)

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
