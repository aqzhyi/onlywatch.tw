#!/usr/bin/env zx
import dotenv from 'dotenv'
import { $ } from 'zx'

dotenv.config({ path: './.env.local' })

const { stdout: genSupabaseTypesResult } =
  await $`supabase gen types typescript --project-id ${process.env.SUPABASE_PROJECT_ID} > ./src/db/database.types.ts`
