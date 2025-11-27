'use client'

import { Button, ButtonGroup } from '@heroui/button'
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { Form } from '@heroui/form'
import { useSegments } from '@onlywatch/nextjs-route-segments-params'
import { useReducer } from 'react'
import { Drawer } from '~/components/Drawer'
import { MonthPicker } from '~/features/jin10/components/MonthPicker'
import { SearchKeywordsInput } from '~/features/jin10/components/SearchKeywordsInput'
import { useMatchMedia } from '~/hooks/useMatchMedia'

export function FilterSetupButton() {
  const isMD = useMatchMedia('md')
  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false)

  const { params, setParams, pushUrl } = useSegments(['query', 'date'])

  const { query = '', date = '' } = params

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

                pushUrl()

                if (isMD) return

                toggleOpen()
              }}
            >
              <SearchKeywordsInput
                testIDs={{
                  input: '篩選關鍵字輸入框',
                  clearButton: '篩選關鍵字清除按鈕',
                }}
                value={query}
                onValueChange={(value) => {
                  setParams((prev) => ({ ...prev, query: value }))
                }}
              />

              <MonthPicker
                value={date}
                onValueChange={(newDate) => {
                  setParams((prev) => ({ ...prev, date: newDate }))
                }}
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
