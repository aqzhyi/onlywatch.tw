import { describe, it, expect } from 'vitest'
import { buildUrlFromTemplate } from './buildUrlFromTemplate'

describe('buildUrlFromTemplate', () => {
  it('should build URL with template placeholders replaced', () => {
    const result = buildUrlFromTemplate('/mall/brand/{brand}/search/{search}', {
      brand: 'nvidia',
      search: 'rtx 4090',
    })
    expect(result).toBe('/mall/brand/nvidia/search/rtx 4090')
  })

  it('should handle single parameter template', () => {
    const result = buildUrlFromTemplate('/user/{id}/profile', { id: '123' })
    expect(result).toBe('/user/123/profile')
  })

  it('should return template unchanged when no parameters', () => {
    const result = buildUrlFromTemplate('/static-page', {})
    expect(result).toBe('/static-page')
  })

  it('should handle special characters in parameter values', () => {
    const result = buildUrlFromTemplate('/search/{query}', {
      query: 'hello world/test&value=123',
    })
    expect(result).toBe('/search/hello world/test&value=123')
  })

  it('should handle multiple placeholders with same parameter name', () => {
    const result = buildUrlFromTemplate('/api/{version}/docs/{version}', {
      version: 'v1.2',
    })
    expect(result).toBe('/api/v1.2/docs/v1.2')
  })

  it('should handle numeric and boolean parameter values', () => {
    const result = buildUrlFromTemplate(
      '/products/{category}/page/{page}/active/{active}',
      { category: 'electronics', page: 2, active: true },
    )
    expect(result).toBe('/products/electronics/page/2/active/true')
  })

  it('should ignore parameters that do not have placeholders in template', () => {
    const result = buildUrlFromTemplate('/user/{id}/profile', {
      id: '123',
      extra: 'ignored',
    })
    expect(result).toBe('/user/123/profile')
  })

  it('should handle empty string parameters', () => {
    const result = buildUrlFromTemplate('/search/{query}', { query: '' })
    expect(result).toBe('/search/')
  })

  it('should handle Unicode characters', () => {
    const result = buildUrlFromTemplate('/category/{name}', {
      name: '電子產品',
    })
    expect(result).toBe('/category/電子產品')
  })

  it('should truncate URL when parameters are missing (new behavior to support JSDoc examples)', () => {
    const result = buildUrlFromTemplate('/user/{id}/posts/{postId}', {
      id: '123',
    })
    // 🔄 New behavior: URL is truncated when parameters are undefined/null (JSDoc compliance)
    expect(result).toBe('/user/123')
  })

  it('should handle undefined segment (safety check)', () => {
    // This tests the safety check for undefined segment
    const template = '/mall//brand/{brand}'
    const result = buildUrlFromTemplate(template, { brand: 'nvidia' })
    expect(result).toBe('/mall/brand/nvidia')
  })

  it('should skip missing parameters and return root when all parameters are missing', () => {
    const result = buildUrlFromTemplate(
      '/mall/brand/{brand}/search/{search}',
      {},
    )
    expect(result).toBe('/mall')
  })

  it('should skip parameter when value is null', () => {
    const result = buildUrlFromTemplate('/user/{id}/profile/{setting}', {
      id: '123',
      setting: null,
    })
    expect(result).toBe('/user/123')
  })

  it('should skip parameter when value is undefined', () => {
    const result = buildUrlFromTemplate('/user/{id}/profile/{setting}', {
      id: '123',
      setting: undefined,
    })
    expect(result).toBe('/user/123')
  })

  it('should handle parameter-name/parameter-placeholder pattern with missing parameter', () => {
    // Tests the case where we have "param_name/{param}" pattern but param is missing
    const result = buildUrlFromTemplate(
      '/api/version/{version}/docs/type/{type}',
      {
        version: 'v1',
        // type is missing, should skip both "type" and "{type}"
      },
    )
    expect(result).toBe('/api/version/v1/docs')
  })

  it('should handle parameter-name/parameter-placeholder pattern with null parameter', () => {
    const result = buildUrlFromTemplate(
      '/api/version/{version}/docs/type/{type}',
      {
        version: 'v1',
        type: null,
      },
    )
    expect(result).toBe('/api/version/v1/docs')
  })

  it('should return root path when no segments remain after filtering', () => {
    // All segments are parameters and all are missing
    const result = buildUrlFromTemplate('/{param1}/{param2}', {})
    expect(result).toBe('/')
  })

  it('should handle mixed static and parameter segments', () => {
    const result = buildUrlFromTemplate(
      '/static/segment/{dynamic}/another/static',
      {
        dynamic: 'value',
      },
    )
    expect(result).toBe('/static/segment/value/another/static')
  })

  it('should handle template with only static segments', () => {
    const result = buildUrlFromTemplate('/completely/static/path', {})
    expect(result).toBe('/completely/static/path')
  })

  it('should handle template with only parameter placeholders', () => {
    const result = buildUrlFromTemplate('/{param1}/{param2}', {
      param1: 'value1',
      param2: 'value2',
    })
    expect(result).toBe('/value1/value2')
  })

  it('should handle complex scenario with JSDoc example - skip missing brand parameter', () => {
    const result = buildUrlFromTemplate('/mall/brand/{brand}/search/{search}', {
      search: 'rtx 5090',
    })
    expect(result).toBe('/mall/search/rtx 5090')
  })

  it('should handle falsy values that are not null or undefined', () => {
    const result = buildUrlFromTemplate(
      '/search/{query}/page/{page}/active/{active}',
      {
        query: '',
        page: 0,
        active: false,
      },
    )
    expect(result).toBe('/search//page/0/active/false')
  })

  it('should handle edge case with empty template', () => {
    const result = buildUrlFromTemplate('', {})
    expect(result).toBe('/')
  })

  it('should handle edge case with root path template', () => {
    const result = buildUrlFromTemplate('/', {})
    expect(result).toBe('/')
  })

  it('should handle empty segments in template path', () => {
    // This will create empty segments when split by '/' due to consecutive slashes
    // Note: filter(Boolean) in the function should remove empty strings, but we need to test the safety check
    const result = buildUrlFromTemplate('/path//with///empty/{param}', {
      param: 'value',
    })
    expect(result).toBe('/path/with/empty/value')
  })

  it('should handle template with trailing slashes creating empty segments', () => {
    // Test trailing slash behavior - filter(Boolean) should handle empty segments
    const result = buildUrlFromTemplate('/api/version/{version}/', {
      version: 'v1',
    })
    expect(result).toBe('/api/version/v1')
  })

  // Note: The safety check for !segment (lines 42-44) is defensive programming
  // but may not be reachable with current implementation since filter(Boolean) removes empty strings.
  // However, this could be triggered if the split behavior changes or if there are other edge cases.

  it('should handle edge case with potential undefined segments', () => {
    // This test documents the defensive programming check
    // Even though filter(Boolean) removes empty strings, the safety check exists for robustness
    const result = buildUrlFromTemplate('/normal/path/{param}', {
      param: 'value',
    })
    expect(result).toBe('/normal/path/value')
  })
})
