import React from 'react'

import dayjs from '@/utils/dayjs'
import { Icon, iconLeft, iconRight } from '@/Components/Icons'
import useDays from '@/utils/useDays'
import { Dayjs } from '@/types'
import { UseField } from '@/Form'
import { Popup } from '@/Layout'

export interface DatePickerProps {
  selectedDate: UseField<Dayjs>
  visible: UseField<boolean>
  isValid: (date: Dayjs) => boolean
  length?: number
  onDateChange?: (date: Dayjs) => void
  header?: any
  footer?: any
}

export const DatePicker = ({ selectedDate, visible, isValid, onDateChange=() => {}, length=1, header, footer}: DatePickerProps) => {
  return (
    <Popup
      close={() => visible.setValue(false)}
      spacing
      className="w-auto p-12"
      isOpen={visible.value}
    >
      {header}
      <Date selectedDate={selectedDate} visible={visible} isValid={isValid} length={length} onDateChange={onDateChange}/>
      {footer}
    </Popup>
  )
}

const Date = ({ selectedDate, visible, isValid, length, onDateChange}) => {
  const { date, setDate, days } = useDays(selectedDate.value)
  const ref = React.useRef()
  const [hover, setHover] = React.useState<Dayjs>()

  React.useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.focus()
    }
  }, [])

  React.useEffect(() => {
    onDateChange(date)
  }, [date])

  return (
    <div ref={ref} tabIndex={-1}>
      <MonthHeader date={date} setHover={setHover} setDate={setDate}/>

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
        selectedDate={selectedDate}
        visible={visible}
        days={days}
        isValid={isValid}
        length={length}
      />
    </div>
  )
}

const MonthHeader = ({ setHover, setDate, date }) => {
  return (
    <div className="flex-row items-center justify-between w-full">
      {date.isSameOrAfter(dayjs()) ? (
        <button
          type="button"
          onClick={() => {
            setHover(null)
            setDate((d: Dayjs) => d.subtract(1, 'month'))
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
          setDate((d: Dayjs) => d.add(1, 'month'))
        }}
      >
        <div className="border border-gray-light p-2">
          <Icon size={16} icon={iconRight} />
        </div>
      </button>
    </div>
  )
}

const Days = ({ isValid, hover, setHover, selectedDate, visible, days, length}) => {
  const isBetween = (currentDate: Dayjs, date?: Dayjs) =>
    date && currentDate.isBetween(date, date.add(length, 'days'), 'day', '[)')

  return (
    <div className="border-gray-light border-r border-b">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-row justify-between">
            {days.slice(i * 7, i * 7 + 7).map((date: Dayjs) => (
              <Day
                key={date.day()}
                date={date}
                unavailable={!isValid(date)}
                selected={isBetween(date, selectedDate.value)}
                hover={isBetween(date, hover)}
                setHover={setHover}
                isValid={isValid}
                selectedDate={selectedDate}
                visible={visible}
                length={length}
              />
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
  setHover,
  isValid,
  selectedDate,
  visible,
}: {
  date: Dayjs
  selected: boolean
  unavailable: boolean
  selectedDate: UseField<Dayjs>
  visible: UseField<boolean>
  hover: boolean
  setHover: (hover: Dayjs) => void
  isValid: (date: Dayjs) => boolean
  length: number
}) => (
  <button
    aria-label="Date"
    type="button"
    disabled={!isValid(date)}
    onClick={() => {
      if (hover) {
        selectedDate.setValue(date)
        visible.setValue(false)
      }
    }}
  >
    <div
      onMouseEnter={() => {
        if (isValid(date)) setHover(date)
        else setHover(undefined)
      }}
      className={`border-l border-t border-gray-light w-12 h-12 p-4 items-center justify-center
      ${hover ? 'bg-sec-light' : ''}
      ${unavailable ? 'bg-gray-300 text-gray-dark' : ''}
      ${selected ? 'bg-sec text-white' : ''}
      `}
    >
      <span>{date.date()}</span>
    </div>
  </button>
)

export default DatePicker
