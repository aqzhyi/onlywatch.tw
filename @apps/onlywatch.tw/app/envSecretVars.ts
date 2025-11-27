import 'server-only'

import z from 'zod'
import { envPublicSchema } from '~/schemas/envPublicSchema'
import { envSecretSchema } from '~/schemas/envSecretSchema'

export const envSecretVars = Object.freeze(
  z
    .object({ ...envSecretSchema.shape, ...envPublicSchema.shape })
    .readonly()
    .parse(process.env),
)
