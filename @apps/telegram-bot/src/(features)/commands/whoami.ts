import dedent from 'dedent'
import type { CommandMiddleware, Context } from 'grammy'

export const whoamiCommand: CommandMiddleware<Context> = async (ctx) => {
  const arg = ctx.match?.trim()

  if (!arg) {
    return ctx.reply(
      dedent`
        🫡 Your
        　👉 user_id = \`${ctx.from?.id}\`
        　👉 username = @${ctx.from?.username}
      `,
    )
  }

  try {
    const chat = await ctx.api.getChat(arg)
    return ctx.reply(
      dedent`
        🫡 Channel Info
        　👉 id = \`${chat.id}\`
        　👉 username = @${chat.username || 'N/A'}
        　👉 title = ${chat.title || 'N/A'}
      `,
    )
  } catch {
    return ctx.reply(`❌ 找不到 ${arg}`)
  }
}
