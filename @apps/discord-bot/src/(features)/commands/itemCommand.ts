import dedent from 'dedent'
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { calcWeightedAvgPrice } from '~/(features)/commands/calcWeightedAvgPrice'
import { toUniversalisLink } from '~/(features)/markdown/toUniversalisLink'
import { teamcraftApp } from '~/(services)/teamcraft/teamcraftApp'
import { universalisApp } from '~/(services)/universalis/universalisApp'

const fmtPrice = (value: number) => value.toFixed(0).padStart(7, ' ')

/**
 * 這個指令允許使用者查詢指定物品的市場資訊，並提供配方材料成本分析（若有配方）與利潤評估。
 *
 * ## 具體功能
 *
 * 當使用者輸入 `/item 收藏用魔匠藥液` 之後，機器人應回應以下資訊：
 *
 * 1. {物品名稱} - 顯示物品名稱，並連結到 Universalis 該物品的頁面。
 * 2. {HQ物品均價} - 從 Universalis 取得前30000個該物品之價格與數量來計算{平均單件售價}。
 * 3. {NQ物品均價} - 從 Universalis 取得前30000個該物品之價格與數量來計算{平均單件售價}。
 * 4. {配方表} - 若物品存在生產配方，則列出配方所需的所有子材料以樹狀結構呈現。若無配方，則以關鍵字 `ff14 {物品名稱}` 超連結到 google
 *    search。
 *
 * ## {平均單件售價}公式
 *
 * ### 假設1
 *
 * - 第1列價格835、數量30。
 * - 第2列價格835、數量30。
 * - 第3列價格835、數量99。
 * - 第4列價格850、數量10。
 * - 第5列價格900、數量66。
 *
 * 則平均單件售價 = ((835 * 30) + (835 * 30) + (835 * 99) + (850 * 10) + (900 * 66)) /
 * (30 + 30 + 99 + 10 + 66) ≈ 853.89g
 *
 * ### 假設2
 *
 * - 第1列價格5、數量3000。
 * - 第2列價格6、數量1000。
 * - 第3列價格10、數量9999。
 * - 第4列價格11、數量3000。
 * - 第5列價格20、數量600。
 *
 * 則平均單件售價 = ((5 * 3000) + (6 * 1000) + (10 * 9999) + (11 * 3000) + (20 * 600))
 * / (3000 + 1000 + 9999 + 3000 + 600) ≈ 10.03g
 */
export const itemCommand = {
  command: new SlashCommandBuilder()
    .setName('item')
    .setDescription('查詢物品')
    .addStringOption((option) =>
      option.setName('物品名稱').setDescription('物品名稱').setRequired(true),
    ),
  callback: async function handleItemCommand(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    try {
      const itemName = interaction.options
        .getString('物品名稱', true)
        .trim()
        .replaceAll('', '')

      const result = await interaction.reply(`🔍1️⃣ 搜尋物品與配方...`)

      /** 目標物品的生產配方 */
      const targetRecipe = await teamcraftApp.searchRecipes(itemName)

      /** 目標物品的 Universalis item ID（由 Teamcraft tw-items.json 查詢） */
      const targetItemId = await teamcraftApp.findItemId(itemName)

      if (!targetItemId && !targetRecipe) {
        await result.edit(`🔍❌ 找不到相關物品與配方: \`${itemName}\``)
        return
      }

      await result.edit(`🔍2️⃣ 搜尋物品市價與銷量...`)

      const targetItemPricing = {
        nqSaleVelocity: 0,
        hqSaleVelocity: 0,
        nqSalePrice: 0,
        hqSalePrice: 0,
      }

      if (targetItemId) {
        const { data } = await universalisApp.findManyItemsCurrentPrice(
          [targetItemId],
          { listings: 30000 },
        )

        if (data && !('items' in data)) {
          targetItemPricing.nqSaleVelocity = data.nqSaleVelocity
          targetItemPricing.hqSaleVelocity = data.hqSaleVelocity
          targetItemPricing.nqSalePrice = calcWeightedAvgPrice(
            data.listings ?? [],
            false,
          )
          targetItemPricing.hqSalePrice = calcWeightedAvgPrice(
            data.listings ?? [],
            true,
          )
        }
      }

      /** 情況 A: 有配方 - 顯示材料成本分析 */
      if (targetRecipe) {
        const itemHqPrice = targetItemPricing.hqSalePrice
        const itemNqPrice = targetItemPricing.nqSalePrice
        const itemHqSaleVelocity = targetItemPricing.hqSaleVelocity
        const itemNqSaleVelocity = targetItemPricing.nqSaleVelocity

        await result.edit(`🔍3️⃣ 搜尋配方所需材料...`)

        const recipeIngredients = await teamcraftApp.findRecipeIngredients(
          targetRecipe.resultItemId,
        )

        if (recipeIngredients.length > 0) {
          await result.edit(`🔍4️⃣ 搜尋材料成本市價...`)

          const materialIds = recipeIngredients.map(({ id }) => id)
          const { data: materialsData } =
            await universalisApp.findManyItemsCurrentPrice(materialIds, {
              listings: 30000,
            })

          await result.edit(`🔍5️⃣ 正在總結...`)

          let totalHqMaterialCost = 0
          let totalNqMaterialCost = 0

          const materialInfos = await Promise.all(
            recipeIngredients.map(async ({ id: matId, amount: itemAmount }) => {
              const materialName = await teamcraftApp.findItemName(matId)

              const matData =
                materialsData && 'items' in materialsData
                  ? materialsData.items[String(matId)]
                  : null

              const nqPrice = matData?.averagePriceNQ ?? 0
              const hqPrice = matData?.averagePriceHQ ?? 0
              const hqCostPrice = hqPrice > 0 ? hqPrice : nqPrice

              const totalNqPrice = nqPrice * itemAmount
              const totalHqCostPrice = hqCostPrice * itemAmount
              totalNqMaterialCost += totalNqPrice
              totalHqMaterialCost += totalHqCostPrice

              const materialLink = toUniversalisLink(
                materialName ?? '__無資訊__',
                matId,
              )

              if (hqPrice > 0) {
                return `- \`${fmtPrice(hqPrice)}\`💰💖 **x** \`${itemAmount}\`📦　${materialLink}　小計 \`${totalHqCostPrice.toFixed(0)}\`💰`
              }
              return `- \`${fmtPrice(nqPrice)}\`💰🩶 **x** \`${itemAmount}\`📦　${materialLink}　小計 \`${totalNqPrice.toFixed(0)}\`💰`
            }),
          )

          const nqCostPerItem = totalNqMaterialCost / targetRecipe.yields
          const hqCostPerItem = totalHqMaterialCost / targetRecipe.yields
          const nqProfit = itemNqPrice - nqCostPerItem
          const hqProfit = itemHqPrice - hqCostPerItem

          await result.edit(
            dedent`
            ## 📦 **${toUniversalisLink(targetRecipe.resultItemName, targetRecipe.resultItemId)}**
            > ${targetRecipe.jobName}配方(\`rlv ${targetRecipe.rlvl}\`)

            ### 📊 平均單件售價

            - 💖 HQ 高品: ${itemHqPrice.toFixed(0)}💰
            - 🩶 NQ 低品: ${itemNqPrice.toFixed(0)}💰

            ### 🎨 生產配方材料
            ${materialInfos.join('\n')}
            - 單次生產成本 ~= \`${fmtPrice(totalNqMaterialCost)}\`💰 ÷ 產出量: **x**\`${targetRecipe.yields}\`📦
            - 約 ~= **單件**成品成本: \`${fmtPrice(totalNqMaterialCost / targetRecipe.yields)}\`💰
          `,
          )
        }

        return
      }

      /** 情況 B: 無配方 - 僅顯示物品價格 */
      const itemHqPrice = targetItemPricing.hqSalePrice
      const itemNqPrice = targetItemPricing.nqSalePrice
      const googleSearchLink = `[查看更多](<https://www.google.com/search?q=${encodeURIComponent('ff14 ' + itemName)}>)`

      await result.edit(
        dedent`
        ## 📦 **${toUniversalisLink(itemName, targetItemId)}**
        > 無配方 - ${googleSearchLink}

        ### 📊 平均單件售價

        - 💖 HQ 高品: \`${fmtPrice(itemHqPrice)}\`💰
        - 🩶 NQ 低品: \`${fmtPrice(itemNqPrice)}\`💰
      `,
      )
    } catch (error) {
      console.error('[itemCommand]', error)
    }
  },
}
