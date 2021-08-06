'use strict'

const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)

const HOURS_IN_DAY = 24
const HOURS_SEND_CLEANERS = 2 * HOURS_IN_DAY // 2 day shipping
const HOURS_TO_CLEAN = 1 * HOURS_IN_DAY // oxwash takes 24 hours to clean
const HIVED_CUTOFF = 13 // this needs to be precise; watch minutes/seconds offsets
const shippingClasses = {
  one: 1 * HOURS_IN_DAY,
  two: 2 * HOURS_IN_DAY,
}

const rentalLengths = {
  // first and last day of the rental are 12 hours each, so subtract a day
  short: (4 - 1) * HOURS_IN_DAY,
  long: (8 - 1) * HOURS_IN_DAY,
}

function day(date) {
  return dayjs(date).tz('Europe/London')
}

function arrival(sent, shippingClass = 'one') {
  const hoursSendClient = shippingClasses[shippingClass]
  let offset
  if (sent.hour() > HIVED_CUTOFF) {
    offset = HOURS_IN_DAY
  } else {
    offset = 0
  }
  return sent.add(hoursSendClient + offset, 'hours').hour(HIVED_CUTOFF)
}

function shippingClass(order) {
  const orderedOn = day(order.created_at)
  const startsOn = day(order.startDate)
  if (!orderedOn) {
    return undefined
  }
  if (startsOn.isSameOrAfter(arrival(orderedOn, 'two'), 'day')) {
    return 'two'
  } else if (startsOn.isSameOrAfter(arrival(orderedOn, 'one'), 'day')) {
    return 'one'
  } else {
    return undefined
  }
}

function shippingClassHours(order) {
  return shippingClasses[shippingClass(order)]
}

function range(order) {
  const { startDate, shippingDate } = order
  const rentalLength = rentalLengths[order.rentalLength]
  const hoursSendClient = shippingClassHours(order) || shippingClasses.two

  const shipped = shippingDate
    ? day(shippingDate)
    : day(startDate).subtract(hoursSendClient, 'hours')

  const start = day(startDate) // arrival(shipped);
  const end = start.add(rentalLength, 'hours')
  const cleaning = end.add(HOURS_SEND_CLEANERS, 'hours') // at this point the order arrives at the cleaner

  // oxwash doesn't operate on saturday/sunday
  // check if arrival date is on sunday, friday, or saturday
  let CLEANING_DELAY = 0
  if (cleaning.date() === 0) {
    CLEANING_DELAY += 24
  } else if (cleaning.date() === 5) {
    CLEANING_DELAY += 48
  } else if (cleaning.date() === 6) {
    CLEANING_DELAY += 72
  }

  const BUFFER = 1 * HOURS_IN_DAY // buffer incase anything goes wrong
  const completed = cleaning.add(
    BUFFER + HOURS_TO_CLEAN + CLEANING_DELAY,
    'hours'
  )

  return { shipped, start, end, cleaning, completed }
}

function dateRange(date, rentalLength) {
  return range({
    startDate: date,
    rentalLength,
    created_at: day(),
  })
}

function overlap(date1, date2, granularity = 'day') {
  switch ([dayjs.isDayjs(date1), dayjs.isDayjs(date2)].toString()) {
    case 'false,false':
      return !(
        date1.completed.isBefore(date2.shipped, granularity) ||
        date1.shipped.isAfter(date2.completed, granularity)
      )
    case 'true,false':
      return (
        date1.isAfter(date2.shipped, granularity) &&
        date1.isBefore(date2.completed, granularity)
      )
    case 'false,true':
      return (
        date2.isAfter(date1.shipped, granularity) &&
        date2.isBefore(date1.completed, granularity)
      )
    case 'true,true':
      return date1.isSame(date2, granularity)
  }
}

// TODO: give reason for failure: not enough items, already order date for this item
// TODO: should quantity be 0 or `available` by default?
/**
 * @param {Date} date - Start date of order
 * @param {number=} available - Number of product sizes that do not overlap with orders
 * @param {number=} quantity - Total number of product sizes in stock
 * @param {number=} existing - Total number of orders of specific product size
 */
function valid(date, available, quantity, existing) {
  date = day(date)
  const today = day()
  let arrives = arrival(today)

  // Grace period is time to allow items not in stock to be procured
  const gracePeriodInUse = existing > 0
  const hasQuantity = quantity > 0

  const shouldAddGracePeriod = !gracePeriodInUse && !hasQuantity
  const hasNoAvailableItems =
    (available < 0 && gracePeriodInUse) || (available <= 0 && hasQuantity)

  if (hasNoAvailableItems) {
    return false
  }

  if (shouldAddGracePeriod) {
    arrives = arrives.add(10, 'day')
  }

  const enoughShippingTime = date.isSameOrAfter(arrives, 'day')
  const notTooFarInFuture = date.isBefore(today.add(4 * 30, 'day'))

  return enoughShippingTime && notTooFarInFuture
}

module.exports = { day, shippingClass, valid, dateRange, range, overlap }
