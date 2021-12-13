const timing = require('../timing')
const { day } = require('../../../../utils')
const MockDate = require('mockdate')

const withinDate = (date, fn) => {
  MockDate.set(day().set(date).toJSON())
  fn()
  MockDate.reset()
}

function cutoffShippingClass(config, cutoffOffset, daysToStart, expectedClass) {
  withinDate({ hour: config.timing.cutoff + cutoffOffset }, () => {
    let orderedOn = day()
    let startsOn = orderedOn.add(daysToStart, 'days')
    const shippingClass = timing.shippingClass(orderedOn, startsOn)
    expect(shippingClass).toBe(expectedClass)
  })
}

function beforeCutoff(config, daysToStart, shippingClass) {
  cutoffShippingClass(config, -1, daysToStart, shippingClass)
}

function afterCutoff(config, daysToStart, shippingClass) {
  cutoffShippingClass(config, 1, daysToStart, shippingClass)
}

function overlapDateEdge(dow, shouldOverlap, notOverlap) {
  const range = (date) =>
    timing.range({ startDate: date, rentalLength: 'short' })
  const date = day().set({ day: dow })
  shouldOverlap = date.add({ day: shouldOverlap })
  notOverlap = date.add({ day: notOverlap })
  expect(timing.overlap(shouldOverlap, range(date))).toBe(true)
  expect(timing.overlap(notOverlap, range(date))).toBe(false)
}

function overlapRangeEdge(dow, shouldOverlap, notOverlap) {
  const range = (date) =>
    timing.range({ startDate: date, rentalLength: 'short' })
  const date = day().set({ day: dow })
  shouldOverlap = date.add({ day: shouldOverlap })
  notOverlap = date.add({ day: notOverlap })
  expect(timing.overlap(range(shouldOverlap), range(date))).toBe(true)
  expect(timing.overlap(range(notOverlap), range(date))).toBe(false)
}

module.exports = (config) => {
  return {
    overlapDateEdge,
    overlapRangeEdge,
    afterCutoff: (...props) => afterCutoff(config, ...props),
    beforeCutoff: (...props) => beforeCutoff(config, ...props),
  }
}
