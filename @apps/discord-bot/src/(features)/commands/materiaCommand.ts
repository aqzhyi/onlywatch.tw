import delay from 'delay'
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { chunk, keyBy } from 'lodash-es'
import type { z } from 'zod'
import { itemId } from '~/(constants)/itemId'
import { toUniversalisLink } from '~/(features)/markdown/toUniversalisLink'
import { universalisApp } from '~/(services)/universalis/universalisApp'
import { universalisTypes } from '~/(services)/universalis/universalisTypes'

type AggregatedItemResult = z.infer<
  typeof universalisTypes.aggregatedItems
>['results'][number]

const getVelocityEmoji = (velocity: number): string => {
  if (velocity >= 10_000) return '1️⃣0️⃣🌟'
  if (velocity >= 9000) return '0️⃣9️⃣✨'
  if (velocity >= 8000) return '0️⃣8️⃣🔥'
  if (velocity >= 7000) return '0️⃣7️⃣🔥'
  if (velocity >= 6000) return '0️⃣6️⃣🔥'
  if (velocity >= 5000) return '0️⃣5️⃣🔥'
  if (velocity >= 4000) return '0️⃣4️⃣🔋'
  if (velocity >= 3000) return '0️⃣3️⃣🤔'
  if (velocity >= 2000) return '0️⃣2️⃣🤔'
  if (velocity >= 1000) return '0️⃣1️⃣💭'
  return '0️⃣0️⃣💤'
}

export const materiaCommand = {
  /**
   * TODO: 規畫 filters options 的配置。目前想法為（暫定，尚未定案）：
   *
   * 1. 依照市場價值規模篩選
   * 2. 依照單件售價篩選
   * 3. 依照銷量篩選
   * 4. 依照特定屬性（如爆擊、直擊等）篩選
   */
  command: new SlashCommandBuilder()
    .setName('materia')
    .setDescription('魔晶石查詢'),
  callback: async function handleMateriaCommand(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const MATERIA_CONFIG = [
      // 🔴 紅色系列（戰鬥特職）
      { emoji: '🔴', name: '武略魔晶石', attr: '爆擊'.padStart(4, '　') },
      { emoji: '🔴', name: '神眼魔晶石', attr: '直擊'.padStart(4, '　') },
      { emoji: '🔴', name: '雄略魔晶石', attr: '信念'.padStart(4, '　') },

      // 🔵 藍色系列（生產系特職）
      { emoji: '🔵', name: '巨匠魔晶石', attr: '加工精度'.padStart(4, '　') },
      { emoji: '🔵', name: '名匠魔晶石', attr: '作業精度'.padStart(4, '　') },
      { emoji: '🔵', name: '魔匠魔晶石', attr: 'ＣＰ'.padStart(4, '　') },

      // 🟢 綠色系列（採集系特職）
      { emoji: '🟢', name: '達識魔晶石', attr: '獲得力'.padStart(4, '　') },
      { emoji: '🟢', name: '博識魔晶石', attr: '鑑別力'.padStart(4, '　') },
      { emoji: '🟢', name: '器識魔晶石', attr: 'ＧＰ'.padStart(4, '　') },

      // 🟣 紫色系列（戰鬥特職）
      { emoji: '🟣', name: '戰技魔晶石', attr: '技能速度'.padStart(4, '　') },
      { emoji: '🟣', name: '詠唱魔晶石', attr: '詠唱速度'.padStart(4, '　') },

      // 🟡 黃色系列（坦克/治療特職）
      { emoji: '🟡', name: '剛柔魔晶石', attr: '堅韌'.padStart(4, '　') },
      { emoji: '🟡', name: '信力魔晶石', attr: '信仰'.padStart(4, '　') },
    ]

    const TYPE_NAMES = [
      '壹型',
      '貳型',
      '參型',
      '肆型',
      '伍型',
      '陸型',
      '柒型',
      '捌型',
      '玖型',
      '拾型',
      '拾壹型',
      '拾貳型',
    ]

    const result = await interaction.reply('🔍 查詢所有魔晶石物價ing...')

    // 收集所有魔晶石物品（保持排序）
    const materiaItems = MATERIA_CONFIG.flatMap((materia) =>
      TYPE_NAMES.map((typeName, typeIndex) => {
        const fullName = `${materia.name}${typeName}`
        const materiaId = itemId.get(fullName)
        return {
          ...materia,
          typeName,
          typeNumber: typeIndex + 1,
          fullName,
          id: materiaId,
        }
      }),
    ).filter((item) => item.id !== undefined)

    const allMateriaIds = materiaItems.map((item) => item.id!)

    // 分批查詢價格（每批 20 個，延遲 1150ms）
    const BATCH_SIZE = 20
    const priceBatches = chunk(allMateriaIds, BATCH_SIZE)
    const allPriceResults: AggregatedItemResult[] = []

    for (let batchIndex = 0; batchIndex < priceBatches.length; batchIndex++) {
      await result.edit(
        `🔍 查詢價格中 (${batchIndex + 1}/${priceBatches.length})...`,
      )

      const { data: priceData } = await universalisApp.findManyItemsAggregated(
        priceBatches[batchIndex]!,
      )
      if (priceData?.results) {
        allPriceResults.push(...priceData.results)
      }

      if (batchIndex < priceBatches.length - 1) {
        await delay(1150)
      }
    }

    const priceMap = keyBy(allPriceResults, 'itemId')

    // 格式化輸出 - 按型號分組
    await result.edit('🔍 正在總結...')

    for (let typeIndex = 0; typeIndex < TYPE_NAMES.length; typeIndex++) {
      const typeName = TYPE_NAMES[typeIndex]!
      const typeNumber = typeIndex + 1
      const output = [`## ${typeName}魔晶石\n`]

      const typeItems = materiaItems.filter(
        (item) => item.typeNumber === typeNumber,
      )

      for (const item of typeItems) {
        if (!item.id) continue

        const priceData = priceMap[item.id]
        const price = priceData?.nq.averageSalePrice.region?.price || 0
        const velocity = priceData?.nq.dailySaleVelocity.region?.quantity || 0
        const velocityEmoji = getVelocityEmoji(velocity)

        output.push(
          `${item.emoji} ${toUniversalisLink(item.fullName)} (${item.typeNumber}型${item.attr})` +
            ` | ` +
            `${velocityEmoji} 平均銷量市場價值 ${Math.round(velocity).toLocaleString('en-US')}` +
            ` x ` +
            `${Math.round(price).toLocaleString('en-US')}g` +
            ` ~= ` +
            `${Math.round(price * velocity).toLocaleString('en-US')}g`,
        )
      }

      if (typeIndex === 0) {
        await result.edit(output.join('\n'))
      } else {
        await interaction.followUp(output.join('\n'))
      }
    }
  },
}
