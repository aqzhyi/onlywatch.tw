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

export const materiaCommand = {
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

      const { data: priceData } = await universalisApp.findManyItemsPrice(
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

    // 分批查詢銷量（每批 20 個，延遲 1150ms）
    await result.edit('🔍 查詢銷量資料中...')

    const saleVelocityMap: Record<number, number> = {}

    for (let batchIndex = 0; batchIndex < priceBatches.length; batchIndex++) {
      const { data: saleData } = await universalisApp.findItemSaleHistory(
        priceBatches[batchIndex]!,
      )

      if (saleData) {
        saleVelocityMap[saleData.itemID] = saleData.nqSaleVelocity || 0
      }

      if (batchIndex < priceBatches.length - 1) {
        await delay(1150)
      }
    }

    // 格式化輸出 - 按顏色分組
    await result.edit('🔍 正在總結...')

    const colorGroups = [
      { emoji: '🔴', name: '紅色系列（戰鬥特職）' },
      { emoji: '🔵', name: '藍色系列（生產系特職）' },
      { emoji: '🟢', name: '綠色系列（採集系特職）' },
      { emoji: '🟣', name: '紫色系列（戰鬥特職）' },
      { emoji: '🟡', name: '黃色系列（坦克/治療特職）' },
    ]

    for (let groupIndex = 0; groupIndex < colorGroups.length; groupIndex++) {
      const group = colorGroups[groupIndex]!
      const output = [`## ${group.emoji} ${group.name}\n`]

      const groupItems = materiaItems.filter(
        (item) => item.emoji === group.emoji,
      )

      for (const item of groupItems) {
        if (!item.id) continue

        const price = priceMap[item.id]?.nq.averageSalePrice.region?.price || 0
        const velocity = saleVelocityMap[item.id] || 0

        /**
         * FIXME: 銷量總是返回 0 的問題。
         */
        output.push(
          `${item.emoji} ${toUniversalisLink(item.fullName)} (${item.typeNumber}型${item.attr}) / 平均 ${Math.round(price).toLocaleString('en-US')}g / 銷量 ${Math.round(velocity)} 件`,
        )
      }

      if (groupIndex === 0) {
        await result.edit(output.join('\n'))
      } else {
        await interaction.followUp(output.join('\n'))
      }
    }
  },
}
