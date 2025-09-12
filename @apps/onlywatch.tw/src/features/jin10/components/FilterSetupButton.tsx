'use client'

import { Button, ButtonGroup } from '@heroui/button'
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { Form } from '@heroui/form'
import { useParams, useRouter } from 'next/navigation'
import { useReducer, useState } from 'react'
import { Drawer } from '~/components/Drawer'
import { parseCatchAllParams } from '~/utils/parseCatchAllParams'
import { SearchKeywordsInput } from './SearchKeywordsInput'
import { decodeURLString } from '~/utils/decodeURLString'
import { MonthPicker } from '~/features/jin10/components/MonthPicker'

export function FilterSetupButton() {
  const router = useRouter()
  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false)
  const nextParams = parseCatchAllParams<['query', 'date']>(
    useParams().params as string[],
  )

  const [query, setQuery] = useState(() =>
    decodeURLString(nextParams.query || ''),
  )

  const [date, setDate] = useState(() => nextParams.date)

  return (
    <div>
      <Button
        data-testid='篩選抽屜打開按鈕'
        isIconOnly
        variant='bordered'
        color={query ? 'success' : 'default'}
        onPress={toggleOpen}
      >
        <div className='icon-[mdi--search]'></div>
      </Button>
      <Drawer
        data-testid='篩選抽屜'
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

                let url = '/calendar'

                if (query) {
                  url = `${url}/query/${encodeURIComponent(query)}`
                }

                if (date) {
                  url = `${url}/date/${date}`
                }

                router.push(url)
              }}
            >
              <SearchKeywordsInput
                testIDs={{
                  input: '篩選關鍵字輸入框',
                  clearButton: '篩選關鍵字清除按鈕',
                }}
                value={query}
                onValueChange={async (value) => {
                  await setQuery(value)
                }}
              />

              <MonthPicker
                value={date}
                onValueChange={setDate}
              />

              <ButtonGroup fullWidth>
                <Button
                  data-testid='篩選關鍵字送出按鈕'
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
