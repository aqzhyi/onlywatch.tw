import { z } from 'zod'

export const universalisTypes = {
  itemSaleHistory: z.object({
    itemID: z.number(),
    /** e.g. `1768297753258` */
    lastUploadTime: z.number(),
    entries: z.array(
      z.object({
        hq: z.boolean(),
        pricePerUnit: z.number(),
        quantity: z.number(),
        buyerName: z.string(),
        onMannequin: z.boolean(),
        /** Unix timestamp in seconds, e.g. `1768234795` */
        timestamp: z.number(),
        worldName: z.string(),
        worldID: z.number(),
      }),
    ),
    regionName: z.string(),
    /** e.g. `{ "1": 34 }` */
    stackSizeHistogram: z.record(z.string(), z.number()),
    /** e.g. `{ "1": 22 }` */
    stackSizeHistogramNQ: z.record(z.string(), z.number()),
    /** e.g. `{ "1": 12 }` */
    stackSizeHistogramHQ: z.record(z.string(), z.number()),
    /**
     * 過去七天內每天的平均銷售數量（或顯示的銷售總數，以先到者為準）
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量和時間段都是相同的
     *
     * 這個統計數據在歷史查詢中更有用
     */
    regularSaleVelocity: z.number(),
    /**
     * 過去七天（或顯示的銷售總數，以較早者為準）每天的平均 NQ 銷售數量。
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量和時間段都是相同的。
     *
     * 這個統計數據在歷史查詢中更有用。
     */
    nqSaleVelocity: z.number(),
    /**
     * 過去七天（或顯示的銷售總數，以先到者為準）每天的平均 HQ 銷售數量。
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量和時間段都是相同的。
     *
     * 這個統計數據在歷史查詢中更有用。
     */
    hqSaleVelocity: z.number(),
  }),
  /** 過去 4 天之物品平均銷售情況 */
  aggregatedItems: z.object({
    results: z.array(
      z.object({
        itemId: z.number(),
        nq: z.object({
          minListing: z.object({
            region: z
              .object({
                price: z.number(),
                worldId: z.number(),
              })
              .optional(),
          }),
          recentPurchase: z.object({
            region: z
              .object({
                price: z.number(),
                timestamp: z.number(),
                worldId: z.number(),
              })
              .optional(),
          }),
          /**
           * AverageSalePrice 和 DailySaleVelocity 是根據過去 4 天的銷售情況計算得出。
           */
          averageSalePrice: z.object({
            region: z
              .object({
                price: z.number(),
              })
              .optional(),
          }),
          /**
           * AverageSalePrice 和 DailySaleVelocity 是根據過去 4 天的銷售情況計算得出。
           */
          dailySaleVelocity: z.object({
            region: z
              .object({
                quantity: z.number(),
              })
              .optional(),
          }),
        }),
        hq: z.object({
          minListing: z.object({
            region: z
              .object({
                price: z.number(),
                worldId: z.number(),
              })
              .optional(),
          }),
          recentPurchase: z.object({
            region: z
              .object({
                price: z.number(),
                /** e.g. `1766674754000` */
                timestamp: z.number(),
                worldId: z.number(),
              })
              .optional(),
          }),
          /**
           * AverageSalePrice 和 DailySaleVelocity 是根據過去 4 天的銷售情況計算得出。
           */
          averageSalePrice: z.object({
            region: z
              .object({
                price: z.number(),
              })
              .optional(),
          }),
          /**
           * AverageSalePrice 和 DailySaleVelocity 是根據過去 4 天的銷售情況計算得出。
           */
          dailySaleVelocity: z.object({
            region: z
              .object({
                quantity: z.number(),
              })
              .optional(),
          }),
        }),
        worldUploadTimes: z
          .array(
            z.object({
              worldId: z.number(),
              /** e.g. `1768061106604` */
              timestamp: z.number(),
            }),
          )
          .optional(),
      }),
    ),
  }),
  /** 當前拍賣版中之物品價格與銷售資訊 */
  itemsCurrentPrice: z.object({
    itemID: z.number(),
    /** e.g. `1768297753258` */
    lastUploadTime: z.number(),
    listings: z.array(
      z.object({
        /** Unix timestamp in seconds */
        lastReviewTime: z.number(),
        pricePerUnit: z.number(),
        quantity: z.number(),
        stainID: z.number(),
        worldName: z.string(),
        worldID: z.number(),
        creatorName: z.string(),
        creatorID: z.any(),
        hq: z.boolean(),
        isCrafted: z.boolean(),
        listingID: z.string(),
        materia: z.array(z.any()),
        onMannequin: z.boolean(),
        retainerCity: z.number(),
        retainerID: z.string(),
        retainerName: z.string(),
        sellerID: z.any(),
        total: z.number(),
        tax: z.number(),
      }),
    ),
    recentHistory: z.array(
      z.object({
        hq: z.boolean(),
        pricePerUnit: z.number(),
        quantity: z.number(),
        /** Unix timestamp in seconds */
        timestamp: z.number(),
        onMannequin: z.boolean(),
        worldName: z.string(),
        worldID: z.number(),
        buyerName: z.string(),
        total: z.number(),
      }),
    ),
    regionName: z.string(),
    /** 當前拍賣中之物品的平均價格 */
    currentAveragePrice: z.number(),
    /** 當前拍賣中之 NQ 物品的平均價格 */
    currentAveragePriceNQ: z.number(),
    /** 當前拍賣中之 HQ 物品的平均價格 */
    currentAveragePriceHQ: z.number(),
    /**
     * 過去七天內每天的平均銷售數量（或顯示的所有銷售數量，以先到者為準）
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量相同且在同一時期內。
     *
     * 這個統計數據在歷史查詢中更有用。過去七天內每天的平均銷售數量（或顯示的所有銷售數量，以先到者為準）
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量相同且在同一時期內。
     *
     * 這個統計數據在歷史查詢中更有用。
     */
    regularSaleVelocity: z.number(),
    /**
     * 過去七天內（或顯示的銷售總數，以較早者為準）每日的平均 NQ 銷售數量。
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量和時間段都是相同的。
     *
     * 這個統計數據在歷史查詢中更有用。
     */
    nqSaleVelocity: z.number(),
    /**
     * 過去七天內（或顯示的銷售總數，以先到者為準）每天的平均 HQ 銷售數量。
     *
     * 這個數字對於每個項目來說往往是相同的，因為顯示的銷售數量和時間段都是一樣的。
     *
     * 這個統計數據在歷史查詢中更有用。
     */
    hqSaleVelocity: z.number(),
    averagePrice: z.number(),
    averagePriceNQ: z.number(),
    averagePriceHQ: z.number(),
    /** 當前拍賣中之物品的最低價格 */
    minPrice: z.number(),
    /** 當前拍賣中之 NQ 物品的最低價格 */
    minPriceNQ: z.number(),
    /** 當前拍賣中之 HQ 物品的最低價格 */
    minPriceHQ: z.number(),
    /** 當前拍賣中之物品的最高價格 */
    maxPrice: z.number(),
    /** 當前拍賣中之 NQ 物品的最高價格 */
    maxPriceNQ: z.number(),
    /** 當前拍賣中之 HQ 物品的最高價格 */
    maxPriceHQ: z.number(),
    stackSizeHistogram: z.record(z.string(), z.number()),
    stackSizeHistogramNQ: z.record(z.string(), z.number()),
    stackSizeHistogramHQ: z.record(z.string(), z.number()),
    worldUploadTimes: z.record(z.string(), z.number()),
    listingsCount: z.number(),
    recentHistoryCount: z.number(),
    unitsForSale: z.number(),
    unitsSold: z.number(),
    hasData: z.boolean(),
  }),
}
