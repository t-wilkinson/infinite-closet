const api = require('./api')
const shipment = require('./shipment')
const timing = require('./timing')

module.exports = {
  shipment: { ...api, ...shipment },
  timing,
}
