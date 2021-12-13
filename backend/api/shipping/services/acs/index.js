'use strict'

const config = require('./config')

module.exports = {
  config,
  api: require('./api'),
  timing: {
    cleaningDuration() {
      return config.timing.hoursToClean
    },
  },
}
