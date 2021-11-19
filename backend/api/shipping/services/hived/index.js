'use strict'
const api = require('./api')
const timing = require('./timing')
const shipment = require('./shipment')

module.exports = {
  shipment: {...shipment, ...api},
  timing,
}
