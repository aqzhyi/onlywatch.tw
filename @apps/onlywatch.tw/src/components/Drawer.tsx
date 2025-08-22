import { Drawer as HeroUI_Drawer, type DrawerProps } from '@heroui/drawer'
import { extendVariants } from '@heroui/system'

const classNames: Partial<DrawerProps['classNames']> = {
  base: 'sm:m-4 rounded-large',
  closeButton: 'text-2xl text-gray-900 dark:text-white',
}

export const Drawer = extendVariants(HeroUI_Drawer, {
  defaultVariants: {
    /**
     * ## ❓ WHY @ts-expect-error
     *
     * even if you paste the example code from the official document, there will
     * still be a type error
     *
     * - https://www.heroui.com/docs/customization/custom-variants#extend-the-original-component-variants
     *
     * ## 🔍 search this issue
     *
     * - https://github.com/search?q=repo%3Aheroui-inc%2Fheroui+extendVariants+type+error&type=issues&p=2
     *
     * @see https://github.com/heroui-inc/heroui/discussions/3078
     * @see https://github.com/heroui-inc/heroui/issues/3292
     */
    /** @ts-expect-error runtime is working fine, it seems to be a build-time types bug with heroui */
    classNames,
  },
}) as typeof HeroUI_Drawer
