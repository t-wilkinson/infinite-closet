import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/en-gb'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

import { Icon } from '@/components'

import { shopActions } from './slice'

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')
dayjs.tz.guess()
dayjs.locale('en-gb')

export const DatePicker = ({ state, dispatch, rentalLength }) =>
  state.dateVisible && (
    <div className="fixed inset-0 items-center justify-center bg-opacity-50 bg-black z-20">
      <div className="bg-white p-6">
        <div className="self-end pb-4">
          <button onClick={() => dispatch(shopActions.hideDate())}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <Date state={state} dispatch={dispatch} rentalLength={rentalLength} />
      </div>
    </div>
  )

export default DatePicker

const Date = ({ state, rentalLength, dispatch }) => {
  const { date, setDate, days } = useDays(state.selectedDate)

  return (
    <div>
      <div className="flex-row items-center justify-between w-full">
        <button onClick={() => setDate((d) => d.subtract(1, 'month'))}>
          <div className="border-gray-light border p-2">
            <Icon size={16} name="left" />
          </div>
        </button>
        <span>{date.format('MMMM YYYY')}</span>
        <button onClick={() => setDate((d) => d.add(1, 'month'))}>
          <div className="border border-gray-light p-2">
            <Icon size={16} name="right" />
          </div>
        </button>
      </div>

      <div className="flex-row justify-around w-full">
        {'SMTWTFS'.split('').map((v, i) => (
          <span key={i} className="font-subheader text-lg p-2">
            {v}
          </span>
        ))}
      </div>
      <Days
        days={days}
        state={state}
        dispatch={dispatch}
        rentalLength={rentalLength}
      />
    </div>
  )
}

const Days = ({ days, state, dispatch, rentalLength }) => {
  const [hover, setHover] = React.useState<Dayjs>()

  return (
    <div className="border-gray-light border-r border-b">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-row">
            {days.slice(i * 7, i * 7 + 7).map((date: Dayjs) => (
              <button
                key={date.day()}
                onMouseEnter={() => {
                  if (dateAvailable(date)) setHover(date)
                  else setHover(undefined)
                }}
                onClick={() => {
                  if (hover) {
                    dispatch(shopActions.selectDate(date))
                    dispatch(shopActions.hideDate())
                  }
                }}
              >
                <Day
                  date={date}
                  unavailable={!dateAvailable(date)}
                  selected={
                    state.selectedDate &&
                    date.isBetween(
                      state.selectedDate,
                      state.selectedDate.add(rentalLength, 'day'),
                      'day',
                      '[)',
                    )
                  }
                  hover={
                    hover &&
                    date.isBetween(
                      hover,
                      hover!.add(rentalLength, 'day'),
                      'day',
                      '[)',
                    )
                  }
                />
              </button>
            ))}
          </div>
        ))}
    </div>
  )
}

const dateAvailable = (date: Dayjs) => date.day() !== 0

const Day = ({
  date,
  selected = false,
  unavailable = false,
  hover = false,
}: {
  date: Dayjs
  selected: Boolean
  unavailable: Boolean
  hover: Boolean
}) => (
  <div
    className={`border-l border-t border-gray-light w-12 h-12 p-4 items-center justify-center
      ${hover ? 'bg-sec-light' : ''}
      ${date.day() !== 0 ? 'cursor-pointer' : ''}
      ${unavailable && !selected ? 'bg-gray-light text-gray-dark' : ''}
      ${selected ? 'bg-sec text-white' : ''}
    `}
  >
    <span>{date.date()}</span>
  </div>
)

const useDays = (curDay: Dayjs) => {
  const [date, setDate] = React.useState(curDay || dayjs())

  const prevMonth: Dayjs[] = []
  const nextMonth: Dayjs[] = []
  const curMonth: Dayjs[] = []

  const monthDate = date.date(1)

  // Previous Month
  const prevDays = monthDate.day()
  if (prevDays !== 0) {
    const prevMonthDate = monthDate.subtract(prevDays, 'day')
    for (var d = prevMonthDate.date(); d <= prevMonthDate.daysInMonth(); d++) {
      prevMonth.push(prevMonthDate.date(d))
    }
  }

  // Current Month
  for (var d = monthDate.date(); d <= monthDate.daysInMonth(); d++) {
    curMonth.push(monthDate.date(d))
  }

  // Next Month
  let nextDays = 6 - date.date(date.daysInMonth()).day()
  while (prevMonth.length + curMonth.length + nextDays < 7 * 6) {
    nextDays = nextDays + 7
  }
  const nextMonthDate = monthDate.date(date.daysInMonth()).add(1, 'day')
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