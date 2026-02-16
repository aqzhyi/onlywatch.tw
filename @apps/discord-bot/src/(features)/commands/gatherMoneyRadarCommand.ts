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

/** 這個指令主要目標是在所有可以被採集的物品中，篩選出值得關注的高價物品 */
export const gatherMoneyRadarCommand = {
  command: new SlashCommandBuilder()
    .setName('gathers_money_radar')
    .setDescription('雙採集職業當前高價物品篩選')
    .addStringOption((option) =>
      option
        .setName('物品類型')
        .setDescription('木材、原木、靈砂、礦石、爆發藥等')
        .setRequired(true)
        .addChoices(
          { name: '木材', value: '木材' },
          { name: '原木', value: '原木' },
          { name: '靈砂', value: '靈砂' },
          { name: '礦石', value: '礦石' },
          { name: '爆發藥', value: '爆發藥' },
          { name: '輔助藥品', value: '輔助藥品' },
        ),
    )
    .addNumberOption((option) =>
      option
        .setName('最低銷量')
        .setDescription('篩選最低日銷量門檻（預設 2000 件以上）')
        .setRequired(false)
        .addChoices(
          { name: '1', value: 1 },
          { name: '50', value: 50 },
          { name: '500', value: 500 },
          { name: '1000', value: 1000 },
          { name: '2000', value: 2000 },
          { name: '3000', value: 3000 },
          { name: '4000', value: 4000 },
          { name: '5000', value: 5000 },
          { name: '6000', value: 6000 },
          { name: '7000', value: 7000 },
          { name: '8000', value: 8000 },
          { name: '9000', value: 9000 },
          { name: '10000', value: 10_000 },
        ),
    ),
  callback: async function handleItemCommand(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const itemType = interaction.options.getString('物品類型', true)
    const minVelocity = interaction.options.getNumber('最低銷量') ?? 1000
    const BATCH_SIZE = 20
    const BATCH_DELAY_MS = 1125
    const MAX_MESSAGE_LENGTH = 1800

    const result = await interaction.reply(
      `🔍 查詢 ${itemType} 物價中（最低銷量 ${minVelocity} 件以上）...`,
    )

    const targetItems = filterItems(itemType)

    if (targetItems.length === 0) {
      await result.edit(`❌ 找不到符合「${itemType}」的物品`)
      return
    }

    const targetItemsId = targetItems.map((item) => item.id)
    const targetItemsPrice: AggregatedItemResult[] = []
    const priceBatches = chunk(targetItemsId, BATCH_SIZE)

    for (let batchIndex = 0; batchIndex < priceBatches.length; batchIndex++) {
      await result.edit(
        `🔍 批次查詢價格中 (${batchIndex + 1}/${priceBatches.length})...`,
      )

      const { data: priceData, error } =
        await universalisApp.findManyItemsAggregated(priceBatches[batchIndex]!)

      if (error) {
        interaction.followUp(
          `❌🟡 查詢價格部份失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
        )
      }

      if (priceData?.results) {
        targetItemsPrice.push(...priceData.results)
      }

      if (batchIndex < priceBatches.length - 1) {
        await delay(BATCH_DELAY_MS)
      }
    }

    const priceMap = keyBy(targetItemsPrice, 'itemId')

    // calculate market scale and filter by velocity
    const itemsWithPrice = targetItems
      .map((item) => {
        const priceData = priceMap[item.id]
        const price = priceData?.nq.averageSalePrice.region?.price || 0
        const velocity = priceData?.nq.dailySaleVelocity.region?.quantity || 0
        const marketScale = price * velocity

        return {
          ...item,
          price,
          velocity,
          marketScale,
        }
      })
      .filter((item) => item.velocity >= minVelocity)
      .toSorted((left, right) => right.marketScale - left.marketScale)

    if (itemsWithPrice.length === 0) {
      await result.edit(
        `❌ 找不到符合條件的 ${itemType}（最低銷量 ${minVelocity} 件以上）`,
      )
      return
    }

    // format output
    await result.edit('🔍 正在總結...')

    const outputs: string[] = []
    let currentOutput = `## 💰 ${itemType} 熱銷物品\n> 最低銷量：\`${minVelocity}件\` 以上\n\n`

    for (const item of itemsWithPrice) {
      const velocityEmoji = getVelocityEmoji(item.velocity)
      const line =
        `📦 ${toUniversalisLink(item.name)}` +
        ` | ` +
        `${velocityEmoji} 銷量市場規模 ${Math.round(item.velocity).toLocaleString('en-US')}件` +
        ` x ` +
        `\`${Math.round(item.price).toLocaleString('en-US')}g\`` +
        ` ~= ` +
        `\`${Math.round(item.marketScale).toLocaleString('en-US')}g\`` +
        '\n'

      if (currentOutput.length + line.length > MAX_MESSAGE_LENGTH) {
        outputs.push(currentOutput)
        currentOutput = line
      } else {
        currentOutput += line
      }
    }

    if (currentOutput.length > 0) {
      outputs.push(currentOutput)
    }

    // send output
    for (let index = 0; index < outputs.length; index++) {
      if (index === 0) {
        await result.edit(outputs[index]!)
      } else {
        await interaction.followUp(outputs[index]!)
      }
    }
  },
}

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

const filterItems = (type: string): Array<{ name: string; id: number }> => {
  const items: Array<{ name: string; id: number }> = []

  for (const [name, id] of itemId.entries()) {
    let match = false

    switch (type) {
      case '輔助藥品': {
        match =
          name.includes('靜魔藥') ||
          name.includes('聖靈藥') ||
          name.includes('甦醒藥') ||
          name.includes('強心劑') ||
          name.includes('乙太藥') ||
          name.includes('治療劑') ||
          name.includes('毒藥') ||
          /禦.*?藥/i.test(name)
        break
      }
      case '木材': {
        match =
          name.endsWith('木材') &&
          !name.includes('改良用') &&
          !name.includes('收藏用') &&
          !name.includes('重建用')
        break
      }
      case '原木': {
        match =
          name.endsWith('原木') &&
          !name.includes('改良用') &&
          !name.includes('收藏用') &&
          !name.includes('重建用')
        break
      }
      case '靈砂': {
        match = name.includes('靈砂')
        break
      }
      case '礦石': {
        match =
          name.endsWith('礦') &&
          !name.includes('改良用') &&
          !name.includes('收藏用') &&
          !name.includes('重建用')
        break
      }
      case '爆發藥': {
        match = /(巧力|意力|智力|剛力|耐力).+?(藥|水)/.test(name)
        break
      }
    }

    if (match) {
      items.push({ name, id })
    }
  }

  return items
}
