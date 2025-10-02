import { describe, it, expectTypeOf } from 'vitest'
import type { ParamNamesToObject } from './ParamNamesToObject'

describe('🧪 ParamNamesToObject Type', () => {
  it('should convert parameter names array to object type', () => {
    // 🎯 Test: Multiple parameters
    expectTypeOf<ParamNamesToObject<['brand', 'search']>>().toEqualTypeOf<{
      brand: string
      search: string
    }>()

    // 🎯 Test: Single parameter
    expectTypeOf<ParamNamesToObject<['id']>>().toEqualTypeOf<{ id: string }>()

    // 🎯 Test: Empty array
    expectTypeOf<ParamNamesToObject<[]>>().toEqualTypeOf<{}>()

    // 🎯 Test: Many parameters
    expectTypeOf<
      ParamNamesToObject<['version', 'userId', 'postId']>
    >().toEqualTypeOf<{ version: string; userId: string; postId: string }>()

    // 🎯 Test: Readonly array input
    expectTypeOf<
      ParamNamesToObject<readonly ['category', 'subcategory']>
    >().toEqualTypeOf<{ category: string; subcategory: string }>()
  })
})
