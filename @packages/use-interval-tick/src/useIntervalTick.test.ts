import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIntervalTick } from './useIntervalTick'

describe('useIntervalTick', () => {
  let rafCallbacks: Array<FrameRequestCallback> = []
  let rafId = 0

  beforeEach(() => {
    vi.useFakeTimers()
    rafCallbacks = []
    rafId = 0

    // mock requestAnimationFrame
    globalThis.requestAnimationFrame = vi.fn(
      (callback: FrameRequestCallback) => {
        rafCallbacks.push(callback)
        return ++rafId
      },
    )

    // mock cancelAnimationFrame
    globalThis.cancelAnimationFrame = vi.fn((id: number) => {
      // in real implementation, this would stop the callback
      // for testing, we'll just track that it was called
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  const triggerRAF = () => {
    const callbacks = [...rafCallbacks]
    rafCallbacks = []
    for (const callback of callbacks) {
      callback(performance.now())
    }
  }

  describe('core functionality', () => {
    describe('interval triggering', () => {
      it('should trigger onTick at specified intervals', () => {
        const onTick = vi.fn()

        renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 1000,
          }),
        )

        // after 1 second
        vi.advanceTimersByTime(1000)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(1)

        // after 2 seconds
        vi.advanceTimersByTime(1000)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(2)

        // after 3 seconds
        vi.advanceTimersByTime(1000)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(3)
      })

      it('should not trigger when elapsed time is less than interval', () => {
        const onTick = vi.fn()

        renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 1000,
          }),
        )

        // advance by 999ms - should not trigger
        vi.advanceTimersByTime(999)
        triggerRAF()
        expect(onTick).not.toHaveBeenCalled()

        // advance by 1 more ms to reach 1000ms - should trigger
        vi.advanceTimersByTime(1)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(1)
      })

      it('should use default interval of 1000ms when not provided', () => {
        const onTick = vi.fn()

        renderHook(() =>
          useIntervalTick({
            onTick,
          }),
        )

        // advance by less than 1000ms - should not trigger
        vi.advanceTimersByTime(500)
        triggerRAF()
        expect(onTick).not.toHaveBeenCalled()

        // advance to 1000ms total - should trigger
        vi.advanceTimersByTime(500)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(1)
      })

      it('should handle multiple consecutive intervals correctly', () => {
        const onTick = vi.fn()

        renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 100,
          }),
        )

        // run for 50 intervals (5 seconds)
        for (let index = 1; index <= 50; index++) {
          vi.advanceTimersByTime(100)
          triggerRAF()
        }

        expect(onTick).toHaveBeenCalledTimes(50)
      })
    })

    describe('lifecycle', () => {
      it('should not trigger onTick immediately after mount', () => {
        const onTick = vi.fn()

        renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 1000,
          }),
        )

        // initial render should not trigger onTick yet
        expect(onTick).not.toHaveBeenCalled()

        // trigger RAF and advance time by 1 second
        vi.advanceTimersByTime(1000)
        triggerRAF()

        // should call onTick
        expect(onTick).toHaveBeenCalledTimes(1)
      })

      it('should cleanup animation frame on unmount', () => {
        const onTick = vi.fn()
        const cancelAnimationFrameSpy = vi.spyOn(
          globalThis,
          'cancelAnimationFrame',
        )

        const { unmount } = renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 1000,
          }),
        )

        unmount()

        expect(cancelAnimationFrameSpy).toHaveBeenCalled()
      })

      it('should not trigger onTick after unmount', () => {
        const onTick = vi.fn()

        const { unmount } = renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 1000,
          }),
        )

        // trigger once before unmount
        vi.advanceTimersByTime(1000)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(1)

        // unmount the hook
        unmount()

        // clear RAF callbacks to simulate cleanup
        rafCallbacks = []

        // try to trigger again after unmount
        vi.advanceTimersByTime(1000)
        triggerRAF()

        // should still be called only once (no new calls after unmount)
        expect(onTick).toHaveBeenCalledTimes(1)
      })

      it('should maintain functionality across re-renders', () => {
        const onTick = vi.fn()

        const { rerender } = renderHook(() =>
          useIntervalTick({
            onTick,
            refreshInterval: 1000,
          }),
        )

        // trigger first tick
        vi.advanceTimersByTime(1000)
        triggerRAF()
        expect(onTick).toHaveBeenCalledTimes(1)

        // rerender the hook
        rerender()

        // trigger second tick
        vi.advanceTimersByTime(1000)
        triggerRAF()

        // should have been called twice total
        expect(onTick).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('enabled option', () => {
    it('should not trigger onTick when enabled is false', () => {
      const onTick = vi.fn()

      renderHook(() =>
        useIntervalTick({
          onTick,
          enabled: () => false,
          refreshInterval: 1000,
        }),
      )

      vi.advanceTimersByTime(1000)
      triggerRAF()

      expect(onTick).not.toHaveBeenCalled()
    })

    it('should trigger onTick when enabled is true', () => {
      const onTick = vi.fn()

      renderHook(() =>
        useIntervalTick({
          onTick,
          enabled: () => true,
          refreshInterval: 1000,
        }),
      )

      vi.advanceTimersByTime(1000)
      triggerRAF()

      expect(onTick).toHaveBeenCalledTimes(1)
    })

    it('should reset timer when transitioning from disabled to enabled', () => {
      const onTick = vi.fn()
      let isEnabled = false

      renderHook(() =>
        useIntervalTick({
          onTick,
          enabled: () => isEnabled,
          refreshInterval: 1000,
        }),
      )

      // start disabled, advance time significantly
      vi.advanceTimersByTime(5000)
      triggerRAF()
      expect(onTick).not.toHaveBeenCalled()

      // enable the hook
      isEnabled = true
      triggerRAF()

      // immediately after enabling, onTick should not be triggered
      // because prevTime was reset
      expect(onTick).not.toHaveBeenCalled()

      // advance time by less than refreshInterval
      vi.advanceTimersByTime(500)
      triggerRAF()
      expect(onTick).not.toHaveBeenCalled()

      // advance time to meet refreshInterval from when it was enabled
      vi.advanceTimersByTime(500)
      triggerRAF()
      expect(onTick).toHaveBeenCalledTimes(1)
    })

    it('should pause and resume correctly', () => {
      const onTick = vi.fn()
      let isEnabled = true

      renderHook(() =>
        useIntervalTick({
          onTick,
          enabled: () => isEnabled,
          refreshInterval: 1000,
        }),
      )

      // first tick while enabled
      vi.advanceTimersByTime(1000)
      triggerRAF()
      expect(onTick).toHaveBeenCalledTimes(1)

      // disable
      isEnabled = false

      // advance time, should not tick
      vi.advanceTimersByTime(2000)
      triggerRAF()
      expect(onTick).toHaveBeenCalledTimes(1)

      // re-enable
      isEnabled = true
      triggerRAF()

      // should tick after refreshInterval from re-enable point
      vi.advanceTimersByTime(1000)
      triggerRAF()
      expect(onTick).toHaveBeenCalledTimes(2)
    })

    it('should keep RAF loop running even when disabled', () => {
      const onTick = vi.fn()
      let isEnabled = false
      const requestAnimationFrameSpy = vi.spyOn(
        globalThis,
        'requestAnimationFrame',
      )

      renderHook(() =>
        useIntervalTick({
          onTick,
          enabled: () => isEnabled,
          refreshInterval: 1000,
        }),
      )

      const initialCallCount = requestAnimationFrameSpy.mock.calls.length

      // trigger RAF while disabled
      triggerRAF()
      triggerRAF()

      // RAF should continue to be called even when disabled
      expect(requestAnimationFrameSpy.mock.calls.length).toBeGreaterThan(
        initialCallCount,
      )
      expect(onTick).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it.each([
      { interval: 10, description: 'very small' },
      { interval: 10_000, description: 'very large' },
    ])('should handle $description interval ($interval ms)', ({ interval }) => {
      const onTick = vi.fn()

      renderHook(() =>
        useIntervalTick({
          onTick,
          refreshInterval: interval,
        }),
      )

      // should not trigger before interval
      vi.advanceTimersByTime(interval - 1)
      triggerRAF()
      expect(onTick).not.toHaveBeenCalled()

      // should trigger at interval
      vi.advanceTimersByTime(1)
      triggerRAF()
      expect(onTick).toHaveBeenCalledTimes(1)

      // should trigger again after another interval
      vi.advanceTimersByTime(interval)
      triggerRAF()
      expect(onTick).toHaveBeenCalledTimes(2)
    })
  })
})
