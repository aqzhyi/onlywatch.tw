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
          averageSalePrice: z.object({
            region: z
              .object({
                price: z.number(),
              })
              .optional(),
          }),
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
          averageSalePrice: z.object({
            region: z
              .object({
                price: z.number(),
              })
              .optional(),
          }),
          dailySaleVelocity: z.object({
            region: z
              .object({
                quantity: z.number(),
              })
              .optional(),
          }),
        }),
        worldUploadTimes: z.array(
          z.object({
            worldId: z.number(),
            /** e.g. `1768061106604` */
            timestamp: z.number(),
          }),
        ),
      }),
    ),
  }),
}
