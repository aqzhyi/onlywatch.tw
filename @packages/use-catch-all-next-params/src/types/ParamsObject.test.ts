import { describe, it, expectTypeOf } from 'vitest'
import type { ParamsObject } from './ParamsObject'

describe('ParamsObject type', () => {
  it('should enforce correct parameter types for known parameter names', () => {
    type TestParams = ParamsObject<['brand', 'search']>

    expectTypeOf<TestParams>().toEqualTypeOf<{
      brand?: string | undefined
      search?: string | undefined
    }>()
  })

  it('should handle empty parameter array', () => {
    type EmptyParams = ParamsObject<[]>

    expectTypeOf<EmptyParams>().toEqualTypeOf<{}>()
  })

  it('should handle single parameter', () => {
    type SingleParam = ParamsObject<['query']>

    expectTypeOf<SingleParam>().toEqualTypeOf<{
      query?: string | undefined
    }>()
  })

  it('should handle multiple parameters', () => {
    type MultipleParams = ParamsObject<['brand', 'category', 'price', 'page']>

    expectTypeOf<MultipleParams>().toEqualTypeOf<{
      brand?: string | undefined
      category?: string | undefined
      price?: string | undefined
      page?: string | undefined
    }>()
  })
})
