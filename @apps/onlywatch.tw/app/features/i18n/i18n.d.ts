// import { formats } from '~/features/i18n/request'
import messages from '~/features/i18n/locales/zh-tw.json'
import type { routing } from '~/features/i18n/routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: Omit<typeof messages, 'eventTitles'>
    // Formats: typeof formats
  }
}
