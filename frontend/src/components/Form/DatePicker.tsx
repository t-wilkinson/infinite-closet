import React from 'react'

import dayjs from '@/utils/dayjs'
import { Icon, iconLeft, iconRight } from '@/Icons'
import useDays from '@/utils/useDays'
import { Dayjs } from '@/types'
import { UseField } from '@/Form'
import { Popup } from '@/Layout'

export interface DatePickerProps {
  selectedDate: UseField<Dayjs>
  visible: UseField<boolean>
  isValid: (date: Dayjs) => boolean
}

export const DatePicker = ({ selectedDate, visible, isValid }: DatePickerProps) => {
  return (
    <Popup
      close={() => visible.setValue(false)}
      spacing
      className="w-auto"
      isOpen={visible.value}
    >
      <Date selectedDate={selectedDate} visible={visible} isValid={isValid} />
    </Popup>
  )
}

const Date = ({ selectedDate, visible, isValid }) => {
  const { date, setDate, days } = useDays(selectedDate.value)
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

const Days = ({ isValid, hover, setHover, selectedDate, visible, days }) => {

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
                // selected={isBetween(date, selectedDate)}
                hover={date.isSame(hover, 'day')}
                setHover={setHover}
                isValid={isValid}
                selectedDate={selectedDate}
                visible={visible}
              />
            ))}
          </div>
        ))}
    </div>
  )
}

const Day = ({
  date,
  // selected = false,
  unavailable = false,
  hover = false,
  // previous = false,
  setHover,
  isValid,
  selectedDate,
  visible,
}: {
  date: Dayjs
  // selected: boolean
  unavailable: boolean
  selectedDate: UseField<Dayjs>
  visible: UseField<boolean>
  hover: boolean
  // previous: boolean
  setHover: (hover: Dayjs) => void
  isValid: (date: Dayjs) => boolean
}) => (
  <button
    key={date.day()}
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
      ${unavailable ? 'bg-gray-light text-gray-dark' : ''}
      `}
      // ${previous ? 'bg-sec-light' : ''}
      // ${selected ? 'bg-sec text-white' : ''}
    >
      <span>{date.date()}</span>
    </div>
  </button>
)

export default DatePicker
