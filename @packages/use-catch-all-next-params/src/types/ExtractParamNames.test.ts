import { describe, it, expectTypeOf } from 'vitest'
import type { ExtractParamNames } from './ExtractParamNames'

describe('🧪 ExtractParamNames Type', () => {
  it('should extract parameter names from URL template', () => {
    // 🎯 Test: Multiple parameters
    expectTypeOf<
      ExtractParamNames<'/mall/brand/{brand}/search/{search}'>
    >().toEqualTypeOf<['brand', 'search']>()

    // 🎯 Test: Single parameter
    expectTypeOf<ExtractParamNames<'/user/{id}/profile'>>().toEqualTypeOf<
      ['id']
    >()

    // 🎯 Test: No parameters
    expectTypeOf<ExtractParamNames<'/static-page'>>().toEqualTypeOf<[]>()

    // 🎯 Test: Parameter at the end
    expectTypeOf<ExtractParamNames<'/api/users/{userId}'>>().toEqualTypeOf<
      ['userId']
    >()

    // 🎯 Test: Parameter at the beginning
    expectTypeOf<ExtractParamNames<'/{category}/items'>>().toEqualTypeOf<
      ['category']
    >()

    // 🎯 Test: Complex URL with many parameters
    expectTypeOf<
      ExtractParamNames<'/api/{version}/users/{userId}/posts/{postId}'>
    >().toEqualTypeOf<['version', 'userId', 'postId']>()
  })
})
