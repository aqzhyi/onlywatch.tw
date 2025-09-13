import { formats } from '@/i18n/request'
import { routing } from '@/i18n/routing'
import messages from '~/features/i18n/locales/zh-TW.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}
