const MockDate = require('mockdate')
const timing = require('../../api/shipping/services/timing')

const withinDate = (day, fn) => {
  MockDate.set(timing.day().set(day).toDate())
  fn()
  MockDate.reset()
}

module.exports = {
  withinDate,
}
