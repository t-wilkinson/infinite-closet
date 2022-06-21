/**
 * @file Deals with determining handling time around shipping providers. Predict when orders will arrive, tell when orders overlap, etc.
 */
'use strict'
const { providerName, day } = require('../../../utils')
const provider = require(`./${providerName}`)

const HOURS_IN_DAY = 24

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
 * @property {DateLike=} confirmed
 * @property {DateLike} shipped
 * @property {DateLike} start
 * @property {DateLike} end
 * @property {DateLike} cleaning
 * @property {DateLike} completed
 */

/**
 * Determine when an item will likely arrive, given shipping info
 * @param {DateLike} sent - When the item is sent
 * @param {ShippingClass} shippingClass
 * @returns {DateLike} When item will arrive
 */
function arrival(sent, shippingClass) {
  sent = day(sent)
  const hoursSendClient = provider.config.shippingClassHours(sent, shippingClass)
  const offset = sent.hour() >= provider.config.timing.cutoff ? HOURS_IN_DAY : 0
  const arrives = sent
    .add(hoursSendClient + offset, 'hours')
    .hour(provider.config.timing.cutoff)
  return arrives
}

/**
 * Returns cheapest {@link ShippingClass} given time constraints on when it can leave and arrive.
 * @param {DateLike=} earliestDeliveryDate
 * @param {DateLike} startsOn
 * @returns {ShippingClass}
 */
function shippingClass(earliestDeliveryDate, startsOn) {
  earliestDeliveryDate = day(earliestDeliveryDate) // Want to convert null to undefined
  startsOn = day(startsOn).set({ hour: 0 })

  const arrivesWithClass = (shippingClass) =>
    startsOn.isSameOrAfter(arrival(earliestDeliveryDate, shippingClass), 'day')

  if (arrivesWithClass('two')) {
    return 'two'
  } else if (arrivesWithClass('one')) {
    return 'one'
  } else {
    return
  }
}

/**
 * Like {@link shippingClass} but returns hours shipping will take
 * @returns {number}
 */
function shippingClassHours(earliestDeliveryDate, startsOn) {
  // TODO: the order may ship in less time when shipped after eDD
  earliestDeliveryDate = day(earliestDeliveryDate)
  return (
    provider.config.shippingClassHours(
      earliestDeliveryDate,
      shippingClass(earliestDeliveryDate, startsOn)
    ) || provider.config.shippingClassHours.two
  )
}

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
  return enoughShippingTime && (notTooFarInFuture || start.year() >= 2050)
}

function eitherToDay(d1, d2) {
  return d1 ? day(d1) : d2 ? day(d2) : undefined
}

/**
 * Expected/measured dates of each stage of an order
 * @param {DateLike} expectedStart
 * @param {RentalLength} rentalLength
 * @param {DateLike=} shippingDate
 * @param {DateLike=} created_at
 * @returns {DateRange}
 */
function range({ expectedStart, rentalLength, shipment }) {
  shipment = shipment || {}
  rentalLength = provider.config.rentalLengths[rentalLength]
  if (!expectedStart) {
    throw new Error('Must include expectedStart')
  } else if (!rentalLength) {
    throw new Error('Must include rentalLength')
  }

  const hoursSendClient = shippingClassHours(shipment.shipped, expectedStart)

  const confirmed = eitherToDay(shipment.confirmed)
  const shipped = shipment.shipped
    ? day(shipment.shipped)
    : day(expectedStart).subtract(hoursSendClient, 'hours')
  const start = eitherToDay(shipment.start, expectedStart)
  const end = eitherToDay(shipment.end, start.add(rentalLength, 'hours'))
  const cleaning = eitherToDay(shipment.cleaning, end.add(provider.config.timing.hoursSendCleaners, 'hours'))
  const cleaningDuration =
    provider.config.timing.completionBufferHours +
      provider.timing.cleaningDuration(cleaning)
  const completed = eitherToDay(shipment.completed, cleaning.add(cleaningDuration, 'hours'))

  return { confirmed, shipped, start, end, cleaning, completed }
}

function logRange(range) {
  ['confirmed', 'shipped', 'start', 'end', 'cleaning', 'completed'].forEach(status =>
    console.info(range[status]?.toJSON()))
}

module.exports = {
  overlap,
  range,
  shippingClass,
  shippingClassHours,
  valid,
  logRange,
}
