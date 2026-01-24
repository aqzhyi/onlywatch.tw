import dedent from 'dedent'
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { keyBy } from 'lodash-es'
import { itemId } from '~/(constants)/itemId'
import { toUniversalisLink } from '~/(features)/markdown/toUniversalisLink'
import { tnzeApp } from '~/(services)/tnze/tnzeApp'
import { universalisApp } from '~/(services)/universalis/universalisApp'

export const itemCommand = {
  command: new SlashCommandBuilder()
    .setName('item')
    .setDescription('總結指定物品配方與行情')
    .addStringOption((option) =>
      option.setName('物品名稱').setDescription('物品名稱').setRequired(true),
    ),
  callback: async function handleItemCommand(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const itemName = interaction.options
      .getString('物品名稱', true)
      .trim()
      .replaceAll('', '')

    const targetItemId = itemId.get(itemName) || null
    const targetItemName = targetItemId ? itemName : null

    const result = await interaction.reply(`🔍1️⃣ 搜尋物品與配方...`)

    const {
      /** 目標物品的相關生產配方 */
      data: foundRecipes,
    } = await tnzeApp.searchRecipes(itemName)

    /** 目標物品的生產配方 */
    const targetRecipe =
      foundRecipes?.find((recipe) => recipe.item_name === itemName) || null

    if (!targetItemId && !targetItemName && !targetRecipe) {
      await result.edit(`🔍❌ 找不到相關物品與配方: \`${itemName}\``)
      return
    }

    await result.edit(`🔍2️⃣ 搜尋物品市價與銷量...`)

    /** 該物品販售 */
    const targatItemPricingData = {
      nqSaleVelocity: 0,
      hqSaleVelocity: 0,
      nqSalePrice: 0,
      hqSalePrice: 0,
    }

    if (targetItemId) {
      const {
        /** 目標物品市價 */
        data: targetItemPriceData,
      } = await universalisApp.findManyItemsPrice([targetItemId])

      const {
        /** 目標物品銷售歷史 */
        data: targetItemSaleHistory,
      } = await universalisApp.findItemSaleHistory([targetItemId])

      targatItemPricingData.nqSaleVelocity =
        targetItemSaleHistory?.nqSaleVelocity || 0

      targatItemPricingData.hqSaleVelocity =
        targetItemSaleHistory?.hqSaleVelocity || 0

      targatItemPricingData.hqSalePrice =
        targetItemPriceData?.results.at(0)?.hq.averageSalePrice.region?.price ||
        0
      targatItemPricingData.nqSalePrice =
        targetItemPriceData?.results.at(0)?.nq.averageSalePrice.region?.price ||
        0
    }

    /** 如果該物品具有生產配方 */
    if (targetRecipe) {
      /** 處理前 N 個配方 */
      const itemHqPrice = targatItemPricingData.hqSalePrice
      const itemNqPrice = targatItemPricingData.nqSalePrice
      const itemHqSaleVelocity = targatItemPricingData.hqSaleVelocity
      const itemNqSaleVelocity = targatItemPricingData.nqSaleVelocity

      await result.edit(`🔍4️⃣ 搜尋配方所需材料...`)

      const {
        /** 配方所需材料 */
        data: recipeItems,
      } = await tnzeApp.findOneRecipeItems(targetRecipe.id)

      /** 情況 A: 有配方 - 顯示材料成本分析 */
      if (recipeItems && recipeItems.length > 0) {
        await result.edit(`🔍4️⃣ 搜尋材料成本市價...`)

        const materialIds = recipeItems.map(([itemId]) => itemId)
        const { data: materialsData } =
          await universalisApp.findManyItemsPrice(materialIds)
        const materialPriceMap = keyBy(materialsData?.results, 'itemId')

        await result.edit(`🔍5️⃣ 正在總結...`)

        let totalHqMaterialCost = 0
        let totalNqMaterialCost = 0

        const materialInfos = await Promise.all(
          recipeItems.map(async ([itemId, itemAmount]) => {
            const { data: itemInfo } = await tnzeApp.findOneItemInfo(itemId)
            const nqPrice =
              materialPriceMap[itemId]?.nq.averageSalePrice.region?.price || 0
            const HqPrice =
              materialPriceMap[itemId]?.hq.averageSalePrice.region?.price || 0
            const totalNqPrice = nqPrice * itemAmount
            const totalHqPrice = HqPrice * itemAmount
            totalNqMaterialCost += totalNqPrice
            totalHqMaterialCost += totalHqPrice

            if (totalNqPrice > 0 && totalHqPrice > 0) {
              return `- ${itemAmount} **x** ${nqPrice.toFixed(0).padStart(7, ' ')}g　${toUniversalisLink(itemInfo?.name || '__無資訊__')}　~= ${totalNqPrice.toFixed(0)}g　**|**　✨ ${itemAmount} **x** HQ ~= ${totalHqPrice.toFixed(0)}g`
            }
            return `- ${itemAmount} **x** ${nqPrice.toFixed(0).padStart(7, ' ')}g　${toUniversalisLink(itemInfo?.name || '__無資訊__')}　~= ${totalNqPrice.toFixed(0)}g`
          }),
        )

        const nqCostPerItem = totalNqMaterialCost / targetRecipe.item_amount
        const hqCostPerItem = totalHqMaterialCost / targetRecipe.item_amount
        const nqProfit = itemNqPrice - nqCostPerItem
        const hqProfit = itemHqPrice - hqCostPerItem

        await result.edit(
          dedent`
            # 🎨 **${toUniversalisLink(targetRecipe.item_name)}**
            > ${targetRecipe.job}配方(\`rlv ${targetRecipe.rlv}\`)

            ## 📦 需求材料
            ${materialInfos.join('\n')}

            ## 💰 成本
            - 採用 NQ 材料生產成本 ~= ${totalNqMaterialCost.toFixed(0)}g
            - ÷ 配方產出量: x${targetRecipe.item_amount}
            - ~= **單件 NQ 材料成本: ${nqCostPerItem.toFixed(0)}g**

            ## 📊 市場售價與利潤分析
            - 📦 NQ市價 ${itemNqPrice.toFixed(0)}g (使用 NQ 材料利潤: ${nqProfit > 0 ? '+' : ''}${nqProfit.toFixed(0)}g) / 平均銷量: ${itemNqSaleVelocity.toFixed(2)}
            - ✨ HQ市價 ${itemHqPrice.toFixed(0)}g (使用 NQ 材料利潤: ${nqProfit > 0 ? '+' : ''}${nqProfit.toFixed(0)}g) / 平均銷量: ${itemHqSaleVelocity.toFixed(2)}
          `,
        )
      }
    } else {
      const itemHqPrice = targatItemPricingData.hqSalePrice
      const itemNqPrice = targatItemPricingData.nqSalePrice
      const itemHqSaleVelocity = targatItemPricingData.hqSaleVelocity
      const itemNqSaleVelocity = targatItemPricingData.nqSaleVelocity

      /** 情況 B: 無配方 - 僅顯示物品價格 */
      await result.edit(`🔍✅ 查詢完成`)

      await result.edit(
        dedent`
          ## 🎨 **${toUniversalisLink(itemName)}**

          ### 📊 市場售價
          - NQ 市價: ${itemNqPrice.toFixed(0)}g / 日平均銷量: ${itemNqSaleVelocity.toFixed(2)}
          - HQ 市價: ${itemHqPrice.toFixed(0)}g / 日平均銷量: ${itemHqSaleVelocity.toFixed(2)}

          ℹ️ 此物品無配方資料（可能為裝備、樂譜、寵物等）
        `,
      )
    }
  },
}
