const HOURS_IN_DAY = 24
const HOURS_TO_CLEAN = 1 * HOURS_IN_DAY // oxwash takes 24 hours to clean

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

  return HOURS_TO_CLEAN + delay
}

module.exports = { cleaningDuration }
