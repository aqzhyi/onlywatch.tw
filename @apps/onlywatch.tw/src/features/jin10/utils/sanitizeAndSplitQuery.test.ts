import { describe, expect, it } from 'vitest'
import { sanitizeAndSplitQuery } from './sanitizeAndSplitQuery'

describe('sanitizeAndSplitQuery', () => {
  it('should return empty array for undefined input', () => {
    expect(sanitizeAndSplitQuery(undefined)).toEqual([])
  })

  it('should return empty array for empty string', () => {
    expect(sanitizeAndSplitQuery('')).toEqual([])
  })

  it('should split by commas and spaces', () => {
    expect(sanitizeAndSplitQuery('美國, GDP 數據')).toEqual([
      '美國',
      'GDP',
      '數據',
    ])
    expect(sanitizeAndSplitQuery('fed meeting inflation')).toEqual([
      'fed',
      'meeting',
      'inflation',
    ])
  })

  it('should sanitize dangerous characters', () => {
    expect(sanitizeAndSplitQuery("美國'; DROP TABLE--")).toEqual([
      '美國',
      'DROP',
      'TABLE',
    ])
    expect(sanitizeAndSplitQuery('test<script>alert(1)</script>')).toEqual([
      'testscriptalert1script',
    ])
    // Additional SQL injection tests
    expect(sanitizeAndSplitQuery('美國/* comment */GDP')).toEqual([
      '美國',
      'comment',
      'GDP',
    ])
    expect(sanitizeAndSplitQuery('test-- dangerous comment')).toEqual([
      'test',
      'dangerous',
      'comment',
    ])
    expect(sanitizeAndSplitQuery('normal-word')).toEqual(['normal-word']) // preserve single hyphens
  })

  it('should preserve allowed characters', () => {
    expect(sanitizeAndSplitQuery('USD-JPY_rate 1.23')).toEqual([
      'USD-JPY_rate',
      '1.23',
    ])
    expect(sanitizeAndSplitQuery('file.name test_case')).toEqual([
      'file.name',
      'test_case',
    ])
  })

  it('should filter out empty strings after sanitization', () => {
    expect(sanitizeAndSplitQuery('美國,,,, GDP   ,數據')).toEqual([
      '美國',
      'GDP',
      '數據',
    ])
    expect(sanitizeAndSplitQuery('!@#$%^&*()')).toEqual([])
  })

  it('should handle mixed delimiters', () => {
    expect(sanitizeAndSplitQuery('美國,GDP 數據, inflation rate')).toEqual([
      '美國',
      'GDP',
      '數據',
      'inflation',
      'rate',
    ])
  })

  it('should trim whitespace', () => {
    expect(sanitizeAndSplitQuery('  美國  ,  GDP  ')).toEqual(['美國', 'GDP'])
  })
})
