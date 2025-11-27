import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useMatchMedia } from '~/hooks/useMatchMedia'

vi.mock('~/utils/isClientSide', () => ({
  get isClientSide() {
    return true
  },
}))

describe('useMatchMedia', () => {
  let mockMediaQueryList: {
    matches: boolean
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    Object.defineProperty(globalThis, 'window', {
      value: {
        matchMedia: vi.fn(() => mockMediaQueryList),
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('預設斷點測試', () => {
    test.each([
      // [斷點名稱, 預期媒體查詢, matches值, 預期結果]
      ['sm', '(min-width: 40rem)', true, true],
      ['md', '(min-width: 48rem)', false, false],
      ['lg', '(min-width: 64rem)', true, true],
      ['xl', '(min-width: 80rem)', false, false],
      ['2xl', '(min-width: 96rem)', true, true],
    ] as const)(
      '應該正確處理 %s 斷點 %s / %s',
      (breakpoint, expectedQuery, mockMatches, expectedResult) => {
        mockMediaQueryList.matches = mockMatches

        const { result } = renderHook(() => useMatchMedia(breakpoint))

        expect(globalThis.window.matchMedia).toHaveBeenCalledWith(expectedQuery)
        expect(result.current).toBe(expectedResult)
      },
    )
  })

  describe('記憶體洩漏', () => {
    test('傳入引數已改變，應該清理舊的監聽器', () => {
      const { rerender } = renderHook(
        ({ query }: { query: string }) => useMatchMedia(query),
        { initialProps: { query: 'sm' } },
      )

      // 獲取第一次調用的 AbortSignal
      const firstCall = mockMediaQueryList.addEventListener.mock.calls[0]
      const firstAbortSignal = (
        firstCall?.[2] as { signal: AbortSignal } | undefined
      )?.signal
      expect(firstAbortSignal?.aborted).toBe(false)

      // 重新渲染並改變查詢
      rerender({ query: 'md' })

      // 舊的 AbortSignal 應該被中止
      expect(firstAbortSignal?.aborted).toBe(true)

      // 檢查新的事件監聽器被添加
      expect(
        mockMediaQueryList.addEventListener.mock.calls.length,
      ).toBeGreaterThan(1)
    })
  })
})
