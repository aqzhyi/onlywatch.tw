import { itemId } from '~/(constants)/itemId'
import { toLink } from '~/(features)/markdown/toLink'
import { envVar } from '~/envVar'

export function toUniversalisLink(itemName: string) {
  const _itemId = itemId.get(itemName) || null

  return `${toLink(itemName, `<${envVar.FF14_UNIVERSALIS_SITE_URL}/market/${_itemId}>`)}`
}
