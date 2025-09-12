/**
 * @example
 *   decodeURLString('USD%20JPY') // 'USD JPY'
 *   decodeURLString('%25E5%25A4%25B1%25E6%25A5%25AD') // '失業' (with double encoding resolved)
 *
 * @param encodedValue - URL encoded string
 * @returns URL decoded string
 */
export const decodeURLString = (encodedValue: string): string => {
  try {
    let decodedValue = encodedValue

    // 處理雙重編碼：如果包含 %25，表示是雙重編碼，需要先解碼一次
    if (decodedValue.includes('%25')) {
      decodedValue = decodeURIComponent(decodedValue)
    }

    // 最終解碼並清理特殊標記
    return decodeURIComponent(decodedValue).trim()
  } catch {
    // 解碼失敗時的降級處理 - 使用原始值並進行基本清理
    return encodedValue.trim()
  }
}
