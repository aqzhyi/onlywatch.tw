#!/usr/bin/env zx
import { $ } from 'zx'
import { createBrowserClient } from '@supabase/ssr'
import dotenv from 'dotenv'
import z from 'zod'
import type { Database } from '~/db/database.types'
import { envPublicSchema } from '~/schemas/envPublicSchema'
import { envSecretSchema } from '~/schemas/envSecretSchema'

/**
 * ✨ 這個腳本的目的是透過 supbase 和 zx 將所有金十資料表的中文標題，匯出為 i18n JSON 檔案，以提供後續 copilot 翻譯使用
 */

dotenv.config({ path: './.env.local' })

const env = z
  .object({
    ...envSecretSchema.shape,
    ...envPublicSchema.shape,
    NODE_ENV: z.string().default('development'),
  })
  .parse(process.env)

const supabase = createBrowserClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

/**
 * 取得所有不重複的 display_title
 *
 * @example
 *   // 輸出格式:
 *   // [
 *   //   { display_title: "美國GDP數據" },
 *   //   { display_title: "歐洲央行會議" },
 *   //   ...
 *   // ]
 *
 * @complexity 時間複雜度: O(n) - 其中 n 是資料表中的記錄數
 */
const { data: displayTitles, error } = await supabase
  .from('jin10_events')
  .select('display_title')
  .not('display_title', 'is', null)

if (error) {
  console.error('❌ 查詢失敗:', error)
  process.exit(1)
}

// 取得不重複的 display_title
const uniqueDisplayTitles = [
  ...new Set(displayTitles?.map((row) => row.display_title) || []),
].sort()

console.log(
  '📊 總共找到',
  uniqueDisplayTitles.length,
  '個不重複的 display_title:',
)
console.log('🔸', uniqueDisplayTitles.join('\n🔸 '))

/**
 * 將不重複的 display_title 寫入 JSON 檔案
 *
 * @example
 *   // 輸出檔案內容:
 *   // [
 *   //   "三個月GDP月率",
 *   //   "三個月ILO失業率",
 *   //   ...
 *   // ]
 *
 * @complexity 時間複雜度: O(n) - 其中 n 是 uniqueDisplayTitles 的長度
 */
const outputPath = './src/features/i18n/i18n.jin10.json'
const jsonContent = JSON.stringify(uniqueDisplayTitles, null, 2)

try {
  // 確保目錄存在
  await $`mkdir -p ./src/features/i18n/locales`

  // 寫入檔案
  await $`echo ${jsonContent} > ${outputPath}`

  console.log('✅ 成功寫入檔案:', outputPath)
  console.log('📁 檔案大小:', (jsonContent.length / 1024).toFixed(2), 'KB')
} catch (writeError) {
  console.error('❌ 寫入檔案失敗:', writeError)
  process.exit(1)
}
