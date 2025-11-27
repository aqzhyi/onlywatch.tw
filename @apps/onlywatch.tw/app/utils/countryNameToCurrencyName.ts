/**
 * 根本輸入國家名稱，返回國家貨幣之代表碼
 *
 * e.g. 輸入 `日本` 輸出 `JPY`
 */
export const countryNameToCurrencyName = (
  /** e.g. `日本` `台灣` `歐盟` `歐元區` `法國` */
  name: string,
) => {
  return (
    (
      {
        日本: 'JPY',
        美國: 'USD',
        德國: 'DE',
        英國: 'GBP',
        加拿大: 'CAD',
        澳大利亞: 'AUD',
        澳洲: 'AUD',
        瑞士: 'CHF',
        法國: 'FR',
        歐元區: 'EUR',
        歐盟: 'EUR',
        中國: 'CNY',
        新西蘭: 'NZD',
        紐西蘭: 'NZD',
        韓國: 'KR',
        香港: 'HKD',
        台灣: 'TWD',
        中國香港: 'HKD',
        中國台灣: 'TWD',
      } as const
    )[name] || null
  )
}
