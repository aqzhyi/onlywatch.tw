#!/usr/bin/env zx
import is from '@sindresorhus/is'
import dotenv from 'dotenv'
import { $ } from 'zx'

dotenv.config({ path: './.env.local' })

try {
  const dbUrl = `postgresql://postgres.${process.env.SUPABASE_PROJECT_ID}:${process.env.SUPABASE_DB_PASSWORD}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`

  const { stdout: genSupabaseTypesResult } =
    await $`pnpm exec supabase gen types typescript --db-url ${dbUrl} > ./app/db/database.types.ts`

  console.info(genSupabaseTypesResult || 'supabase gen OK')
} catch (error) {
  if (is.error(error)) {
    console.error('❌ supabase gen failed:', error)

    if (error.message.includes('unauthorized')) {
      console.info('💡 未登入 supabase 請嘗試登入 pnpm exec supabase login')
    }
  }
}
