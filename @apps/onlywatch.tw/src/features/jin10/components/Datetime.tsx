'use client'
import { Fragment } from 'react'
import { days } from '~/utils/days'

export function Datetime(props: {
  /**
   * @example
   *   // ISO8601 UTC date string
   *   ;`2023-10-01T12:00:00Z`
   */
  value: null | string
}) {
  return <Fragment>{days(props.value).format('MM/DD HH:mm')}</Fragment>
}
