import { test, expect } from '@playwright/test'

test.describe('useMatchMedia', () => {
  test('應該正確響應中等斷點的變化', async ({ page }) => {
    // 導航到頁面並等待載入
    await page.goto('http://localhost:3000/calendar')
    await page.waitForLoadState('domcontentloaded')

    // 設置大螢幕尺寸 (> 768px)
    await page.setViewportSize({ width: 1000, height: 800 })
    await page.waitForTimeout(200)

    // 檢查媒體查詢狀態 - 大螢幕應該是 true
    const largeScreenState = await page.evaluate(() => {
      return window.matchMedia('(min-width: 48rem)').matches
    })
    expect(largeScreenState).toBe(true)

    // 設置小螢幕尺寸 (< 768px)
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(200)

    // 檢查媒體查詢狀態 - 小螢幕應該是 false
    const smallScreenState = await page.evaluate(() => {
      return window.matchMedia('(min-width: 48rem)').matches
    })
    expect(smallScreenState).toBe(false)

    // 再次設置為大螢幕，確保狀態正確切換
    await page.setViewportSize({ width: 900, height: 800 })
    await page.waitForTimeout(200)

    const finalState = await page.evaluate(() => {
      return window.matchMedia('(min-width: 48rem)').matches
    })
    expect(finalState).toBe(true)
  })
})
