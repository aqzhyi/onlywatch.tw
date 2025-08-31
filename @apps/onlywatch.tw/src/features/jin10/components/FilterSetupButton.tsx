'use client'

import { Button, ButtonGroup } from '@heroui/button'
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { Form } from '@heroui/form'
import { usePathname, useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import qs from 'query-string'
import { useReducer } from 'react'
import { Drawer } from '~/components/Drawer'
import { SearchKeywordsInput } from './SearchKeywordsInput'

export function FilterSetupButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false)
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  return (
    <div>
      <Button
        isIconOnly
        variant='bordered'
        color={query ? 'success' : 'default'}
        onPress={toggleOpen}
      >
        <div className='icon-[mdi--search]'></div>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onOpenChange={toggleOpen}
      >
        <DrawerContent>
          <DrawerHeader>設定篩選器</DrawerHeader>
          <DrawerBody>
            <Form
              onSubmit={(event) => {
                event.preventDefault()

                toggleOpen()
                router.push(`${pathname}?${qs.stringify({ q: query })}`)
              }}
            >
              <SearchKeywordsInput
                value={query}
                onValueChange={async (value) => {
                  await setQuery(value)
                }}
              />

              <ButtonGroup fullWidth>
                <Button
                  color='primary'
                  type='submit'
                >
                  確定
                </Button>
              </ButtonGroup>
            </Form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
