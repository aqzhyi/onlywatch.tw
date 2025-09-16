import { describe, it, expect } from 'vitest'
import { parseUrlToParams } from './parseUrlToParams'

describe('parseUrlToParams', () => {
  it('should parse URL to parameters correctly', () => {
    const result = parseUrlToParams(
      '/products/category/electronics/page/2',
      '/products',
    )
    expect(result).toEqual({
      category: 'electronics',
      page: '2',
    })
  })

  it('should return empty object for base URL', () => {
    const result = parseUrlToParams('/products/', '/products')
    expect(result).toEqual({})
  })

  it('should handle encoded URL parameters', () => {
    const result = parseUrlToParams('/search/query/hello%20world', '/search')
    expect(result).toEqual({
      query: 'hello world',
    })
  })

  it('should handle complex URL with multiple parameters', () => {
    const result = parseUrlToParams(
      '/mall/brand/nvidia/category/gpu/price/500',
      '/mall',
    )
    expect(result).toEqual({
      brand: 'nvidia',
      category: 'gpu',
      price: '500',
    })
  })

  it('should handle URL that does not match base URL', () => {
    const result = parseUrlToParams('/different/path', '/products')
    expect(result).toEqual({})
  })

  it('should handle malformed URLs gracefully', () => {
    const result = parseUrlToParams(
      '/products/invalid%GG%encoding',
      '/products',
    )
    expect(result).toBeDefined()
  })

  it('should handle very long URLs', () => {
    const longValue = 'x'.repeat(2000)
    const result = parseUrlToParams(
      `/products/category/${encodeURIComponent(longValue)}`,
      '/products',
    )
    expect(result).toEqual({
      category: longValue,
    })
  })

  it('should handle empty segments in URL', () => {
    const result = parseUrlToParams(
      '/products//category//electronics',
      '/products',
    )
    expect(result).toBeDefined()
  })

  it('should handle e-commerce filter parameters', () => {
    const result = parseUrlToParams(
      '/shop/category/electronics/brand/apple/price-min/100/price-max/1000/sort/price-asc',
      '/shop',
    )
    expect(result).toEqual({
      'category': 'electronics',
      'brand': 'apple',
      'price-min': '100',
      'price-max': '1000',
      'sort': 'price-asc',
    })
  })

  it('should handle search with filters and pagination', () => {
    const result = parseUrlToParams(
      '/search/q/gaming%20laptop/category/computers/page/2/limit/20',
      '/search',
    )
    expect(result).toEqual({
      q: 'gaming laptop',
      category: 'computers',
      page: '2',
      limit: '20',
    })
  })

  it('should handle multi-language routes', () => {
    const result = parseUrlToParams(
      '/zh-tw/products/分類/電子產品/品牌/蘋果',
      '/zh-tw/products',
    )
    expect(result).toEqual({
      分類: '電子產品',
      品牌: '蘋果',
    })
  })

  it('should handle Unicode characters correctly', () => {
    const result = parseUrlToParams(
      '/test/chinese/%E4%B8%AD%E6%96%87/emoji/%F0%9F%9A%80%F0%9F%92%AF',
      '/test',
    )
    expect(result).toEqual({
      chinese: '中文',
      emoji: '🚀💯',
    })
  })

  it('should handle special URL characters', () => {
    const result = parseUrlToParams(
      '/test/symbols/!%40%23%24%25%5E%26*()/brackets/%5B%5D%7B%7D()',
      '/test',
    )
    expect(result).toEqual({
      symbols: '!@#$%^&*()',
      brackets: '[]{}()',
    })
  })

  it('should handle odd number of segments gracefully', () => {
    const result = parseUrlToParams(
      '/products/category/electronics/page',
      '/products',
    )
    expect(result).toEqual({
      category: 'electronics',
    })
  })

  it('should handle empty parameter values', () => {
    const result = parseUrlToParams(
      '/products/category//brand/apple',
      '/products',
    )
    expect(result).toEqual({
      brand: 'apple',
    })
  })
})
