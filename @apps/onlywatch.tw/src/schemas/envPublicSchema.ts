import z from 'zod'

export const envPublicSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_GA_ID: z.string(),
  CI: z.transform((value) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return false
  }),
  CI_CORES: z.coerce.number().default(1),
})
