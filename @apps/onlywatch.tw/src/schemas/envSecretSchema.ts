import z from 'zod'

export const envSecretSchema = z.object({
  SUPABASE_PROJECT_ID: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),
  JIN10_API_URL: z.string(),
  JIN10_APP_ID: z.string(),
  JIN10_HEADER_ORIGIN: z.string(),
})
