'use client'
import { Skeleton } from '@heroui/skeleton'
import { type ReactNode, useEffect, useState } from 'react'
import { days } from '~/utils/days'

/**
 * use the client's timezone to avoid hydration mismatch
 */
export function LocaleDatetimeAt(props: {
  value: string
  /** dayjs format */
  format?: string
  className?: string
}) {
  const [localeDate, setLocaleDate] = useState<ReactNode>(() => '')

  useEffect(() => {
    setLocaleDate(() => days(props.value).format(props.format))
  }, [props.value, props.format])

  return (
    <div
      data-isodate={props.value}
      className={props.className}
    >
      {localeDate ? <div>{localeDate}</div> : <Skeleton />}
    </div>
  )
}
