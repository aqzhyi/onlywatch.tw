import dedent from 'dedent'
import type { CommandMiddleware, Context } from 'grammy'

export const helpCommand: CommandMiddleware<Context> = async (ctx, next) => {
  await ctx.reply(
    dedent`
      🫡 Available Commands 👇
        \`/whoami\` # Get your user_id and username
        \`/whoami @{ChannelName}\` # Get the channel_id for specific Channel
    `,
  )
}
