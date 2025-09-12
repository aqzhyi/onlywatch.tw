import { describe, it, expect } from 'vitest'
import { isEventsPeriod } from './isEventsPeriod'

describe('isEventsPeriod', () => {
  const peakTimes = [
    {
      time: '2023-12-25T08:00:00.000Z',
      description: '0 分',
    },
    {
      time: '2023-12-25T08:01:00.000Z',
      description: '1 分',
    },
    {
      time: '2023-12-25T08:15:00.000Z',
      description: '15 分',
    },
    {
      time: '2023-12-25T08:16:00.000Z',
      description: '16 分',
    },
    {
      time: '2023-12-25T08:30:00.000Z',
      description: '30 分',
    },
    {
      time: '2023-12-25T08:31:00.000Z',
      description: '31 分',
    },
    {
      time: '2023-12-25T08:45:00.000Z',
      description: '45 分',
    },
    {
      time: '2023-12-25T08:46:00.000Z',
      description: '46 分',
    },
  ]

  it.each(peakTimes)(
    'should return true for event peak period: $time ($description)',
    ({ time }) => {
      expect(isEventsPeriod(time)).toBe(true)
    },
  )

  const nonPeakTimes = [
    {
      time: '2023-12-25T08:05:00.000Z',
      description: '5 分',
    },
    {
      time: '2023-12-25T08:20:00.000Z',
      description: '20 分',
    },
    {
      time: '2023-12-25T08:35:00.000Z',
      description: '35 分',
    },
    {
      time: '2023-12-25T08:55:00.000Z',
      description: '55 分',
    },
  ]

  it.each(nonPeakTimes)(
    'should return false for non-peak period: $time ($description)',
    ({ time }) => {
      expect(isEventsPeriod(time)).toBe(false)
    },
  )
})
