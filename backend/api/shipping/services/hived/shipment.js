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

/**
 * Format address according to specification
 * @param {Object} format - Mapping of address fields to api fields
 * @param {Address} addr
 * @returns {Object} Address with fields set by specification
 */
function formatAddress(format, addr) {
  if (typeof addr === 'string') {
    return formatAddress(format, config.addresses[addr])
  } else {
    return Object.entries(addr).reduce((acc, [key, value]) => {
      if (!value || !format[key]) {
        return acc
      }
      if (key === 'address') {
        for (const i in format.address) {
          if (format.address[i] && value[i]) {
            acc[format.address[i]] = value[i]
          }
        }
      } else {
        acc[format[key]] = value
      }
      return acc
    }, {})
  }
}

/**
 * Duration an order will spend at cleaners
 * @param {DateLike} arrival - When item first arrives at cleaners
 * @returns {number} Hours spend at cleaners
 */
function cleaningDuration(arrival) {
  // Oxwash doesn't operate on saturday/sunday
  // Check if arrival date is on sunday, friday, or saturday
  let delay = 0
  if (arrival.date() === 0) {
    delay += 24
  } else if (arrival.date() === 5) {
    delay += 48
  } else if (arrival.date() === 6) {
    delay += 72
  }

  return config.timing.hoursToClean + delay
}

module.exports = {
  arrival,
  shippingClass,
  shippingClassHours,
  formatAddress,
  cleaningDuration,
}