import { toLink } from '~/(features)/markdown/toLink'
import { envVar } from '~/envVar'

export function toUniversalisLink(itemName: string, itemId?: number | null) {
  return `${toLink(itemName, `<${envVar.FF14_UNIVERSALIS_SITE_URL}/market/${itemId ?? null}>`)}`
}
