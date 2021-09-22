import React from 'react'
import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { rentalLengths } from '@/utils/constants'
import { Icon } from '@/components'
import useDays from '@/utils/useDays'
import { useDispatch, useSelector } from '@/utils/store'
import * as sizing from '@/utils/sizing'

import { shopActions } from './slice'

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/London')

export const DatePicker = () => {
  const state = useSelector((state) => state.shop)
  const dispatch = useDispatch()
  const rentalLength = rentalLengths[state.oneTime] + 1

  return (
    <div
      className={`fixed inset-0 items-center justify-center bg-opacity-50 bg-black z-30
      ${state.dateVisible ? '' : 'invisible'}
      `}
    >
      <div
        className="absolute inset-0"
        onClick={() => {
          dispatch(shopActions.hideDate())
        }}
      />
      <div className="relative bg-white p-6">
        <div className="self-end pb-4">
          <button onClick={() => dispatch(shopActions.hideDate())}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <Date dispatch={dispatch} rentalLength={rentalLength} />
        <div className="w-full items-center pt-6">
          <small>We recommend ordering 1-2 days before your event.</small>
        </div>
      </div>
    </div>
  )
}

export default DatePicker

const Date = ({ rentalLength, dispatch }) => {
  const selectedDate = useSelector((state) => state.shop.selectedDate)
  const { date, setDate, days } = useDays(selectedDate)
  const ref = React.useRef()

  React.useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.focus()
    }
  }, [])

  return (
    <div ref={ref} tabIndex={-1}>
      <div className="flex-row items-center justify-between w-full">
        {date.get('month') > dayjs().get('month') ? (
          <button onClick={() => setDate((d) => d.subtract(1, 'month'))}>
            <div className="border-gray-light border p-2">
              <Icon size={16} name="left" />
            </div>
          </button>
        ) : (
          <div className="w-8" />
        )}
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
        date={date}
        days={days}
        dispatch={dispatch}
        rentalLength={rentalLength}
      />
    </div>
  )
}

const Days = ({ date, days, dispatch, rentalLength }) => {
  const [hover, setHover] = React.useState<Dayjs>()
  const [valid, setValid] = React.useState({})
  const state = useSelector((state) => state.shop)
  const product = useSelector((state) => state.layout.data.product)

  React.useEffect(() => {
    if (!product) {
      return null
    }
    const curDay = date.hour(12).date(1)
    const validDays = [
      curDay.date(0).subtract(1, 'month'),
      curDay.date(0),
      curDay.add(1, 'month').date(0),
      curDay.add(2, 'month').date(0),
      curDay.add(3, 'month').date(0),
    ].reduce((acc, day) => {
      Array(day.date())
        .fill(0)
        .map((_, i) => {
          acc.push(day.set('date', i + 1))
        })
      return acc
    }, [])

    axios
      .post('/orders/dates/valid', {
        dates: validDays,
        product: product.id,
        size: sizing.get(product.sizes, state.size).size,
        rentalLength: state.oneTime,
      })
      .then((res) => setValid((valid) => ({ ...valid, ...res.data.valid })))
      .catch((err) => console.error(err))
  }, [date, days])

  return (
    <div className="border-gray-light border-r border-b">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-row">
            {days.slice(i * 7, i * 7 + 7).map((date: Dayjs) => (
              <button
                key={date.day()}
                aria-label="Date"
                onMouseEnter={() => {
                  if (valid[date.toJSON()]) setHover(date)
                  else setHover(undefined)
                }}
                disabled={!valid[date.toJSON()]}
                onClick={() => {
                  if (hover) {
                    dispatch(shopActions.selectDate(date))
                    dispatch(shopActions.hideDate())
                  }
                }}
              >
                <Day
                  date={date}
                  unavailable={!valid[date.toJSON()]}
                  selected={
                    state.selectedDate &&
                    date.isBetween(
                      state.selectedDate,
                      state.selectedDate.add(rentalLength, 'day'),
                      'day',
                      '[)'
                    )
                  }
                  hover={
                    hover &&
                    date.isBetween(
                      hover,
                      hover!.add(rentalLength, 'day'),
                      'day',
                      '[)'
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
