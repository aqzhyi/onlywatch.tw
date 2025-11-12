import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: '.env.local' })

export const envVar = Object.freeze(
  z
    .object({
      DISCORD_BOT_TOKEN: z.string().min(1, 'DISCORD_BOT_TOKEN is required'),
      OPENAPI_API_TOKEN: z.string().min(1, 'OPENAPI_API_TOKEN is required'),
    })
    .parse(process.env),
)
