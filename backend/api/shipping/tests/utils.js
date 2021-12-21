const timing = require('../services/timing')
const { day } = require('../../../utils')
const MockDate = require('mockdate')

describe.skip('Utils', () => {
  it('works', () => {})
})

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

function findOverlapEdge(edge, shouldOverlap, notOverlap, overlap) {
  const maxIter = 15
  if (
    shouldOverlap > notOverlap &&
    edge.shouldOverlap === true &&
    edge.notOverlap === true
  ) {
    for (
      let notOverlap = shouldOverlap;
      notOverlap > shouldOverlap - maxIter;
      notOverlap--
    ) {
      if (overlap(shouldOverlap, notOverlap)) {
        expect({shouldOverlap, notOverlap}).toMatchObject({
          shouldOverlap: notOverlap + 1,
          notOverlap,
        })
        break
      }
    }
  } else if (
    shouldOverlap > notOverlap &&
    edge.shouldOverlap === false &&
    edge.notOverlap === false
  ) {
    for (
      let shouldOverlap = notOverlap;
      shouldOverlap < notOverlap + maxIter;
      shouldOverlap++
    ) {
      if (overlap(shouldOverlap, notOverlap)) {
        expect({shouldOverlap, notOverlap}).toMatchObject({
          shouldOverlap,
          notOverlap: shouldOverlap - 1,
        })
        break
      }
    }
  } else if (
    shouldOverlap < notOverlap &&
    edge.shouldOverlap === true &&
    edge.notOverlap === true
  ) {
    for (
      let notOverlap = shouldOverlap;
      notOverlap < shouldOverlap + maxIter;
      notOverlap++
    ) {
      if (overlap(shouldOverlap, notOverlap)) {
        expect({shouldOverlap, notOverlap}).toMatchObject({
          shouldOverlap: notOverlap - 1,
          notOverlap,
        })
        break
      }
    }
  } else if (
    shouldOverlap < notOverlap &&
    edge.shouldOverlap === false &&
    edge.notOverlap === false
  ) {
    for (
      let shouldOverlap = notOverlap;
      shouldOverlap > notOverlap - maxIter;
      shouldOverlap--
    ) {
      if (overlap(shouldOverlap, notOverlap)) {
        expect({shouldOverlap, notOverlap}).toMatchObject({
          shouldOverlap,
          notOverlap: shouldOverlap + 1,
        })
        break
      }
    }
  } else {
    throw new Error(`Unexpected values shouldOverlap=${shouldOverlap} and notOverlap=${notOverlap}`)
  }
}

const range = (date, rentalLength = 'short') =>
  timing.range({ startDate: date, rentalLength })

function overlapEdge(dow, shouldOverlap, notOverlap, transform) {
  const date = day().set({ day: dow, hour: 0 })
  shouldOverlap = date.add({ day: shouldOverlap })
  notOverlap = date.add({ day: notOverlap })
  return {
    shouldOverlap: timing.overlap(transform(shouldOverlap), range(date)),
    notOverlap: timing.overlap(transform(notOverlap), range(date)),
  }
}

function isEdge({ shouldOverlap, notOverlap }) {
  return shouldOverlap && !notOverlap
}

function expectOverlapEdge(dow, shouldOverlap, notOverlap, transform) {
  const edge = overlapEdge(dow, shouldOverlap, notOverlap, transform)

  if (!isEdge(edge)) {
    findOverlapEdge(edge, shouldOverlap, notOverlap, (s, n) =>
      isEdge(overlapEdge(dow, s, n, transform))
    )
  }

  expect(edge.shouldOverlap).toBe(true)
  expect(edge.notOverlap).toBe(false)
}

module.exports = (config) => {
  return {
    overlapDateEdge: (...props) => expectOverlapEdge(...props, (x) => x),
    overlapRangeEdge: (...props) => expectOverlapEdge(...props, range),
    afterCutoff: (...props) => afterCutoff(config, ...props),
    beforeCutoff: (...props) => beforeCutoff(config, ...props),
  }
}
