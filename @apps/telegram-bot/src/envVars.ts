import dotenv from 'dotenv'
import z from 'zod'

dotenv.config({ path: './.env.local' })

export const envVars = Object.freeze(
  z
    .object({
      NEXT_PUBLIC_SUPABASE_URL: z.string(),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
      SUPABASE_PROJECT_ID: z.string(),
      SUPABASE_SERVICE_KEY: z.string(),
      SUPABASE_DB_PASSWORD: z.string(),
      TELEGRAM_BOT_TOKEN: z.string(),
    })
    .parse(process.env),
)
