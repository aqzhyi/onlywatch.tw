import dedent from 'dedent'
import { keyBy } from 'lodash-es'
import { discordBot } from '~/(services)/bot/discordBot.ts'
import { tnzeApp } from '~/(services)/tnze/tnzeApp'
import { universalisApp } from '~/(services)/universalis/universalisApp'
import { envVar } from '~/envVar.ts'

const CHANNEL_ID = {
  ff14_market: '1458769776431202326',
} as const

discordBot.on('ready', (client) => {
  console.info(`✅ 已登入 DISCORD: ${client.user?.tag}!`)
})

discordBot.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return
    if (message.channelId === CHANNEL_ID.ff14_market) {
      const userMessage = message.content.trim()
      const { data: foundRecipes } = await tnzeApp.searchRecipe(userMessage)

      const searching = await message.reply(`🔍1️⃣ 搜尋配方 ing...`)

      /**
       * 查詢 ff14 生產系配方所需要的物品材料與數量
       */
      if (!foundRecipes?.length) {
        await searching.edit(`🔍❌ 找不到配方: ${userMessage}`)
      } else if (foundRecipes) {
        for await (const recipe of foundRecipes.slice(0, 2)) {
          await searching.edit(`🔍2️⃣ 搜尋配方所需材料...`)
          const { data: recipeItems, error: recipeItemsError } =
            await tnzeApp.findOneRecipeItems(recipe.id)

          if (!recipeItems) continue

          await searching.edit(`🔍3️⃣ 搜尋成品物價...`)

          /** 該配方之成品市價 */
          const { data: recipeData } = await universalisApp.findManyItemsPrice([
            recipe.item_id,
          ])
          const recipeItemNqPrice =
            recipeData?.results.at(0)?.nq.averageSalePrice.region?.price || 0
          const recipeItemHqPrice =
            recipeData?.results.at(0)?.hq.averageSalePrice.region?.price || 0

          let totalRecipePrice = 0

          /** 額外查詢每個材料的市價 */
          const _itemIds =
            recipeItems?.map(([itemId, itemAmount]) => itemId) || []

          await searching.edit(
            `🔍4️⃣ 搜尋材料成本物價... ID:${_itemIds.join(',')}`,
          )

          const { data } = await universalisApp.findManyItemsPrice(_itemIds)
          const itemPrice = keyBy(data?.results, 'itemId')

          await searching.edit(`🔍5️⃣ 正在總結...`)

          const itemInfos = await Promise.all(
            recipeItems.map(async ([itemId, itemAmount]) => {
              const { data: itemInfo } = await tnzeApp.findOneItemInfo(itemId)

              const price =
                itemPrice[itemId]?.nq.averageSalePrice.region?.price || 0
              const totalPrice = price ? price * itemAmount : 0

              totalRecipePrice += totalPrice

              return `${itemAmount} x ${itemInfo?.name || '__無資訊__'} (均價 NQ ${`${price.toFixed(0)}g` || '__無資訊__'}) = 小計 ${`${totalPrice.toFixed(0)}g` || '__無資訊__'}`
            }),
          )

          await message.reply(
            dedent`
            ## 🎨 **${recipe.item_name}** 🛠️ ${recipe.job}配方(\`rlv ${recipe.rlv}\`) 📦 需求材料 ＝ \n${itemInfos.join('\n')}
            單件成品NQ市價約 ${recipeItemNqPrice.toFixed(0)}g
            單件成品HQ市價約 ${recipeItemHqPrice.toFixed(0)}g
            ---
            合計材料成本約 ${totalRecipePrice.toFixed(0)}g ÷ 產出x${recipe.item_amount}
            = 單件成本 ${(totalRecipePrice / recipe.item_amount).toFixed(0)}g
          `,
          )

          await searching.delete()
        }
      }
    }
  } catch (error) {
    await message.reply(
      `❌ 發生錯誤，請過15秒以上之後再嘗試: ${(error as Error).message}`,
    )
  }
})

discordBot.login(envVar.DISCORD_BOT_TOKEN)
