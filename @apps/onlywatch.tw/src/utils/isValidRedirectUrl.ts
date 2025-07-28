import { envVars } from '~/envVars'

/**
 * ! to check `open redirect` attacks
 *
 * This function is used to validate redirect URLs to prevent open redirect
 * attacks.
 */
export function isValidRedirectUrl(redirectUrl: string, allowedOrigin: string) {
  if (!redirectUrl || typeof redirectUrl !== 'string') return false
  if (!redirectUrl.startsWith('/')) return false
  if (redirectUrl.startsWith('//')) return false
  if (redirectUrl.includes('..')) return false

  // 檢查編碼的攻擊
  if (
    redirectUrl.includes('%0a') ||
    redirectUrl.includes('%0d') ||
    redirectUrl.includes('%09')
  ) {
    return false
  }

  if (redirectUrl.toLowerCase().includes('javascript:')) return false
  if (redirectUrl.toLowerCase().includes('data:')) return false

  try {
    const fullUrl = new URL(redirectUrl, allowedOrigin)
    return fullUrl.origin === allowedOrigin
  } catch {
    return false
  }
}
