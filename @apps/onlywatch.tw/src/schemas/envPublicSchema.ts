import z from 'zod'

export const envPublicSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_GA_ID: z.string(),
})
