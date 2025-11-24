import { helpCommand } from '~/(features)/commands/help'
import { whoamiCommand } from '~/(features)/commands/whoami'
import { pollingCleanupPushHistory } from '~/(features)/pollings/pollingCleanupPushHistory'
import { pollingRefreshNewsFeeds } from '~/(features)/pollings/pollingRefreshNewsFeeds'
import { pollingPushNewsFeeds } from '~/(features)/pollings/pollingPushNewsFeeds'
import { bot } from '~/(services)/telegram'

bot.start({
  drop_pending_updates: true,
  onStart: () => {
    console.info('🚀 bot started')
    pollingRefreshNewsFeeds()
    pollingPushNewsFeeds()
    pollingCleanupPushHistory()

    bot.command('start', helpCommand)
    bot.command('whoami', whoamiCommand)

    bot.api.setMyCommands([
      {
        command: 'start',
        description: 'Show initial help message',
      },
      {
        command: 'whoami',
        description:
          'Get the user_id for yourself or the channel_id for a channel',
      },
    ])
  },
})

// Graceful shutdown handling
process.once('SIGINT', () => {
  console.info('⛔ Received SIGINT, stopping bot...')
  bot.stop()
})

process.once('SIGTERM', () => {
  console.info('⛔ Received SIGTERM, stopping bot...')
  bot.stop()
})
