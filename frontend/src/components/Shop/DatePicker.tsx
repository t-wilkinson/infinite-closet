import React from 'react'
import { div, span, button } from '@/shared/components'
import { AntDesign } from '@expo/vector-icons'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/en-gb'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

import Modal from '@/shared/Modal'
import Hoverable from '@/shared/Hoverable'

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')
dayjs.tz.guess()
dayjs.locale('en-gb')

export const DatePicker = ({
  selectedDate,
  setSelectedDate,
  visible,
  setVisible,
  rentalLength,
}) => (
  <Modal visible={visible} transparent={true}>
    <div
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      style={{ backgroundColor: '#000c' }}
    >
      <div bg="white" p="lg">
        <div alignSelf="flex-end" pb="md">
          <button onPress={() => setVisible(false)}>
            <AntDesign name="close" size={24} color="black" />
          </button>
        </div>
        <Date
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          rentalLength={rentalLength}
          setVisible={setVisible}
        />
      </div>
    </div>
  </Modal>
)

export default DatePicker

const Date = ({ selectedDate, setVisible, setSelectedDate, rentalLength }) => {
  const { date, setDate, days } = useDays(selectedDate)
  const [hover, setHover] = React.useState<Dayjs>()

  return (
    <div>
      <div
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <button
          onPress={() => setDate((d) => d.subtract(1, 'month'))}
        >
          <div borderColor="light-gray" borderWidth={1} p="sm">
            <AntDesign size={16} name="left" />
          </div>
        </button>
        <span>{date.format('MMMM YYYY')}</span>
        <button onPress={() => setDate((d) => d.add(1, 'month'))}>
          <div borderColor="light-gray" borderWidth={1} p="sm">
            <AntDesign size={16} name="right" />
          </div>
        </button>
      </div>

      <div flexDirection="row" justifyContent="space-around" width="100%">
        {'SMTWTFS'.split('').map((v, i) => (
          <span key={i} variant="subheader" fontSize={24} p="sm">
            {v}
          </span>
        ))}
      </div>
      <Hoverable onHoverOut={() => setHover(undefined)}>
        <Days
          {...{
            days,
            setHover,
            setSelectedDate,
            setVisible,
            selectedDate,
            hover,
            rentalLength,
          }}
        />
      </Hoverable>
    </div>
  )
}

const Days = ({
  days,
  setHover,
  setSelectedDate,
  setVisible,
  selectedDate,
  hover,
  rentalLength,
}) => {
  return (
    <div borderColor="light-gray" borderRightWidth={1} borderBottomWidth={1}>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div flexDirection="row" key={i}>
            {days
              .slice(i * 7, i * 7 + 7)
              .map((date: Dayjs, dateIndex: number) => (
                <button
                  key={date.day()}
                  onMouseEnter={() => {
                    if (dateAvailable(date)) setHover(date)
                    else setHover(undefined)
                  }}
                  onPress={() => {
                    if (hover) {
                      setSelectedDate(date)
                      setVisible(false)
                    }
                  }}
                >
                  <Day
                    date={date}
                    unavailable={!dateAvailable(date)}
                    selected={
                      selectedDate &&
                      date.isBetween(
                        selectedDate,
                        selectedDate.add(rentalLength, 'day'),
                        'day',
                        '[)',
                      )
                    }
                    hover={
                      hover &&
                      date.isBetween(
                        hover,
                        hover.add(rentalLength, 'day'),
                        'day',
                        '[)',
                      )
                    }
                    style={{ cursor: date.day() !== 0 && 'pointer' }}
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
  ...props
}: {
  date: Dayjs
  selected: Boolean
  unavailable: Boolean
  hover: Boolean
  props?: Object
}) => (
  <div
    borderLeftWidth={1}
    borderTopWidth={1}
    borderColor="light-gray"
    width={48}
    height={48}
    p="md"
    alignItems="center"
    justifyContent="center"
    {...(unavailable && { bg: 'light-gray' })}
    {...(hover && { bg: 'sec' })}
    {...(selected && { bg: 'sec-light' })}
    {...props}
  >
    <span
      {...(unavailable && { color: 'dark-gray' })}
      {...(selected && { color: 'white' })}
    >
      {date.date()}
    </span>
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
