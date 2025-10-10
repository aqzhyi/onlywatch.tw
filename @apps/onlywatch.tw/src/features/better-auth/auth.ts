import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { admin, anonymous } from 'better-auth/plugins'
import { Pool } from 'pg'
import { envSecretVars } from '~/envSecretVars'

export const auth = betterAuth({
  database: new Pool({
    connectionString: `postgresql://postgres.${envSecretVars.SUPABASE_PROJECT_ID}:${envSecretVars.SUPABASE_DB_PASSWORD!}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`,
  }),
  socialProviders: {
    line: {
      clientId: envSecretVars.LINE_CLIENT_ID,
      clientSecret: envSecretVars.LINE_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies(), admin(), anonymous()],
})
