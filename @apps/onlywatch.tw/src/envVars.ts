import 'server-only'

import z from 'zod'

export const envVars = Object.freeze(
  z
    .object({
      NODE_ENV: z.enum(['development', 'production', 'test']),
      NEXT_PUBLIC_SUPABASE_URL: z.string(),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
      NEXT_PUBLIC_GA_ID: z.string(),
      SUPABASE_PROJECT_ID: z.string(),
      SUPABASE_SERVICE_KEY: z.string(),
      JIN10_API_URL: z.string(),
      JIN10_APP_ID: z.string(),
      JIN10_HEADER_ORIGIN: z.string(),
    })
    .readonly()
    .parse(process.env),
)
