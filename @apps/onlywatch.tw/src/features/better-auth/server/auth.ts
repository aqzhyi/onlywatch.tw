import 'server-only'

import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'
import { envSecretVars } from '~/envSecretVars'

export const auth = betterAuth({
  database: new Pool({
    // connectionString: `postgresql://postgres:${envSecretVars.SUPABASE_DB_PASSWORD}@db.fuehpcozvqysjdmicbow.supabase.co:5432/postgres`,
    connectionString: `postgresql://postgres.${envSecretVars.SUPABASE_PROJECT_ID}:${envSecretVars.SUPABASE_DB_PASSWORD}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`,
    user: 'postgres',
    database: 'postgres',
    connectionTimeoutMillis: 5000,
    max: 15,
    min: 2,
    query_timeout: 60000,
    statement_timeout: 60000,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  socialProviders: {
    line: {
      clientId: envSecretVars.LINE_CLIENT_ID,
      clientSecret: envSecretVars.LINE_CLIENT_SECRET,
      scope: ['openid', 'profile', 'email'],
    },
  },
  plugins: [nextCookies()],
})
