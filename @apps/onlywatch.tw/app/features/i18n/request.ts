import { getRequestConfig } from 'next-intl/server'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { routing } from '~/features/i18n/routing'
import { getLocaleFromCookies } from '~/features/i18n/server-actions/getLocaleFromCookies'

export default getRequestConfig(async () => {
  // const requested = await requestLocale
  const locale = await getLocaleFromCookies()
  // const locale =
  //   (requested as typeof routing.defaultLocale) || routing.defaultLocale

  return {
    locale: locale,
    // oxlint-disable-next-line no-await-expression-member FIXME: don't know how to fix this for now
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
