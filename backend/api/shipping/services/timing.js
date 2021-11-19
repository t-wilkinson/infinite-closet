'use strict'
const { timing } = require('./acs')
const { arrival } = require('./shipment')
const {day} = require('../../../utils')

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

/**
 * Range that represents when each order checkpoint is reached
 * @typedef {Object} DateRange
 * @property {DateLike=} created
 * @property {DateLike} shipped
 * @property {DateLike} start
 * @property {DateLike} end
 * @property {DateLike} cleaning
 * @property {DateLike} completed
 */

/**
 * @file Core functions for manipulating date and time.
 */

/**
 * True if the value is a DateRange (has the keys that a DateRange has)
 */
function isDateRange(date) {
  return (
    date &&
    ['shipped', 'start', 'end', 'cleaning', 'completed'].every(
      (key) => key in date
    )
  )
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
      return date1.utc().isSame(date2.utc(), granularity)
  }
}

/**
 * A date is valid if there is enough time for order to go through lifecycle
 * without letting the product available quantity be negative.
 * @param {DateLike} start - Start date of order
 * @param {number=} available - Number of product sizes that do not overlap with orders
 * @param {number=} quantity - Total number of product sizes in stock
 * @param {number=} existing - Total number of orders of specific product size. Lets us check if product has been ordered before.
 * @returns {boolean}
 */
function valid(start, available, quantity, existing = 0) {
  // Grace period is time to allow items not in stock to be procured
  const hasQuantity = quantity > 0
  const gracePeriodInUse = existing > 0

  const hasNoAvailableItems =
    (available < 0 && gracePeriodInUse) || (available <= 0 && hasQuantity)
  const shouldAddGracePeriod = !gracePeriodInUse && !hasQuantity

  if (hasNoAvailableItems) {
    return false
  }

  start = day(start)
  const today = day()
  let arrives = arrival(today, 'one')

  if (shouldAddGracePeriod) {
    arrives = arrives.add(15, 'day')
  }

  const enoughShippingTime = start.utc().isSameOrAfter(arrives.utc(), 'day')
  const notTooFarInFuture = start.isBefore(today.add(4 * 30, 'day'))

  return enoughShippingTime && notTooFarInFuture
}

module.exports = { day, valid, overlap, ...timing }
