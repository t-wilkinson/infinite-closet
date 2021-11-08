'use strict'
/**
 * Core functions for manipulating date and time.
 */

const { day } = require('./utils')
const { cleaningDuration } = require('./cleaning')
const { arrival, shippingClassHours } = require('./shipment')

/**
 * @typedef {(null|'one'|'two')} ShippingClass
 */

/**
 * @typedef {('short'|'long')} RentalLength
 */

/**
 * Value that can be converted to dayjs through the {@link dayjs} constructer.
 * @typedef {(Date|Dayjs|string)} DateLike
 */

const HOURS_IN_DAY = 24
// TODO: Use the time from arrival() using 'two' day shipping class. Watch out for `offset`!
const HOURS_SEND_CLEANERS = 2 * HOURS_IN_DAY // 2 day shipping
const COMPLETION_BUFFER_HOURS = 1 * HOURS_IN_DAY // buffer some time for order completion in case anything goes wrong

const rentalLengths = {
  // first and last day of the rental are 12 hours each, so subtract a day
  short: (4 - 1) * HOURS_IN_DAY,
  long: (8 - 1) * HOURS_IN_DAY,
}

/**
 * Range that represents when each order checkpoint is reached
 * @typedef {Object} DateRange
 * @property {DateLike} shipped
 * @property {DateLike} start
 * @property {DateLike} end
 * @property {DateLike} cleaning
 * @property {DateLike} completed
 */

/**
 * Is the value a DateRange object?
 * @param {*} date
 * @returns {boolean}
 */
function isDateRange(date) {
  // short-circuit for efficiency
  return (
    date &&
    !(
      !date.shipped ||
      !date.start ||
      !date.end ||
      !date.cleaning ||
      !date.completed
    )
  )
}

/**
 * Expected/measured dates of each stage of an order
 * @param {DateLike} startDate
 * @param {DateLike=} shippingDate
 * @param {RentalLength} rentalLength
 * @param {DateLike} created_at
 * @returns {DateRange}
 */
function range({ startDate, shippingDate, rentalLength }) {
  rentalLength = rentalLengths[rentalLength]
  const hoursSendClient = shippingClassHours(shippingDate, startDate)
  const shipped = shippingDate
    ? day(shippingDate)
    : day(startDate).subtract(hoursSendClient, 'hours')

  const start = day(startDate)
  const end = start.add(rentalLength, 'hours')
  const cleaning = end.add(HOURS_SEND_CLEANERS, 'hours') // at this point the order arrives at the cleaner
  const completed = cleaning.add(
    COMPLETION_BUFFER_HOURS + cleaningDuration(cleaning),
    'hours'
  )

  return { shipped, start, end, cleaning, completed }
}

/**
 * Calculates if two dates/date ranges overlap
 * @param {DateLike|DateRange} date1
 * @param {DateLike|DateRange} date2
 * @param {string=} granularity - The granularity at which the dates are compared
 * @returns {boolean} True if the dates overlap
 */
function overlap(date1, date2, granularity = 'day') {
  if (!isDateRange(date1)) {
    date1 = day(date1)
  }
  if (!isDateRange(date2)) {
    date2 = day(date2)
  }

  switch ([isDateRange(date1), isDateRange(date2)].toString()) {
    case 'true,true':
      return !(
        date1.completed.isBefore(date2.shipped, granularity) ||
        date1.shipped.isAfter(date2.completed, granularity)
      )
    case 'false,true':
      return (
        date1.isAfter(date2.shipped, granularity) &&
        date1.isBefore(date2.completed, granularity)
      )
    case 'true,false':
      return (
        date2.isAfter(date1.shipped, granularity) &&
        date2.isBefore(date1.completed, granularity)
      )
    case 'false,false':
      return date1.isSame(date2, granularity)
  }
}

/**
 * A date is valid if there is enough time for order to go through lifecycle
 * without letting the product available quantity be negative.
 * @param {Date} date - Start date of order
 * @param {number=} available - Number of product sizes that do not overlap with orders
 * @param {number=} quantity - Total number of product sizes in stock
 * @param {number=} existing - Total number of orders of specific product size. Lets us check if product has been ordered before.
 * @returns {boolean}
 */
function valid(date, available, quantity, existing = 0) {
  // Grace period is time to allow items not in stock to be procured
  const hasQuantity = quantity > 0
  const gracePeriodInUse = existing > 0

  const hasNoAvailableItems =
    (available < 0 && gracePeriodInUse) || (available <= 0 && hasQuantity)
  const shouldAddGracePeriod = !gracePeriodInUse && !hasQuantity

  if (hasNoAvailableItems) {
    return false
  }

  date = day(date)
  const today = day()
  let arrives = arrival(today, 'one')

  if (shouldAddGracePeriod) {
    arrives = arrives.add(15, 'day')
  }

  const enoughShippingTime = date.isSameOrAfter(arrives, 'day')
  const notTooFarInFuture = date.isBefore(today.add(4 * 30, 'day'))

  return enoughShippingTime && notTooFarInFuture
}

module.exports = { day, valid, range, overlap }
