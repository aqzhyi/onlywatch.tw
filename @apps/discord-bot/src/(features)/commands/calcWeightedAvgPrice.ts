type Listing = {
  pricePerUnit: number
  quantity: number
  hq: boolean
}

/**
 * 計算加權平均單件售價。
 *
 * @example
 *   const listings = [
 *     { pricePerUnit: 835, quantity: 30, hq: false },
 *     { pricePerUnit: 835, quantity: 30, hq: false },
 *     { pricePerUnit: 835, quantity: 99, hq: false },
 *     { pricePerUnit: 850, quantity: 10, hq: false },
 *     { pricePerUnit: 900, quantity: 66, hq: false },
 *   ]
 *   calcWeightedAvgPrice(listings, false) // => 853.89
 *
 * @example
 *   calcWeightedAvgPrice([], false) // => 0
 */
export function calcWeightedAvgPrice(
  listings: Listing[],
  isHq: boolean,
): number {
  const filtered = listings.filter((l) => l.hq === isHq)

  let totalValue = 0
  let totalQuantity = 0

  for (const { pricePerUnit, quantity } of filtered) {
    totalValue += pricePerUnit * quantity
    totalQuantity += quantity
  }

  if (totalQuantity === 0) return 0

  return totalValue / totalQuantity
}
