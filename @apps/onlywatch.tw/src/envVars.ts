import z from 'zod'

export const envVars = Object.freeze(
  z
    .object({
      NEXT_PUBLIC_BASE_URL: z.string(),
      NEXT_PUBLIC_SUPABASE_KEY: z.string(),
      SUPABASE_PROJECT_ID: z.string(),
      SUPABASE_SERVICE_ROLE_KEY: z.string(),
      SUPABASE_DB_URL: z.string(),
      JIN10_API_URL: z.string(),
      JIN10_APP_ID: z.string(),
      JIN10_HEADER_ORIGIN: z.string(),
      GA_ID: z.string(),
    })
    .readonly()
    .parse(process.env),
)
