'use strict'
const {day} = require('../../../../utils')
const config = require('./config')

const HOURS_IN_DAY = 24

/**
 * Determine when an item will likely arrive, given shipping info
 * @param {DateLike} sent - When the item is sent
 * @param {ShippingClass} shippingClass
 * @returns {DateLike} When item will arrive
 */
function arrival(sent, shippingClass = 'one') {
  sent = day(sent)
  const hoursSendClient = config.shippingClassesHours[shippingClass]
  const offset = sent.hour() >= config.timing.cutoff ? HOURS_IN_DAY : 0
  const arrives = sent
    .add(hoursSendClient + offset, 'hours')
    .hour(config.timing.cutoff)
  return arrives
}

/**
 * Expected/measured dates of each stage of an order
 * @param {DateLike} startDate
 * @param {DateLike=} shippingDate
 * @param {RentalLength} rentalLength
 * @param {DateLike=} created_at
 * @returns {DateRange}
 */
function range({ startDate, shippingDate, rentalLength, created_at }) {
  rentalLength = config.rentalLengths[rentalLength]
  const hoursSendClient = shippingClassHours(shippingDate, startDate)
  const shipped = shippingDate
    ? day(shippingDate)
    : day(startDate).subtract(hoursSendClient, 'hours')

  const created = created_at ? day(created_at) : undefined
  const start = day(startDate)
  const end = start.add(rentalLength, 'hours')
  const cleaning = end.add(config.timing.hoursSendCleaners, 'hours')
  const completed = cleaning.add(
    config.timing.completionBufferHours + config.timing.restockHours,
    'hours'
  )

  return { created, shipped, start, end, cleaning, completed }
}


/**
 * Returns cheapest {@link ShippingClass} given time constraints on when it can leave and arrive.
 * @param {DateLike=} earliestDeliveryDate
 * @param {DateLike} startsOn
 * @returns {ShippingClass}
 */
function shippingClass(earliestDeliveryDate, startsOn) {
  earliestDeliveryDate = day(earliestDeliveryDate || undefined) // Want to convert null to undefined
  startsOn = day(startsOn)

  if (!earliestDeliveryDate) {
    return undefined
  }
  if (
    startsOn
      .utc()
      .isSameOrAfter(arrival(earliestDeliveryDate, 'two').utc(), 'day')
  ) {
    return 'two'
  } else if (
    startsOn
      .utc()
      .isSameOrAfter(arrival(earliestDeliveryDate, 'one').utc(), 'day')
  ) {
    return 'one'
  } else {
    return undefined
  }
}

/**
 * Like {@link shippingClass} but returns hours shipping will take
 * @returns {number}
 */
function shippingClassHours(earliestDeliveryDate, startsOn) {
  return (
    config.shippingClassesHours[
      shippingClass(earliestDeliveryDate, startsOn)
    ] || config.shippingClassesHours.two
  )
}

function cleaningDuration() {
  return config.timing.restockHours
}

module.exports = {
  arrival,
  range,
  shippingClass,
  shippingClassHours,
  cleaningDuration,
}
