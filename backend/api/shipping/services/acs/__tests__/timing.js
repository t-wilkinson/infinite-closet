/**
 * @group lib
 */
'use strict'
const MockDate = require('mockdate')
const timing = require('../timing')
const config = require('../config')
const {day} = require('../../../../../utils')

const withinDate = (date, fn) => {
  MockDate.set(day().set(date).toDate())
  fn()
  MockDate.reset()
}

describe('timing timing', () => {
  const cutoff = config.timing.cutoff
  const today = day().set({ hour: cutoff, minute: 0, second: 0 })

  it.each([
    [today.set({ hour: 1 }), today.add({ day: 1 })],
    [today.set({ hour: cutoff + 1 }), today.add({ day: 2 })],
  ])('When sent on %j, arrives on %j', (sent, expects) => {
    const arrives = timing.arrival(sent)
    expect(expects.utc().isSame(arrives.utc(), 'hour')).toBeTruthy()
  })
})

describe('Order arrives', () => {
  let today = day()

  it('after it is sent', () => {
    const arrives = timing.arrival(today, 'one')
    expect(arrives.isAfter(today)).toBeTruthy()
  })

  it('sooner with one day shipping than two', () => {
    const arrivesSooner = timing.arrival(today, 'one')
    const arrivesLater = timing.arrival(today, 'two')
    expect(arrivesSooner.isBefore(arrivesLater)).toBeTruthy()
  })
})

function cutoffShippingClass(cutoffOffset, daysToStart, expectedClass) {
  withinDate({ hour: config.timing.cutoff + cutoffOffset }, () => {
    let orderedOn = day()
    let startsOn = orderedOn.add(daysToStart, 'days')
    const shippingClass = timing.shippingClass(orderedOn, startsOn)
    expect(shippingClass).toBe(expectedClass)
  })
}

function beforeCutoff(daysToStart, shippingClass) {
  cutoffShippingClass(-1, daysToStart, shippingClass)
}

function afterCutoff(daysToStart, shippingClass) {
  cutoffShippingClass(1, daysToStart, shippingClass)
}

describe('Order ships (when ordered before cutoff time)', () => {
  it('in one day when order starts in one day', () => {
    beforeCutoff(1, 'one')
  })

  it('in two days when order starts in two days', () => {
    beforeCutoff(2, 'two')
  })
})

describe('Order ships (when ordered after cutoff time)', () => {
  it.skip('in one day when order starts in two days', () => {
    afterCutoff(2, 'one')
  })

  it('in two days when order starts in three days', () => {
    afterCutoff(3, 'two')
  })
})

describe('Order does not ship', () => {
  it('when order started yesterday', () => {
    beforeCutoff(-1, undefined)
    afterCutoff(-1, undefined)
  })

  it('when order starts today', () => {
    beforeCutoff(0, undefined)
    afterCutoff(0, undefined)
  })

  it.skip('when order starts in one day', () => {
    afterCutoff(1, undefined)
  })
})
