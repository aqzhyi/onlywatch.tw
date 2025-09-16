import { describe, it, expect } from 'vitest'
import { getRelativePathFromUrl } from './getRelativePathFromUrl'

describe('getRelativePathFromUrl', () => {
  it('should extract relative path from URL', () => {
    const result = getRelativePathFromUrl(
      '/products/category/electronics',
      '/products',
    )
    expect(result).toBe('category/electronics')
  })

  it('should return empty string for exact base URL match', () => {
    const result = getRelativePathFromUrl('/products/', '/products')
    expect(result).toBe('')
  })

  it('should return empty string when URL does not start with base URL', () => {
    const result = getRelativePathFromUrl('/search/query/test', '/products')
    expect(result).toBe('')
  })

  it('should handle base URL without trailing slash', () => {
    const result = getRelativePathFromUrl(
      '/products/category/electronics',
      '/products',
    )
    expect(result).toBe('category/electronics')
  })

  it('should handle URL with trailing slash', () => {
    const result = getRelativePathFromUrl('/products/', '/products')
    expect(result).toBe('')
  })

  it('should handle complex relative paths', () => {
    const result = getRelativePathFromUrl(
      '/mall/brand/nvidia/search/rtx-5090',
      '/mall',
    )
    expect(result).toBe('brand/nvidia/search/rtx-5090')
  })

  it('should handle empty pathname', () => {
    const result = getRelativePathFromUrl('', '/products')
    expect(result).toBe('')
  })

  it('should handle root URL', () => {
    const result = getRelativePathFromUrl('/', '/products')
    expect(result).toBe('')
  })

  it('should handle case where pathname equals base URL exactly', () => {
    const result = getRelativePathFromUrl('/products', '/products')
    expect(result).toBe('')
  })

  it('should handle Unicode characters in URLs', () => {
    const result = getRelativePathFromUrl(
      '/zh-tw/products/分類/電子產品',
      '/zh-tw/products',
    )
    expect(result).toBe('分類/電子產品')
  })

  it('should handle URLs with query parameters', () => {
    const result = getRelativePathFromUrl(
      '/products/category/electronics?sort=price',
      '/products',
    )
    expect(result).toBe('category/electronics?sort=price')
  })

  it('should handle URLs with hash fragments', () => {
    const result = getRelativePathFromUrl(
      '/products/category/electronics#section1',
      '/products',
    )
    expect(result).toBe('category/electronics#section1')
  })

  it('should handle malformed base URLs gracefully', () => {
    const result = getRelativePathFromUrl(
      '/products/category/electronics',
      '//products///',
    )
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('should handle very long URLs', () => {
    const longPath = 'x'.repeat(2000)
    const result = getRelativePathFromUrl(`/products/${longPath}`, '/products')
    expect(result).toBe(longPath)
  })

  it('should handle special characters in URLs', () => {
    const result = getRelativePathFromUrl(
      '/products/category/electronics%20&%20gadgets',
      '/products',
    )
    expect(result).toBe('category/electronics%20&%20gadgets')
  })
})
