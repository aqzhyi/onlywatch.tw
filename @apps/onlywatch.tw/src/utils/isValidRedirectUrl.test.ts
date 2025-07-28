import { expect, test } from 'vitest'
import { isValidRedirectUrl } from '~/utils/isValidRedirectUrl'

const evilRedirectUrlsAttacks = [
  '../evil.com', // path traversal without leading slash
  '/../../evil.com', // 多層穿越
  '/../evil.com', // 基本穿越
  '/./../../evil.com', // 複雜穿越
  '/./../evil.com', // 隱藏穿越
  '//evil.com', // protocol relative URL
  '//theirsite@yoursite.com', // double slashes with email
  // oxlint-disable-next-line no-useless-escape
  '/\/evil.com', // escaped slashes
  '/app/../../evil.com', // 深層穿越
  '/app/../evil.com', // 混合路徑
  'data:text/html,<script>alert("XSS")</script>', // data protocol attacks
  'data:text/plain;base64,PHNjcmlwdD5hbGVydCgiWEFTU1wiKTwvc2NyaXB0Pg==', // base64 encoded XSS
  'http://evil.com', // absolute URL
  'javascript:alert("XSS")', // javascript protocol attacks
  `java%0d%0ascript:alert("XSS")`, // XSS attacks
  '', // empty string
]

const safeRedirectUrls = [
  '/', // 根路徑
  '/app/dashboard', // 多層安全路徑
  '/normal-path', // 正常路徑
  '/normal_path', // 正常路徑
  '/normal@path', // 正常路徑
  '/normal?id=123', // 正常路徑
  '/seems.evil.com', // 看似惡意但實際是安全的內部路徑
]

const testOrigin = 'https://test.example.com'

test.each(evilRedirectUrlsAttacks)(
  'isValidRedirectUrl should return false for evil attack: %s',
  (redirectPath) => {
    expect(isValidRedirectUrl(redirectPath, testOrigin)).toBe(false)
  },
)

test.each(safeRedirectUrls)(
  'isValidRedirectUrl should return true for safe path: %s',
  (redirectPath) => {
    expect(isValidRedirectUrl(redirectPath, testOrigin)).toBe(true)
  },
)
