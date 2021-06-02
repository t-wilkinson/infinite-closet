import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { Icon } from '@/components'
import useDays from '@/utils/useDays'

import { shopActions } from './slice'

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/London')
// dayjs.locale('en-gb')

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

const dateAvailable = (date: Dayjs) => {
  date = date.tz('Europe/London')
  const today = dayjs().tz('Europe/London')
  const isNotSunday = date.day() !== 0
  const shippingCutoff = today.add(12, 'hour').add(1, 'day')
  const enoughShippingTime = date.isSameOrAfter(shippingCutoff, 'day')

  return isNotSunday && enoughShippingTime
}
