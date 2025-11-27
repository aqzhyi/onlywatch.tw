import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['zh-tw', 'ja'],
  defaultLocale: 'zh-tw',
  localePrefix: 'never',
})
