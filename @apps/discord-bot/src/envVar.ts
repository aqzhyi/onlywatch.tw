import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: '.env.local' })

export const envVar = Object.freeze(
  z
    .object({
      DISCORD_BOT_TOKEN: z.string().min(1, 'DISCORD_BOT_TOKEN is required'),
      OPENAPI_API_TOKEN: z.string().min(1, 'OPENAPI_API_TOKEN is required'),
      FF14_TNZE_API_URL: z
        .string()
        .url('FF14_TNZE_API_URL must be a valid URL'),
      FF14_UNIVERSALIS_API_URL: z
        .string()
        .url('FF14_UNIVERSALIS_API_URL must be a valid URL'),
      FF14_UNIVERSALIS_SITE_URL: z
        .string()
        .url('FF14_UNIVERSALIS_SITE_URL must be a valid URL'),
    })
    .parse(process.env),
)
