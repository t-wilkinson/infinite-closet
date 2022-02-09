/**
 * @group api
 * @group shipping/timing
 * @group shipping/timing/acs
 */
'use strict'
const config = require('../../services/acs/config')
const { providerName } = require('../../services/shipment')
// const { day } = require('../../../../utils')
const { aroundCutoff, overlapDateEdge, overlapRangeEdge } =
  require('../utils')(config)

const describeIf = providerName === 'acs' ? describe : describe.skip

describeIf('Order (doesn\'t) ship around cutoff', () => {
  test('passed invalid values', () => {
    aroundCutoff(-1, undefined, undefined)

    aroundCutoff('<test>', undefined, undefined)
  })

  test('when order starts today', () => {
    aroundCutoff(0, undefined, undefined)
  })

  test('when order starts in 1 day', () => {
    aroundCutoff(1, 'one', undefined)
  })

  test('when order starts in 2 days', () => {
    aroundCutoff(2, 'two', 'one')
  })

  test('when order starts in 3 days', () => {
    aroundCutoff(3, 'two', 'two')
  })
})

describeIf('Overlaps', () => {
  it.each([
    // dow shouldOverlap notOverlap
    [0, -2, -3],
    [0, 4, 5],
    [1, -2, -3],
    [1, 4, 5],
    [2, -2, -3],
    [2, 4, 5],
    [3, -2, -3],
    [3, 4, 5],
    [4, -2, -3],
    [4, 4, 5],
    [5, -1, -2], // TODO: should be -2 -3
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
    // dow shouldOverlap notOverlap
    [0, -9, -10],
    [0, 7, 8],
    [1, -9, -10],
    [1, 7, 8],
    [2, -9, -10],
    [2, 7, 8],
    [3, -9, -10],
    [3, 7, 8],
    [4, -9, -10],
    [4, 7, 8],
    [5, -8, -9], // TODO: should be -9 -10
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
