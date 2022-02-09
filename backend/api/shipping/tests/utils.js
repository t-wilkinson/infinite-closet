const timing = require('../services/timing')
const { day } = require('../../../utils')
const MockDate = require('mockdate')

const withinDate = (date, fn) => {
  MockDate.set(day().set(date).toDate())
  fn()
  MockDate.reset()
}

function getCutoffDays(cutoffOffset, daysToStart) {
  let orderedOn = day().add(cutoffOffset, 'hour')
  let startsOn = day().add(daysToStart, 'days')
  return { orderedOn, startsOn }
}

function cutoffShippingClass(config, cutoffOffset, daysToStart, expectedClass) {
  withinDate({ hour: config.timing.cutoff }, () => {
    const { orderedOn, startsOn } = getCutoffDays(cutoffOffset, daysToStart)
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

function aroundCutoff(config, daysToStart, shippingClassBefore, shippingClassAfter) {
  beforeCutoff(config, daysToStart, shippingClassBefore)
  afterCutoff(config, daysToStart, shippingClassAfter)
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
  timing.range({ expectedStart: date, rentalLength })

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

describe('Utils', () => {
  it('works', () => {
    let days
    days = getCutoffDays(1, 1)
    expect(days.startsOn.diff(days.orderedOn, 'hour')).toBe(23)

    days = getCutoffDays(1, 2)
    expect(days.startsOn.diff(days.orderedOn, 'hour')).toBe(47)
  })
})

module.exports = (config) => {
  return {
    // overlap{Date,Range}Edge effectively tests all functions except overlap
    overlapDateEdge: (...props) => expectOverlapEdge(...props, (x) => x),
    overlapRangeEdge: (...props) => expectOverlapEdge(...props, range),

    afterCutoff: (...props) => afterCutoff(config, ...props),
    beforeCutoff: (...props) => beforeCutoff(config, ...props),
    aroundCutoff: (...props) => aroundCutoff(config, ...props),
  }
}
