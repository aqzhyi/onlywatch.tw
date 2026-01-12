import { z } from 'zod'

export const universalisTypes = {
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
