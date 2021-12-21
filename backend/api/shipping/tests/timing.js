/**
 * @group lib
 * @group shipping/timing
 */
'use strict'
const MockDate = require('mockdate')
const timing = require('../services/timing')
const { day } = require('../../../utils')
// const timezoneMock = require('timezone-mock')

// TODO: using MockDate switches to UTC timezone
// using timezoneMock to fix it breaks dayjs
// I think this is breaking multiple tests
const withinDate = (date, fn) => {
  // timezoneMock.register('Europe/London')
  MockDate.set(day().set(date).toDate())
  fn()
  MockDate.reset()
  // timezoneMock.unregister('Europe/London')
}

const pnt = (date) => date.format('YYYY-MM-DD hh:mm')

describe('Valid', () => {
  it.skip.each([
    [1, 1, 1],
    [16, 0, 0],
  ])(
    'Arrives %d days from now with %d available to be ordered, %d in stock',
    (days, available, quantity, existing = 0) => {
      withinDate({ hour: 1 }, () => {
        const start = day().add(days, 'day')
        console.log('*************************************')
        console.log(day().hour(), pnt(day()), pnt(start))
        const valid = timing.valid(start, available, quantity, existing)
        console.log(pnt(day()), pnt(start))
        console.log('*************************************')
        expect(valid).toBeTruthy()
      })
      withinDate({ date: 1, hour: 13 }, () => {
        const today = day().add(days, 'day')
        const valid = timing.valid(today, available, quantity, existing)
        expect(valid).toBeFalsy()
      })
    }
  )

  it.each([
    [0, 1, 1],
    [14, 0, 1],
  ])(
    'Does not arrive %d days from now, %d available to be ordered, %d in stock',
    (days, available, quantity, existing = 0) => {
      for (const hour of [0, 13]) {
        withinDate({ hour }, () => {
          const today = day().add(days, 'day')
          const valid = timing.valid(today, available, quantity, existing)
          expect(valid).toBeFalsy()
        })
      }
    }
  )
})
