import { envPublicSchema } from '~/schemas/envPublicSchema'

export const envPublicVars = Object.freeze(envPublicSchema.parse(process.env))
