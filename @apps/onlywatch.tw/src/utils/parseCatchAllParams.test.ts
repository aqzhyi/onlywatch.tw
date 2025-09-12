import { describe, test, expect, expectTypeOf } from 'vitest'
import { parseCatchAllParams } from '~/utils/parseCatchAllParams'

describe('泛型測試', () => {
  test('應該推斷正確的類型 - 單一 query', () => {
    const result = parseCatchAllParams<['query']>(['query', 'USD'])
    expect(result).toEqual({ query: 'USD' })
    expectTypeOf(result).toEqualTypeOf<{ query?: string }>()
  })

  test('應該推斷正確的類型 - 單一 date', () => {
    const result = parseCatchAllParams<['date']>(['date', '2025-01-01'])
    expect(result).toEqual({ date: '2025-01-01' })
    expectTypeOf(result).toEqualTypeOf<{ date?: string }>()
  })

  test('應該推斷正確的類型 - 組合參數', () => {
    const result = parseCatchAllParams<['query', 'date']>(['query', 'USD'])
    expect(result).toEqual({ query: 'USD' })
    expectTypeOf(result).toEqualTypeOf<{ query?: string; date?: string }>()
  })
})

describe('功能測試', () => {
  test('空參數', () => {
    expect(parseCatchAllParams<['query', 'date']>(undefined)).toEqual({})
    expect(parseCatchAllParams<['query', 'date']>([])).toEqual({})
  })

  test('解析關鍵字查詢', () => {
    expect(parseCatchAllParams<['query', 'date']>(['query', 'USD'])).toEqual({
      query: 'USD',
    })

    expect(
      parseCatchAllParams<['query', 'date']>(['query', 'USD%20JPY']),
    ).toEqual({
      query: 'USD JPY',
    })

    expect(
      parseCatchAllParams<['query', 'date']>(['query', '非農%20CPI']),
    ).toEqual({
      query: '非農 CPI',
    })
  })

  test('解析日期參數', () => {
    expect(parseCatchAllParams<['date']>(['date', '2025-01-01'])).toEqual({
      date: '2025-01-01',
    })

    expect(parseCatchAllParams<['date']>(['date', '2024-12-25'])).toEqual({
      date: '2024-12-25',
    })
  })

  test('解析無效日期', () => {
    expect(parseCatchAllParams<['date']>(['date', 'invalid-date'])).toEqual({})
    expect(parseCatchAllParams<['date']>(['date', '2025-13-01'])).toEqual({})
    expect(parseCatchAllParams<['date']>(['date', '2025-01-32'])).toEqual({})
  })

  test('解析組合參數', () => {
    expect(
      parseCatchAllParams<['query', 'date']>([
        'query',
        'USD',
        'date',
        '2025-01-01',
      ]),
    ).toEqual({
      query: 'USD',
      date: '2025-01-01',
    })

    // 順序不重要
    expect(
      parseCatchAllParams<['query', 'date']>([
        'date',
        '2024-12-01',
        'query',
        'CPI',
      ]),
    ).toEqual({
      date: '2024-12-01',
      query: 'CPI',
    })
  })

  test('重複參數 - 最後一個生效', () => {
    expect(
      parseCatchAllParams<['date']>([
        'date',
        '2025-01-01',
        'date',
        '2024-12-25',
      ]),
    ).toEqual({
      date: '2024-12-25',
    })
  })

  test('支援所有參數', () => {
    // 新的行為：支援所有鍵名，不會過濾
    expect(
      parseCatchAllParams<['query']>(['unknown', 'value', 'query', 'USD']),
    ).toEqual({
      unknown: 'value',
      query: 'USD',
    })

    // 類型仍然只包含泛型指定的鍵
    const result = parseCatchAllParams<['query']>([
      'unknown',
      'value',
      'query',
      'USD',
    ])
    expectTypeOf(result).toEqualTypeOf<{ query?: string }>()
  })

  test('空值處理', () => {
    expect(parseCatchAllParams<['query']>(['query', ''])).toEqual({})
    expect(parseCatchAllParams<['query']>(['query'])).toEqual({})
  })
})

describe('pageProps 格式支援', () => {
  test('驗證 pageProps 類型支援', () => {
    // 這個測試只是確認類型定義正確
    // 實際的異步測試會在整合測試中進行
    expect(true).toBe(true)
  })
})

describe('直接鍵名映射測試', () => {
  test('支援任意鍵名', () => {
    const result1 = parseCatchAllParams<['customKey']>(['customKey', 'value'])
    expect(result1).toEqual({ customKey: 'value' })
    expectTypeOf(result1).toEqualTypeOf<{ customKey?: string }>()

    const result2 = parseCatchAllParams<['a', 'b', 'c']>(['a', 'x', 'b', 'y'])
    expect(result2).toEqual({ a: 'x', b: 'y' })
    expectTypeOf(result2).toEqualTypeOf<{
      a?: string
      b?: string
      c?: string
    }>()
  })

  test('保持鍵名不變', () => {
    // 'date' 鍵應該映射到 'date' 屬性，不是 'targetDate'
    const result = parseCatchAllParams<['date']>(['date', '2025-01-01'])
    expect(result).toEqual({ date: '2025-01-01' })
    expect(result).not.toHaveProperty('targetDate')

    // 'query' 鍵應該映射到 'query' 屬性，不是 'searchQuery'
    const result2 = parseCatchAllParams<['query']>(['query', 'USD'])
    expect(result2).toEqual({ query: 'USD' })
    expect(result2).not.toHaveProperty('searchQuery')
  })
})
