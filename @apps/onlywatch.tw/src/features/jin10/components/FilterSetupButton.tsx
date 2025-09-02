'use client'

import { Button, ButtonGroup } from '@heroui/button'
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { Form } from '@heroui/form'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import qs from 'query-string'
import { useReducer, useState } from 'react'
import { Drawer } from '~/components/Drawer'
import { SearchKeywordsInput } from './SearchKeywordsInput'

export function FilterSetupButton() {
  const router = useRouter()
  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false)
  const { query: queryParam } = useParams() as Record<string, string>
  const [query, setQuery] = useState(() =>
    (queryParam || '').replace(/query/g, ''),
  )

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
                if (query) {
                  router.push(`/query/${query}`)
                } else {
                  router.push('/')
                }
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
