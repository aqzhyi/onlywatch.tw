import { REST, Routes } from 'discord.js'
import { itemCommand } from '~/(features)/commands/itemCommand'
import { materiaCommand } from '~/(features)/commands/materiaCommand'
import { discordBot } from '~/(services)/bot/discordBot.ts'
import { envVar } from '~/envVar.ts'

const CHANNEL_ID = {
  ff14_market: '1458769776431202326',
} as const

discordBot.on('ready', async (client) => {
  console.info(`✅ 已登入 DISCORD: ${client.user?.tag}!`)

  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(envVar.DISCORD_BOT_TOKEN)
  const commands = [
    itemCommand.command.toJSON(),
    materiaCommand.command.toJSON(),
  ]

  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    })
    console.info('✅ 已註冊 slash commands')
  } catch (error) {
    console.error('❌ 註冊 slash commands 失敗:', error)
  }
})

discordBot.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'item') {
    await itemCommand.callback(interaction)
  }

  if (interaction.commandName === 'materia') {
    await materiaCommand.callback(interaction)
  }
})

discordBot.login(envVar.DISCORD_BOT_TOKEN)
