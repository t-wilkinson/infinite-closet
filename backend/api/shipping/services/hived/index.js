'use strict'

const config = require('./config')

module.exports = {
  config,
  api: require('./api'),
  timing: {
    /**
     * Duration an order will spend at cleaners
     * @param {DateLike} arrival - When item first arrives at cleaners
     * @returns {number} Hours spend at cleaners
     */
    cleaningDuration(arrival) {
      // Oxwash doesn't operate on saturday/sunday
      // Check if arrival date is on sunday, friday, or saturday
      let delay = 0
      if (arrival.get('day') === 0) {
        delay += 24
      } else if (arrival.get('day') === 5) {
        delay += 48
      } else if (arrival.get('day') === 6) {
        delay += 72
      }

      return config.timing.hoursToClean + delay
    },
  },
}
