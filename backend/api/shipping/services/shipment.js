const { day } = require('./utils')
const hived = require('./utils/hived')

const HOURS_IN_DAY = 24

/**
 * Determine when an item will likely arrive, given shipping info
 * @param {DayLike} sent - When the item is sent
 * @param {ShippingClass} shippingClass
 * @returns {DateLike} When item will arrive
 */
function arrival(sent, shippingClass = 'one') {
  sent = day(sent)
  const hoursSendClient = hived.config.shippingClassesHours[shippingClass]
  const offset = sent.hour() > hived.config.cutoff ? HOURS_IN_DAY : 0
  return sent.add(hoursSendClient + offset, 'hours').hour(hived.config.cutoff)
}

/**
 * Returns cheapest {@link ShippingClass} given time constraints on when it can leave and arrive.
 * @param {=DateLike} earliestDeliveryDate
 * @param {DateLike} startsOn
 * @returns {ShippingClass}
 */
function shippingClass(earliestDeliveryDate, startsOn) {
  earliestDeliveryDate = day(earliestDeliveryDate)
  startsOn = day(startsOn)

  if (!earliestDeliveryDate) {
    return undefined
  }
  if (startsOn.isSameOrAfter(arrival(earliestDeliveryDate, 'two'), 'day')) {
    return 'two'
  } else if (
    startsOn.isSameOrAfter(arrival(earliestDeliveryDate, 'one'), 'day')
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
    hived.config.shippingClassesHours[
      shippingClass(earliestDeliveryDate, startsOn)
    ] || hived.config.shippingClassesHours.two
  )
}

module.exports = {
  arrival,
  shippingClass,
  shippingClassHours,
  ...hived.api,
}
