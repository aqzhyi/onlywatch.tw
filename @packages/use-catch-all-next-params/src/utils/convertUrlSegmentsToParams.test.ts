import { describe, it, expect } from 'vitest'
import { convertUrlSegmentsToParams } from './convertUrlSegmentsToParams'

describe('convertUrlSegmentsToParams', () => {
  it('should convert URL segments to parameter object', () => {
    const result = convertUrlSegmentsToParams('category/electronics/page/2')
    expect(result).toEqual({
      category: 'electronics',
      page: '2',
    })
  })

  it('should handle empty string by returning empty object', () => {
    const result = convertUrlSegmentsToParams('')
    expect(result).toEqual({})
  })

  it('should decode URL-encoded values', () => {
    const result = convertUrlSegmentsToParams('search/hello%20world')
    expect(result).toEqual({
      search: 'hello world',
    })
  })

  it('should handle complex encoded characters', () => {
    const result = convertUrlSegmentsToParams(
      'query/hello%2Fworld%26test%3Dvalue',
    )
    expect(result).toEqual({
      query: 'hello/world&test=value',
    })
  })

  it('should handle odd number of segments gracefully', () => {
    const result = convertUrlSegmentsToParams('category/electronics/page')
    expect(result).toEqual({
      category: 'electronics',
    })
  })

  it('should handle single segment (key without value)', () => {
    const result = convertUrlSegmentsToParams('category')
    expect(result).toEqual({})
  })

  it('should handle multiple key-value pairs', () => {
    const result = convertUrlSegmentsToParams(
      'brand/nvidia/category/gpu/price/500',
    )
    expect(result).toEqual({
      brand: 'nvidia',
      category: 'gpu',
      price: '500',
    })
  })

  it('should handle malformed URL encoding gracefully', () => {
    // Test with malformed URL encoding that would cause decodeURIComponent to throw
    expect(() => {
      convertUrlSegmentsToParams('search/hello%GG')
    }).toThrow('URI malformed')
  })

  it('should handle Unicode characters correctly', () => {
    const unicodeSegments =
      'chinese/%E4%B8%AD%E6%96%87/emoji/%F0%9F%9A%80%F0%9F%92%AF'
    const result = convertUrlSegmentsToParams(unicodeSegments)
    expect(result).toEqual({
      chinese: '中文',
      emoji: '🚀💯',
    })
  })

  it('should handle empty values in segments', () => {
    const result = convertUrlSegmentsToParams('key1/value1/key2//key3/value3')
    expect(result).toEqual({
      key1: 'value1',
      key3: 'value3',
    })
  })

  it('should handle very long parameter values', () => {
    const longValue = 'x'.repeat(2000)
    const encodedLongValue = encodeURIComponent(longValue)
    const result = convertUrlSegmentsToParams(`category/${encodedLongValue}`)
    expect(result).toEqual({
      category: longValue,
    })
  })
})
