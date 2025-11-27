'use client'

import { useEffect, useReducer } from 'react'
import { days } from '~/utils/days'

/**
 * use the client's timezone to avoid hydration mismatch
 */
export function Datetime(props: { value: string }) {
  const [date, toLocaleDate] = useReducer(
    () => days(props.value).format('MM/DD HH:mm'),
    '',
  )

  useEffect(() => {
    toLocaleDate()
  }, [props.value])

  return (
    <div
      aria-label='日期時間'
      data-isodate={props.value}
    >
      {date}
    </div>
  )
}
