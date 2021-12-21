/**
 * @group lib
 * @group shipping/timing
 * @group shipping/timing/acs
 */
'use strict'
const timing = require('../../services/timing')
const config = require('../../services/acs/config')
const { providerName } = require('../../services/shipment')
const { day } = require('../../../../utils')
const { afterCutoff, beforeCutoff, overlapDateEdge, overlapRangeEdge } = require('../utils')(config)

const describeIf = providerName === 'acs' ? describe : describe.skip

describeIf('timing timing', () => {
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
  it.skip('in one day when order starts in two days', () => {
    afterCutoff(2, 'one')
  })

  it('in two days when order starts in three days', () => {
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
  it.each([
    [0, -2, -3],
    [0, 4, 5],
    [1, -2, -3],
    [1, 4, 5],
    [2, -2, -3],
    [2, 4, 5],
    // [3, -2, -3],
    [3, 4, 5],
    [4, -2, -3],
    [4, 4, 5],
    [5, -2, -3],
    [5, 4, 5],
    [6, -2, -3],
    [6, 4, 5],
  ])(
    'Range edge dow=%j should overlap with date=%j but not with date=%j',
    (dow, shouldOverlap, notOverlap) => {
      overlapDateEdge(dow, shouldOverlap, notOverlap)
    }
  )

  it.each([
    [0, -9, -10],
    [0, 7, 8],
    [1, -9, -10],
    [1, 7, 8],
    [2, -9, -10],
    [2, 7, 8],
    // [3, -9, -10],
    [3, 7, 8],
    [4, -9, -10],
    [4, 7, 8],
    [5, -9, -10],
    [5, 7, 8],
    [6, -9, -10],
    [6, 7, 8],
  ])(
    'Range edge dow=%j should overlap with range=%j but not with range=%j',
    (dow, shouldOverlap, notOverlap) => {
      overlapRangeEdge(dow, shouldOverlap, notOverlap)
    }
  )
})
