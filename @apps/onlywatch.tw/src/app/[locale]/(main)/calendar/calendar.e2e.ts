import { test, expect, type Page } from '@playwright/test'

test.describe('篩選', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar')
  })

  test('打開抽屜與關閉抽屜', async ({ page }) => {
    await openDrawer(page)
    await closeDrawer(page)
  })

  test('在提交篩選字串時更新 URL params', async ({ page }) => {
    await openDrawer(page)
    await page.getByTestId('篩選關鍵字輸入框').fill('USD')
    await submitFilter(page)
    await expect(page).toHaveURL(/\/calendar\/query\/USD/)

    // 重新打開抽屜 (在手機版會自動關閉)
    await openDrawer(page)
    await page.getByTestId('篩選關鍵字輸入框').fill('USD JPY')
    await submitFilter(page)
    await expect(page).toHaveURL(/\/calendar\/query\/USD%20JPY/)

    // 重新打開抽屜並清空搜尋
    await openDrawer(page)
    await page.getByTestId('篩選關鍵字輸入框').fill('')
    await submitFilter(page)
    await expect(page).toHaveURL(/\/calendar$/)

    // 重新打開抽屜測試其他關鍵字
    await openDrawer(page)
    await page.getByTestId('篩選關鍵字輸入框').fill('CAD')
    await submitFilter(page)
    await expect(page).toHaveURL(/\/calendar\/query\/CAD/)
    await closeDrawer(page)
  })

  test('在點擊「清除文字按鈕」時清除字串', async ({ page }) => {
    await openDrawer(page)
    await page.getByTestId('篩選關鍵字輸入框').fill('非農 利率決議 CPI PCE')

    // 不需要提交，直接測試清除按鈕
    await expect(page.getByTestId('篩選關鍵字輸入框')).toHaveValue(
      '非農 利率決議 CPI PCE',
    )

    // HeroUI Input 的清除按鈕沒有特定的 testId，所以使用其他方式清除
    // 方法1: 使用按鍵清除
    await page.getByTestId('篩選關鍵字輸入框').selectText()
    await page.keyboard.press('Delete')

    await expect(page.getByTestId('篩選關鍵字輸入框')).toHaveValue('')
    await closeDrawer(page)
  })
})

async function openDrawer(page: Page) {
  // 檢查抽屜是否已經打開
  const isVisible = await page.getByTestId('篩選關鍵字輸入框').isVisible()

  if (!isVisible) {
    await page.getByTestId('篩選抽屜打開按鈕').click()
  }

  await expect(page.getByTestId('篩選關鍵字輸入框')).toBeVisible()
}

async function closeDrawer(page: Page) {
  // 嘗試按 ESC 鍵關閉抽屜
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('篩選關鍵字輸入框')).toBeHidden()
}

async function submitFilter(page: Page) {
  // 使用按鈕點擊提交表單，這更接近實際用戶行為
  await page.getByTestId('篩選關鍵字送出按鈕').click()

  // 等待導航完成
  await page.waitForLoadState('networkidle')
}
