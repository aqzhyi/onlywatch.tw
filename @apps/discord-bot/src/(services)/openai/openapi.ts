import OpenAI from 'openai'
import { envVar } from '~/envVar.ts'

export const openapi = new OpenAI({
  apiKey: envVar.OPENAPI_API_TOKEN,
})
