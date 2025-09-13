import { describe, test, expectTypeOf } from 'vitest'
import type { InferAsMapParams } from '~/types/InferAsMapParams'

describe('InferAsMapParams 類型測試', () => {
  test('空陣列應該返回空對象', () => {
    type Result = InferAsMapParams<[]>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  test('單一字串陣列應該返回單一可選屬性對象', () => {
    type Result = InferAsMapParams<['name']>
    expectTypeOf<Result>().toEqualTypeOf<{ name?: string }>()
  })

  test('多字串陣列應該返回多可選屬性對象', () => {
    type Result = InferAsMapParams<['name', 'age', 'city']>
    expectTypeOf<Result>().toEqualTypeOf<{
      name?: string
      age?: string
      city?: string
    }>()
  })

  test('只讀字串陣列應該正確推斷', () => {
    type Result = InferAsMapParams<readonly ['query', 'date']>
    expectTypeOf<Result>().toEqualTypeOf<{
      query?: string
      date?: string
    }>()
  })

  test('重複字串應該去重', () => {
    type Result = InferAsMapParams<['name', 'name', 'age']>
    expectTypeOf<Result>().toEqualTypeOf<{
      name?: string
      age?: string
    }>()
  })

  test('所有屬性都應該是可選的', () => {
    type Result = InferAsMapParams<['required', 'optional']>

    // 測試空對象是有效的 - 所有屬性都是可選的
    expectTypeOf<Result>().toEqualTypeOf<{
      required?: string
      optional?: string
    }>()

    // 測試部分屬性分配
    const partial1: Result = { required: 'test' }
    expectTypeOf(partial1).toEqualTypeOf<Result>()

    const partial2: Result = { optional: 'test' }
    expectTypeOf(partial2).toEqualTypeOf<Result>()

    // 測試空對象分配
    const empty: Result = {}
    expectTypeOf(empty).toEqualTypeOf<Result>()
  })

  test('屬性值必須是 `string` 或 `undefined`', () => {
    type Result = InferAsMapParams<['test']>

    // 正確的類型應該是 { test?: string }
    expectTypeOf<Result>().toEqualTypeOf<{ test?: string }>()

    // 測試正確的使用方式
    const validUsage1: Result = { test: 'string value' }
    const validUsage2: Result = {}

    expectTypeOf(validUsage1).toEqualTypeOf<Result>()
    expectTypeOf(validUsage2).toEqualTypeOf<Result>()
  })
})
