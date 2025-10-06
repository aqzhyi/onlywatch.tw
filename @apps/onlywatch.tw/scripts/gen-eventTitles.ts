#!/usr/bin/env zx
import { $ } from 'zx'
import { createBrowserClient } from '@supabase/ssr'
import dotenv from 'dotenv'
import z from 'zod'
import type { Database } from '~/db/database.types'
import { envPublicSchema } from '~/schemas/envPublicSchema'
import { envSecretSchema } from '~/schemas/envSecretSchema'
import { constants } from '~/features/jin10/constants'

/**
 * ✨ 這個腳本透過撈出有在資料庫的「事件」之所有中文標題，匯出為 i18n JSON 檔案，提供後續 copilot 翻譯使用
 */

dotenv.config({ path: './.env.local' })

const OUTPUT_PATH = './src/features/i18n'
const OUTPUT_LOCALE_PATH = `${OUTPUT_PATH}/locales`
const OUTPUT_BASE_FILE = `${OUTPUT_PATH}/eventTitles.base.json`

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
 *   // data returns:
 *   // [
 *   //   { display_title: "美國GDP數據" },
 *   //   { display_title: "歐洲央行會議" },
 *   //   ...
 *   // ]
 */
const { data, error } = await supabase
  .from('jin10_events')
  .select('display_title')
  .order('display_title', { ascending: true })
  .not('display_title', 'is', null)

if (error) {
  console.error('❌ 查詢失敗:', error)
  process.exit(1)
}

/**
 * @prompt
 *  - 從 {@link data} 取得所有 display_title
 *  - 每個 display_title 皆會經過 `constants.financialTermDict` 的關鍵字替換
 */
const displayTitles: Map<string, string> = new Map(
  data?.map((item) => {
    let title = item.display_title || ''

    // 進行關鍵字替換
    Object.entries(constants.financialTermDict).forEach(([, value]) => {
      title = title.replace(value.from, value.to) || ''
    })

    return [title, title]
  }) || [],
)

console.log('📊 總共找到', displayTitles.size, '個不重複的 display_title:')
console.log('🔸', Array.from(displayTitles.values()).join('\n🔸 '))

/**
 * @prompt
 * - 將 {@link displayTitles} 轉成物件，例如 { "title1": "title1", "title2": "title2", ... }
 */
const jsonContent = JSON.stringify(Object.fromEntries(displayTitles), null, 2)

try {
  // 確保目錄存在
  await $`mkdir -p ${OUTPUT_LOCALE_PATH}`

  // 寫入檔案
  await $`echo ${jsonContent} > ${OUTPUT_BASE_FILE}`

  console.log('✅ 成功寫入檔案:', OUTPUT_BASE_FILE)
  console.log('📁 檔案大小:', (jsonContent.length / 1024).toFixed(2), 'KB')
} catch (writeError) {
  console.error('❌ 寫入檔案失敗:', writeError)
  process.exit(1)
}
