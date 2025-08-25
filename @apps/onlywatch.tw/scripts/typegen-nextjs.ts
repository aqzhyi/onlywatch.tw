#!/usr/bin/env zx
import dotenv from 'dotenv'
import { $ } from 'zx'

dotenv.config({ path: './.env.local' })

const { stdout: nextjsTypegen } = await $`next typegen`

console.info(nextjsTypegen)
