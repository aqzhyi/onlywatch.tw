import { createNavigation } from 'next-intl/navigation'
import { routing } from '~/features/i18n/routing'

// 👀 see https://next-intl.dev/docs/routing/setup#i18n-navigation

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
