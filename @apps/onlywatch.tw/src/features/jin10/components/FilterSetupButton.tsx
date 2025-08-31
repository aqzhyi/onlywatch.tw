'use client'

import { Button, ButtonGroup } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/drawer'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import clsx from 'clsx'
import { without } from 'lodash'
import { useRouter } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { useReducer } from 'react'
import { twMerge } from 'tailwind-merge'
import { Drawer } from '~/components/Drawer'

const EXAMPLES_SEARCH_KEYWORDS = [
  '失業',
  '利率決定',
  '非農',
  '美聯儲',
  '零售',
  'ADP',
  'CAD',
  'CHF',
  'CPI',
  'FOMC',
  'GDP',
  'JPY',
  'PCE',
  'PMI',
  'USD',
]

const PRESET_IMPORTANT_KEYWORDS =
  '非農 cpi pce 利率決定 就業人數 貿易帳 失業金人數 鮑威爾 川普 普京 零售銷售 PMI 央行'

export function FilterSetupButton() {
  const router = useRouter()
  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false)
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      history: 'push',
    }),
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
                router.refresh()
                toggleOpen()
              }}
            >
              <Input
                type='text'
                label='搜尋'
                variant='bordered'
                value={query}
                onValueChange={async (value) => {
                  await setQuery(value, {
                    limitUrlUpdates: { method: 'debounce', timeMs: 1000 },
                  })
                  router.refresh()
                }}
                onKeyDown={async (event) => {
                  if (event.key === 'Enter') {
                    await setQuery(event.currentTarget.value)
                    router.refresh()
                  }
                }}
                description={
                  <div className='flex flex-col justify-center gap-2'>
                    <div
                      className={twMerge(
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
                        onClick={async (event) => {
                          await setQuery(PRESET_IMPORTANT_KEYWORDS)
                          router.refresh()
                        }}
                      >
                        重要數據
                      </Chip>
                    </div>

                    <div
                      className={twMerge(
                        'flex flex-row flex-wrap items-center gap-2',
                        'text-zinc-600 dark:text-zinc-300',
                      )}
                    >
                      <div className='icon-[mdi--information]'></div>
                      <div>或者自訂關鍵字，例如</div>
                      {EXAMPLES_SEARCH_KEYWORDS.map((keyword) => (
                        <Chip
                          key={keyword}
                          className={twMerge('cursor-pointer')}
                          size='sm'
                          color={
                            query.split(' ').includes(keyword)
                              ? 'primary'
                              : 'default'
                          }
                          variant='dot'
                          onClick={async (event) => {
                            await setQuery((prevKeywords) => {
                              let keywordsArray = prevKeywords
                                .split(' ')
                                .map((k) => k.trim())

                              if (keywordsArray.includes(keyword)) {
                                keywordsArray = without(keywordsArray, keyword)
                              } else {
                                keywordsArray = [...keywordsArray, keyword]
                              }

                              return keywordsArray.join(' ')
                            })

                            router.refresh()
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
                    onClick={async () => {
                      await setQuery('')
                      router.refresh()
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
