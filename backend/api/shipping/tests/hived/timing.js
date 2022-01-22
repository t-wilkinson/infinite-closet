/**
 * @group lib
 * @group shipping/timing
 * @group shipping/timing/hived
 */
'use strict'
const timing = require('../../services/timing')
const config = require('../../services/hived/config')
const { providerName } = require('../../services/shipment')
const { day } = require('../../../../utils')
const { afterCutoff, beforeCutoff, overlapDateEdge, overlapRangeEdge } = require('../utils')(config)

const describeIf = providerName === 'hived' ? describe : describe.skip

describeIf('Order arrives', () => {
  const cutoff = config.timing.cutoff
  const today = day().set({ hour: cutoff, minute: 0, second: 0 })

  it.each([
    [today.set({ hour: 1 }), today.add({ day: 1 })],
    [today.set({ hour: cutoff + 1 }), today.add({ day: 2 })],
  ])('When sent on %j, arrives on %j', (sent, expects) => {
    const arrives = timing.arrival(sent, 'one')
    expect(expects.utc().isSame(arrives.utc(), 'hour')).toBeTruthy()
  })
})

describeIf('Order arrives', () => {
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

describeIf('Order ships (when ordered before cutoff time)', () => {
  it('in one day when order starts in one day', () => {
    beforeCutoff(1, 'one')
  })

  it('in two days when order starts in two days', () => {
    beforeCutoff(2, 'two')
  })
})

describeIf('Order ships (when ordered after cutoff time)', () => {
  it.skip('has one day shipping when order starts in two days', () => {
    afterCutoff(2, 'one')
  })

  it('has two day shipping when order starts in three days', () => {
    afterCutoff(3, 'two')
  })
})

describeIf('Order does not ship', () => {
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

describeIf('Overlaps', () => {
  // TODO: day of the week affects the results (because Oxwash doesn't deliver on weekends)
  // at 3 days we don't overlap with the end
  // at 5 days we don't overlap with the cleaners
  // at 9 (on friday) - 6 (on sunday) days we don't overlap with the completed order

  it.each([
    [1, -2, -8],
    [1, 8, 9],
  ])(
    'Range edge should overlap with date=%j but not with date=%j',
    (dow, shouldOverlap, notOverlap) => {
      overlapDateEdge(dow, shouldOverlap, notOverlap)
    }
  )

  it.each([
    [1, -10, -11],
    [1, 11, 12],
  ])(
    'Range edge should overlap with range=%j but not with range=%j',
    (dow, shouldOverlap, notOverlap) => {
      overlapRangeEdge(dow, shouldOverlap, notOverlap)
    }
  )
})
