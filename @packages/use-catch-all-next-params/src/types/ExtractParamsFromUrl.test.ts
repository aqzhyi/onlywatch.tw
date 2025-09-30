import { describe, it, expectTypeOf } from 'vitest'
import type { ExtractParamsFromUrl } from './ExtractParamsFromUrl'

describe('🧪 ExtractParamsFromUrl Type', () => {
  describe('🎯 Core Functionality', () => {
    it('should extract no parameters from static URLs', () => {
      expectTypeOf<ExtractParamsFromUrl<'/static-page'>>().toEqualTypeOf<{}>()
      expectTypeOf<ExtractParamsFromUrl<'/about-us'>>().toEqualTypeOf<{}>()
      expectTypeOf<ExtractParamsFromUrl<'/contact'>>().toEqualTypeOf<{}>()
    })

    it('should extract single parameter from URL template', () => {
      expectTypeOf<ExtractParamsFromUrl<'/user/{id}/profile'>>().toEqualTypeOf<{
        id: string
      }>()
      expectTypeOf<
        ExtractParamsFromUrl<'/api/users/{userId}'>
      >().toEqualTypeOf<{
        userId: string
      }>()
    })

    it('should extract multiple parameters from URL template', () => {
      expectTypeOf<
        ExtractParamsFromUrl<'/mall/brand/{brand}/search/{search}'>
      >().toEqualTypeOf<{ brand: string; search: string }>()

      expectTypeOf<
        ExtractParamsFromUrl<'/api/{version}/users/{userId}/posts/{postId}'>
      >().toEqualTypeOf<{ version: string; userId: string; postId: string }>()
    })
  })

  describe('🧩 Edge Cases', () => {
    it('should handle parameter at different positions', () => {
      // Parameter at the beginning
      expectTypeOf<ExtractParamsFromUrl<'/{category}/items'>>().toEqualTypeOf<{
        category: string
      }>()

      // Parameter at the end
      expectTypeOf<
        ExtractParamsFromUrl<'/products/category/{category}'>
      >().toEqualTypeOf<{
        category: string
      }>()
    })

    it('should handle complex nested URL patterns', () => {
      expectTypeOf<
        ExtractParamsFromUrl<'/{lang}/mall/{category}/brand/{brand}/product/{productId}'>
      >().toEqualTypeOf<{
        lang: string
        category: string
        brand: string
        productId: string
      }>()
    })
  })

  describe('🔒 Type Safety Validation', () => {
    it('should provide correct TypeScript intellisense for extracted types', () => {
      // Real-world usage patterns with type inference
      type MallParams =
        ExtractParamsFromUrl<'/mall/brand/{brand}/search/{search}'>
      type UserParams = ExtractParamsFromUrl<'/user/{id}/profile'>
      type StaticParams = ExtractParamsFromUrl<'/about-us'>

      // Verify extracted types match expected structure
      expectTypeOf<MallParams>().toEqualTypeOf<{
        brand: string
        search: string
      }>()
      expectTypeOf<UserParams>().toEqualTypeOf<{ id: string }>()
      expectTypeOf<StaticParams>().toEqualTypeOf<{}>()

      // Type-safe object construction
      const mallParams: MallParams = {
        brand: 'nvidia',
        search: 'rtx 4090',
      }
      expectTypeOf(mallParams).toEqualTypeOf<{
        brand: string
        search: string
      }>()

      const userParams: UserParams = {
        id: 'user123',
      }
      expectTypeOf(userParams).toEqualTypeOf<{ id: string }>()

      const staticParams: StaticParams = {}
      expectTypeOf(staticParams).toEqualTypeOf<{}>()
    })
  })
})
