/**
 * 根本輸入國家名稱，返回國家代表碼
 *
 * e.g. 輸入 `日本` 輸出 `JP`
 */
export const countryNameToCountryCode = (
  /** e.g. `日本` `台灣` `歐盟` `歐元區` `法國` */
  name: string,
) => {
  return (
    (
      {
        日本: 'JP',
        美國: 'USA',
        德國: 'DE',
        英國: 'UK',
        加拿大: 'CA',
        澳大利亞: 'AU',
        澳洲: 'AU',
        瑞士: 'SWI',
        法國: 'FR',
        歐元區: 'EU',
        歐盟: 'EU',
        中國: 'CN',
        新西蘭: 'NZ',
        紐西蘭: 'NZ',
        韓國: 'KR',
        香港: 'HK',
        台灣: 'TW',
        中國香港: 'HK',
        中國台灣: 'TW',
      } as const
    )[name] || null
  )
}
