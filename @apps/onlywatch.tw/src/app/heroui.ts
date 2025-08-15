import { heroui } from '@heroui/react'
import plugin from 'tailwindcss/plugin.js'

/**
 * @see https://github.com/heroui-inc/heroui/issues/5331
 */
const h: ReturnType<typeof plugin> = heroui()

export default h
