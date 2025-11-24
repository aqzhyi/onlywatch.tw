import { createTelegramClient } from '~/(services)/telegram/core/createTelegramClient'
import { envVars } from '~/envVars'

export const { bot } = createTelegramClient({
  botToken: envVars.TELEGRAM_BOT_TOKEN,
})
