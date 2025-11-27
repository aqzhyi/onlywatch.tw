export const constants = {
  /**
   * In Taiwan time zone, the closing time of the US stock market is considered
   * the end of the same day.
   */
  timezoneOffset: -6,
  financialTermDict: [
    { from: /\./gi, to: '' }, // i18n cannot handle full stops
    { from: /。$/gi, to: '' }, // 去除句尾的句號
    { from: /主要再融資利率/gi, to: '利率決議' },
    { from: /利率決定/gi, to: '利率決議' },
    { from: /目標利率/gi, to: '利率決議' },
    { from: /(普京|普亭)/gi, to: '普丁' },
  ],
  prerenderKeywordsResult: [
    '川普',
    '央行',
    '央行行長',
    '失業',
    '利率決議',
    '非農',
    '美聯儲',
    '美聯儲主席',
    '就業人數',
    '普丁',
    '貿易帳',
    '零售',
    '鮑威爾',
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
    '非農 FOMC ADP CPI PCE GDP 利率決議 美聯儲主席 就業 貿易帳 川普 普丁 央行行長',
  ] as const,
}
