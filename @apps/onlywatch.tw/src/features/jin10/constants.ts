export const constants = {
  /**
   * In Taiwan time zone, the closing time of the US stock market is considered
   * the end of the same day.
   */
  timezoneOffset: -6,
  financialTermDict: [
    { from: /利率決定/gi, to: '利率決議' },
    { from: /目標利率/gi, to: '利率決議' },
    { from: /(普京|普亭)/gi, to: '普丁' },
  ],
  prerenderKeywordsResult: [
    '失業',
    '利率決議',
    '非農',
    '美聯儲',
    '零售',
    'ADP',
    'CAD',
    'CHF',
    'CPI',
    'FOMC',
    'GDP',
    'JPY',
    'PCE',
    'PMI',
    'USD',
  ],
  importantKeywordsPresets: [
    '非農 cpi pce 利率決議 就業人數 貿易帳 失業金人數 鮑威爾 川普 普丁 零售銷售 PMI 央行',
  ] as const,
}
