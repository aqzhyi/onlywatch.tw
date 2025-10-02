import { describe, it, expect } from 'vitest'
import { parseCatchAllSegments } from './parseCatchAllSegments'

describe('parseCatchAllSegments', () => {
  describe('with string pathname input', () => {
    it('should parse URL with ordered parameters', () => {
      const result = parseCatchAllSegments(
        ['brand', 'amd'],
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        brand: 'amd',
      })
    })

    it('should parse URL with multiple parameters', () => {
      const result = parseCatchAllSegments(
        '/mall/brand/nvidia/search/rtx-4090',
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        brand: 'nvidia',
        search: 'rtx-4090',
      })
    })

    it('should parse URL with single parameter', () => {
      const result = parseCatchAllSegments(
        '/search/hello-world',
        '/search/{query}',
      )
      expect(result).toEqual({
        query: 'hello-world',
      })
    })

    it('should parse URL with user profile', () => {
      const result = parseCatchAllSegments(
        '/user/123/profile',
        '/user/{id}/profile',
      )
      expect(result).toEqual({
        id: '123',
      })
    })

    it('should handle URL encoded values', () => {
      const result = parseCatchAllSegments(
        '/search/hello%20world',
        '/search/{query}',
      )
      expect(result).toEqual({
        query: 'hello world',
      })
    })

    it('should return empty object when no parameters in template', () => {
      const result = parseCatchAllSegments('/static/page', '/static/page')
      expect(result).toEqual({})
    })

    it('should handle mismatch in static segments', () => {
      const result = parseCatchAllSegments(
        '/mall/brand/nvidia/search/rtx-4090',
        '/shop/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({})
    })

    it('should handle fewer URL segments than template', () => {
      const result = parseCatchAllSegments(
        '/mall/brand/nvidia',
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        brand: 'nvidia',
      })
    })

    it('should handle more URL segments than template', () => {
      const result = parseCatchAllSegments(
        '/mall/brand/nvidia/search/rtx-4090/extra/segments',
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        brand: 'nvidia',
        search: 'rtx-4090',
      })
    })
  })

  describe('with array pathname input (Next.js catch-all params)', () => {
    it('should parse Next.js catch-all params array - matches from end of URL', () => {
      // Array ['search', 'rtx 5090'] should match the last segments of template
      const result = parseCatchAllSegments(
        ['search', 'rtx 5090'],
        '/mall/brand/{brand}/search/{search}',
      )
      // Only the last matching segments should be extracted
      expect(result).toEqual({
        search: 'rtx 5090',
      })
    })

    it('should parse full Next.js catch-all params array', () => {
      const result = parseCatchAllSegments(
        ['brand', 'nvidia', 'search', 'rtx-4090'],
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        brand: 'nvidia',
        search: 'rtx-4090',
      })
    })

    it('should handle single parameter with array input', () => {
      const result = parseCatchAllSegments(['hello-world'], '/search/{query}')
      expect(result).toEqual({
        query: 'hello-world',
      })
    })

    it('should handle empty array input', () => {
      const result = parseCatchAllSegments([], '/search/{query}')
      expect(result).toEqual({})
    })

    it('should handle array with spaces in values', () => {
      const result = parseCatchAllSegments(
        ['search', 'rtx 5090 ti'],
        '/products/{category}/{name}',
      )
      expect(result).toEqual({
        category: 'search',
        name: 'rtx 5090 ti',
      })
    })

    it('should handle mismatch between array length and template', () => {
      const result = parseCatchAllSegments(
        ['nvidia'],
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        search: 'nvidia',
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty string pathname', () => {
      const result = parseCatchAllSegments('', '/search/{query}')
      expect(result).toEqual({})
    })

    it('should handle root path', () => {
      const result = parseCatchAllSegments('/', '/{param}')
      expect(result).toEqual({})
    })

    it('should handle template with no placeholders', () => {
      const result = parseCatchAllSegments('/static/page', '/static/page')
      expect(result).toEqual({})
    })

    it('should handle complex URL with special characters', () => {
      const result = parseCatchAllSegments(
        '/product/rtx-4090-super/review',
        '/product/{productId}/review',
      )
      expect(result).toEqual({
        productId: 'rtx-4090-super',
      })
    })

    it('should handle consecutive slashes in pathname', () => {
      const result = parseCatchAllSegments(
        '//mall//brand//nvidia//search//rtx-4090//',
        '/mall/brand/{brand}/search/{search}',
      )
      expect(result).toEqual({
        brand: 'nvidia',
        search: 'rtx-4090',
      })
    })
  })
})
