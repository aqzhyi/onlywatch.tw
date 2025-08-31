'use client'

import { Chip } from '@heroui/chip'
import { Input } from '@heroui/input'
import clsx from 'clsx'
import { without } from 'lodash'
import { twMerge } from 'tailwind-merge'

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

interface SearchKeywordsInputProps {
  value: string
  onValueChange: (value: string) => Promise<unknown>
}

export function SearchKeywordsInput({
  value,
  onValueChange,
}: SearchKeywordsInputProps) {
  const toggleKeyword = async (keyword: string) => {
    let keywordsArray = value.split(' ').map((k: string) => k.trim())

    if (keywordsArray.includes(keyword)) {
      keywordsArray = without(keywordsArray, keyword)
    } else {
      keywordsArray = [...keywordsArray, keyword]
    }

    const newValue = keywordsArray.join(' ').trim()
    await onValueChange(newValue)
  }

  const applyKeywordsPreset = async () => {
    await onValueChange(PRESET_IMPORTANT_KEYWORDS)
  }

  const clearKeywords = async () => {
    await onValueChange('')
  }

  return (
    <Input
      type='text'
      label='搜尋'
      variant='bordered'
      value={value}
      onValueChange={async (newValue) => {
        await onValueChange(newValue)
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
              onClick={applyKeywordsPreset}
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
                  value.split(' ').includes(keyword) ? 'primary' : 'default'
                }
                variant='dot'
                onClick={() => toggleKeyword(keyword)}
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
          onClick={clearKeywords}
        ></div>
      }
      startContent={
        <div className='pointer-events-none flex items-center'>
          <div className='icon-[mdi--search] h-4 w-4'></div>
        </div>
      }
    />
  )
}
