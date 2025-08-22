'use client'

import { Button, ButtonGroup } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import clsx from 'clsx'
import { parseAsString, useQueryState } from 'nuqs'
import { useReducer } from 'react'
import { Drawer } from '~/components/Drawer'

const EXAMPLES_SEARCH_KEYWORDS = [
  'USD',
  '非農',
  '利率決定',
  'PCE',
  'CPI',
  'PMI',
  'ADP',
  '失業',
  '美聯儲',
  '零售',
  'CAD',
  'JPY',
  'CHF',
]

const PRESET_IMPORTANT_KEYWORDS =
  '非農 cpi pce 利率決定 就業人數 貿易帳 失業金人數 鮑威爾 川普 普京 零售銷售 PMI 央行'

export function FilterSetupButton() {
  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false)
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString
      .withDefault('')
      .withOptions({ history: 'push', throttleMs: 500, shallow: false }),
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
                toggleOpen()
              }}
            >
              <Input
                type='text'
                label='搜尋'
                variant='bordered'
                value={query}
                onValueChange={(value) => {
                  setQuery(value)
                }}
                description={
                  <div className='flex flex-col justify-center gap-2'>
                    <div
                      className={clsx(
                        'flex flex-row items-center gap-2',
                        'font-bold',
                        'text-zinc-600 dark:text-zinc-100',
                      )}
                    >
                      <div className='icon-[mdi--information]'></div>
                      <div>採用模板搜尋</div>
                      <Chip
                        className={clsx('cursor-pointer')}
                        color='success'
                        variant='dot'
                        onClick={(event) => {
                          setQuery(PRESET_IMPORTANT_KEYWORDS)
                          toggleOpen()
                        }}
                      >
                        重要數據
                      </Chip>
                    </div>

                    <div
                      className={clsx(
                        'flex flex-row flex-wrap items-center gap-2',
                        'text-zinc-600 dark:text-zinc-300',
                      )}
                    >
                      <div className='icon-[mdi--information]'></div>
                      <div>或者自訂關鍵字，例如</div>
                      {EXAMPLES_SEARCH_KEYWORDS.map((keyword) => (
                        <Chip
                          key={keyword}
                          className={clsx('cursor-pointer')}
                          size='sm'
                          color='primary'
                          variant='dot'
                          onClick={(event) => {
                            setQuery(keyword)
                            toggleOpen()
                          }}
                        >
                          {keyword}
                        </Chip>
                      ))}
                      <div>, etc</div>
                    </div>
                  </div>
                }
                endContent={
                  <div
                    className='icon-[mdi--clear-box] cursor-pointer'
                    onClick={() => {
                      setQuery('')
                      toggleOpen()
                    }}
                  ></div>
                }
                startContent={
                  <div className='pointer-events-none flex items-center'>
                    <div className='icon-[mdi--search] h-4 w-4'></div>
                  </div>
                }
              />

              <ButtonGroup fullWidth>
                <Button
                  color='default'
                  onPress={() => {
                    toggleOpen()
                  }}
                >
                  放棄
                </Button>
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
