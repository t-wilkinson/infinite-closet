import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(timezone)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/London')

// Given curDay, find all days that would appear on a 7x6 calendar for curDay.Month
export const useDays = (curDay: Dayjs) => {
  const [date, setDate] = React.useState(
    (curDay || dayjs().tz('Europe/London').millisecond(0).second(0).minute(0))
      .hour(12)
      .date(1)
  )

  let prevMonth: Dayjs[] = []
  let nextMonth: Dayjs[] = []
  let curMonth: Dayjs[] = []

  // Previous Month
  const prevDays = date.day()
  if (prevDays !== 0) {
    prevMonth = Array(prevDays)
      .fill(0)
      .map((_, i) => date.date(1 - (prevDays - i)))
  }

  // Current Month
  for (var d = date.date(); d <= date.daysInMonth(); d++) {
    curMonth.push(date.date(d))
  }

  // Next Month
  let nextDays = 6 - date.date(date.daysInMonth()).day()
  while (prevMonth.length + curMonth.length + nextDays <= 7 * 6) {
    nextDays = nextDays + 7
  }
  const nextMonthDate = date.date(date.daysInMonth()).add(1, 'day')
  for (var d = nextMonthDate.date(); d <= nextDays; d++) {
    nextMonth.push(nextMonthDate.date(d))
  }

  return {
    date,
    setDate,
    prevMonth,
    curMonth,
    nextMonth,
    days: ([] as Dayjs[]).concat(prevMonth, curMonth, nextMonth),
  }
}

export default useDays
