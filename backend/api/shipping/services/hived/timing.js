'use strict'
const { day } = require('../utils')
const { cleaningDuration, shippingClassHours } = require('./shipment')
const config = require('./config')

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
    config.timing.completionBufferHours + cleaningDuration(cleaning),
    'hours'
  )

  return { created, shipped, start, end, cleaning, completed }
}

module.exports = { range }
