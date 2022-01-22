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
  const hoursSendClient = provider.config.shippingClassHours[shippingClass]
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
  earliestDeliveryDate = day(earliestDeliveryDate || undefined) // Want to convert null to undefined
  startsOn = day(startsOn).set({ hour: 0 })

  const arrivesWithClass = (shippingClass) => {
    const arrives = arrival(earliestDeliveryDate, shippingClass)

//     let dates = {
//       so: startsOn.utc().date(),
//       edd: earliestDeliveryDate.utc().date(),
//       a: arrives.utc().date(),
//     }

    // let dates = {
    //   so: startsOn.date(),
    //   edd: earliestDeliveryDate.date(),
    //   a: arrives.date(),
    // }

    let dates = {
      so: Number(startsOn.format('DD'), { timeZone: 'Europe/London' }),
      edd: Number(earliestDeliveryDate.format('DD'), { timeZone: 'Europe/London' }),
      a: Number(arrives.format('DD'), { timeZone: 'Europe/London' }),
    }

    // console.log(startsOn, earliestDeliveryDate, arrives)
    console.log(dates)
    return dates.so >= dates.a // TODO!: also measure week/year/etc
    // startsOn.isSameOrAfter(, 'day')
  }

  return arrivesWithClass('one') ? 'one' : undefined

  if (arrivesWithClass('two')) {
    return 'two'
  } else if (arrivesWithClass('one')) {
    return 'one'
  } else {
    return
  }
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
 * Like {@link shippingClass} but returns hours shipping will take
 * @returns {number}
 */
function shippingClassHours(earliestDeliveryDate, startsOn) {
  return (
    provider.config.shippingClassHours[
      shippingClass(earliestDeliveryDate, startsOn)
    ] || provider.config.shippingClassHours.two
  )
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

/**
 * Expected/measured dates of each stage of an order
 * @param {DateLike} startDate
 * @param {RentalLength} rentalLength
 * @param {DateLike=} shippingDate
 * @param {DateLike=} created_at
 * @returns {DateRange}
 */
function range({ startDate, rentalLength, shippingDate, created_at }) {
  rentalLength = provider.config.rentalLengths[rentalLength]
  if (!startDate || !rentalLength) {
    throw new Error('Must include startDate and rentalLength')
  }

  const hoursSendClient = shippingClassHours(shippingDate, startDate)
  const shipped = shippingDate
    ? day(shippingDate)
    : day(startDate).subtract(hoursSendClient, 'hours')

  const created = created_at ? day(created_at) : undefined
  const confirmed = undefined
  const start = day(startDate)
  const end = start.add(rentalLength, 'hours')
  const cleaning = end.add(provider.config.timing.hoursSendCleaners, 'hours')
  const completed = cleaning.add(
    provider.config.timing.completionBufferHours +
      provider.timing.cleaningDuration(cleaning),
    'hours'
  )

  return { created, confirmed, shipped, start, end, cleaning, completed }
}

module.exports = {
  ...provider.timing,
  arrival,
  shippingClass,
  shippingClassHours,
  range,
  valid,
  overlap,
}
