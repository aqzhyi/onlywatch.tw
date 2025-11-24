import { Bot } from 'grammy'
import { createTelegramActions } from '~/(services)/telegram/core/createTelegramActions'

export function createTelegramClient(props: { botToken: string }) {
  const bot = new Bot(props.botToken)
  const utils = createTelegramActions({ bot })

  return {
    bot,
    ...utils,
  }
}
