import { describe, it, expectTypeOf } from 'vitest'
import type { NextParamsObject } from './NextParamsObject'

describe('NextParamsObject type', () => {
  it('should enforce correct parameter types for known parameter names', () => {
    type TestParams = NextParamsObject<'/mall/brand/{brand}/search/{search}'>

    expectTypeOf<TestParams>().toEqualTypeOf<{
      brand: string
      search: string
    }>()
  })

  it('should handle URL template with no parameters', () => {
    type EmptyParams = NextParamsObject<'/static-page'>

    expectTypeOf<EmptyParams>().toEqualTypeOf<{}>()
  })

  it('should handle single parameter', () => {
    type SingleParam = NextParamsObject<'/user/{query}/profile'>

    expectTypeOf<SingleParam>().toEqualTypeOf<{
      query: string
    }>()
  })

  it('should handle multiple parameters', () => {
    type MultipleParams =
      NextParamsObject<'/mall/{brand}/category/{category}/price/{price}/page/{page}'>

    expectTypeOf<MultipleParams>().toEqualTypeOf<{
      brand: string
      category: string
      price: string
      page: string
    }>()
  })

  it('should handle complex URL patterns', () => {
    type ComplexParams =
      NextParamsObject<'/api/v1/users/{userId}/posts/{postId}/comments/{commentId}'>

    expectTypeOf<ComplexParams>().toEqualTypeOf<{
      userId: string
      postId: string
      commentId: string
    }>()
  })

  it('should handle mixed static and dynamic segments', () => {
    type MixedParams =
      NextParamsObject<'/dashboard/analytics/{year}/month/{month}/report'>

    expectTypeOf<MixedParams>().toEqualTypeOf<{
      year: string
      month: string
    }>()
  })
})
