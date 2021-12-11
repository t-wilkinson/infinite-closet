import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import axios from '@/utils/axios'
import { Icon } from '@/components'
import { iconLeft, iconClose, iconRight } from '@/Icons'
import * as sizing from '@/utils/sizing'
import useDays from '@/utils/useDays'
import { Size, StrapiProduct, StrapiOrder } from '@/types'
import { rentalLengths } from '@/utils/config'

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/London')

interface DatePicker {
  previousDate?: Dayjs
  selectDate: (_: Dayjs) => void
  selectedDate: Dayjs
  size: Size
  product: StrapiProduct
  visible: boolean
  setVisible: (_: boolean) => void
  rentalLength: StrapiOrder['rentalLength']
}

export const DatePicker = ({
  previousDate = undefined,
  selectDate,
  size,
  product,
  selectedDate,
  visible,
  setVisible,
  rentalLength,
}: DatePicker) => {
  if (!size || !product) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 items-center justify-center bg-opacity-50 bg-black z-30
      ${visible ? '' : 'invisible'}
      `}
    >
      <div className="absolute inset-0" onClick={() => setVisible(false)} />
      <div className="relative bg-white p-6">
        <div className="self-end pb-4">
          <button onClick={() => setVisible(false)} type="button">
            <Icon icon={iconClose} size={16} />
          </button>
        </div>
        <Date
          setVisible={setVisible}
          selectDate={selectDate}
          size={size}
          product={product}
          selectedDate={selectedDate}
          rentalLength={rentalLength}
          previousDate={previousDate}
        />
        <div className="w-full items-center pt-6">
          <small>We recommend ordering 1-2 days before your event.</small>
        </div>
      </div>
    </div>
  )
}

const Date = ({
  setVisible,
  selectDate,
  size,
  product,
  selectedDate,
  rentalLength,
  previousDate,
}) => {
  const { date, setDate, days } = useDays(selectedDate)
  const ref = React.useRef()
  const [hover, setHover] = React.useState<Dayjs>()

  React.useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.focus()
    }
  }, [])

  return (
    <div ref={ref} tabIndex={-1}>
      <div className="flex-row items-center justify-between w-full">
        {date.isSameOrAfter(dayjs()) ? (
          <button
            type="button"
            onClick={() => {
              setHover(null)
              setDate((d) => d.subtract(1, 'month'))
            }}
          >
            <div className="border-gray-light border p-2">
              <Icon size={16} icon={iconLeft} />
            </div>
          </button>
        ) : (
          <div className="w-8" />
        )}
        <span>{date.format('MMMM YYYY')}</span>
        <button
          type="button"
          onClick={() => {
            setHover(null)
            setDate((d) => d.add(1, 'month'))
          }}
        >
          <div className="border border-gray-light p-2">
            <Icon size={16} icon={iconRight} />
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
        hover={hover}
        setHover={setHover}
        setVisible={setVisible}
        product={product}
        date={date}
        days={days}
        rentalLength={rentalLength}
        size={size}
        previousDate={previousDate}
        selectedDate={selectedDate}
        selectDate={selectDate}
      />
    </div>
  )
}

const Days = ({
  setVisible,
  previousDate,
  selectedDate,
  selectDate,
  size,
  product,
  date,
  days,
  rentalLength,
  hover,
  setHover,
}) => {
  const [valid, setValid] = React.useState({})
  const rentalDays = rentalLengths[rentalLength] + 1

  React.useEffect(() => {
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

    // TODO: should not refetch everytime new date overed over
    axios
      .post(
        '/orders/dates/valid',
        {
          dates: validDays,
          product: product.id,
          size: (sizing.get(product.sizes, size) || product.sizes[0]).size,
          rentalLength,
        },
        { withCredentials: false }
      )
      .then((data) => setValid((valid) => ({ ...valid, ...data.valid })))
      .catch((err) => console.error(err))
  }, [date])

  const isBetween = (currentDate: Dayjs, date: Dayjs) => {
    return (
      date &&
      currentDate.isBetween(date, date.add(rentalDays, 'day'), 'day', '[)')
    )
  }

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
                type="button"
                onMouseEnter={() => {
                  if (valid[date.toJSON()]) setHover(date)
                  else setHover(undefined)
                }}
                disabled={!valid[date.toJSON()]}
                onClick={() => {
                  if (hover) {
                    selectDate(date)
                    setVisible(false)
                  }
                }}
              >
                <Day
                  date={date}
                  unavailable={!valid[date.toJSON()]}
                  selected={isBetween(date, selectedDate)}
                  hover={isBetween(date, hover)}
                  previous={isBetween(date, previousDate)}
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
  previous = false,
}: {
  date: Dayjs
  selected: boolean
  unavailable: boolean
  hover: boolean
  previous: boolean
}) => (
  <div
    className={`border-l border-t border-gray-light w-12 h-12 p-4 items-center justify-center
      ${previous ? 'bg-sec-light' : ''}
      ${hover ? 'bg-sec-light' : ''}
      ${date.day() !== 0 ? 'cursor-pointer' : ''}
      ${unavailable && !selected ? 'bg-gray-light text-gray-dark' : ''}
      ${selected ? 'bg-sec text-white' : ''}
    `}
  >
    <span>{date.date()}</span>
  </div>
)

export default DatePicker
