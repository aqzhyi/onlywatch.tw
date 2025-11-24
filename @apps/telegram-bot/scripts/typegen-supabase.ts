#!/usr/bin/env zx
import is from '@sindresorhus/is'
import dotenv from 'dotenv'
import { writeFile } from 'node:fs/promises'
import { $ } from 'zx'

dotenv.config({ path: './.env.local' })

try {
  const { stdout: genSupabaseTypesResult } =
    await $`supabase gen types typescript --project-id ${process.env.SUPABASE_PROJECT_ID}`

  await writeFile(
    './src/(services)/database/types/index.ts',
    genSupabaseTypesResult,
    'utf8',
  )

  console.info('✅ supabase gen OK')
} catch (error: unknown) {
  if (is.error(error)) {
    console.error('❌ supabase gen failed:', error)

    if (error.message.includes('unauthorized')) {
      console.info('💡 未登入 supabase 請嘗試登入 pnpm exec supabase login')
    }
  }
}
