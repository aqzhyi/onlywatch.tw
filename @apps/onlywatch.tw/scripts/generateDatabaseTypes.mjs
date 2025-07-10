#!/usr/bin/env zx
import 'dotenv/config'
import { $ } from 'zx'

const { stdout: genSupabaseTypesResult } =
  await $`supabase gen types typescript --project-id ${process.env.SUPABASE_PROJECT_ID} > ./src/db/database.types.ts`
