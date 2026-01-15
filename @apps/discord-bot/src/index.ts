import dedent from 'dedent'
import { keyBy } from 'lodash-es'
import { itemId } from '~/(constants)/itemId'
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
      const targetItemId = itemId.get(userMessage)

      const searching = await message.reply(
        `🔍1️⃣ 搜尋目標關鍵字之、物品市價...`,
      )

      const {
        /** 目標物品市價 */
        data: targetItemPriceData,
      } = await universalisApp.findManyItemsPrice([targetItemId || 0])

      await searching.edit(`🔍2️⃣ 搜尋目標關鍵字之、配方...`)

      /** 搜尋配方 */
      const { data: foundRecipes } = await tnzeApp.searchRecipes(userMessage)

      if (!targetItemId && !foundRecipes?.length) {
        await searching.edit(`🔍❌ 找不到相關物品或者配方: ${userMessage}`)
        return
      }

      /** 如果該物品具有生產配方 */
      if (foundRecipes?.length) {
        /** 處理前 N 個配方 */
        for await (const recipe of foundRecipes.slice(0, 2)) {
          const item = targetItemPriceData?.results.at(0)
          const itemNqPrice = item?.nq.averageSalePrice.region?.price || 0
          const itemHqPrice = item?.hq.averageSalePrice.region?.price || 0

          await searching.edit(`🔍3️⃣ 搜尋配方所需材料...`)

          /** 配方所需材料 */
          const { data: recipeItems } = await tnzeApp.findOneRecipeItems(
            recipe.id,
          )

          /** 情況 A: 有配方 - 顯示材料成本分析 */
          if (recipeItems && recipeItems.length > 0) {
            await searching.edit(`🔍4️⃣ 搜尋材料成本市價...`)

            const materialIds = recipeItems.map(([itemId]) => itemId)
            const { data: materialsData } =
              await universalisApp.findManyItemsPrice(materialIds)
            const materialPriceMap = keyBy(materialsData?.results, 'itemId')

            await searching.edit(`🔍5️⃣ 正在總結...`)

            let totalMaterialCost = 0

            const materialInfos = await Promise.all(
              recipeItems.map(async ([itemId, itemAmount]) => {
                const { data: itemInfo } = await tnzeApp.findOneItemInfo(itemId)
                const price =
                  materialPriceMap[itemId]?.nq.averageSalePrice.region?.price ||
                  0
                const totalPrice = price * itemAmount
                totalMaterialCost += totalPrice

                return `- ${itemAmount} x ${itemInfo?.name || '__無資訊__'} (均價 NQ ${price.toFixed(0)}g) = 小計 ${totalPrice.toFixed(0)}g`
              }),
            )

            const costPerItem = totalMaterialCost / recipe.item_amount
            const profitNq = itemNqPrice - costPerItem
            const profitHq = itemHqPrice - costPerItem

            await message.reply(
              dedent`
                ## 🎨 **${recipe.item_name}** 🛠️ ${recipe.job}配方(\`rlv ${recipe.rlv}\`)

                ### 📦 需求材料
                ${materialInfos.join('\n')}

                ### 💰 成本與利潤分析
                - 材料總成本: ${totalMaterialCost.toFixed(0)}g
                - 配方產出數量: x${recipe.item_amount}
                - **單件成本: ${costPerItem.toFixed(0)}g**

                ### 📊 市場售價
                - 成品NQ均價: ${itemNqPrice.toFixed(0)}g (利潤: ${profitNq > 0 ? '+' : ''}${profitNq.toFixed(0)}g)
                - 成品HQ均價: ${itemHqPrice.toFixed(0)}g (利潤: ${profitHq > 0 ? '+' : ''}${profitHq.toFixed(0)}g)
              `,
            )
          }
        }
      } else {
        const item = targetItemPriceData?.results.at(0)
        const itemNqPrice = item?.nq.averageSalePrice.region?.price || 0
        const itemHqPrice = item?.hq.averageSalePrice.region?.price || 0

        /** 情況 B: 無配方 - 僅顯示物品價格 */
        await searching.edit(`🔍✅ 查詢完成`)

        await message.reply(
          dedent`
            ## 🎨 **${userMessage}**

            ### 📊 市場售價
            - NQ均價: ${itemNqPrice.toFixed(0)}g
            - HQ均價: ${itemHqPrice.toFixed(0)}g

            ℹ️ 此物品無配方資料（可能為裝備、樂譜、寵物等）
          `,
        )
      }

      await searching.delete()
    }
  } catch (error) {
    await message.reply(
      `❌ 發生錯誤，請過15秒以上之後再嘗試: ${(error as Error).message}`,
    )
  }
})

discordBot.login(envVar.DISCORD_BOT_TOKEN)
