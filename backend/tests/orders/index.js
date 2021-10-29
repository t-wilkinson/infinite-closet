require('./pricing')
const { mockOrderData } = require('./factory')
const orderApi = require('../../plugins/orders/services/order')
const { day, range } = require('../../api/shipping/services/timing')

describe('Overlaps', () => {
  // TODO: day of the week affects the results (because Oxwash doesn't deliver on weekends)
  // at 3 days we don't overlap with the end
  // at 5 days we don't overlap with the cleaners
  // at 9 (on friday) - 6 (on sunday) days we don't overlap with the completed order
  const today = day().set({ day: 1, hour: 0 }) // day of week ranges from 0 (sunday) to 6 (saturday)

  it.each([
    [true, today],
    [false, today, { status: 'cart' }],

    [true, today.subtract({ day: 1 })],
    [false, today.subtract({ day: 2 })],

    [true, today.add({ day: 5 })],
    [false, today.add({ day: 6 })],
  ])(
    'Order lifecycle overlaps with date %j %j %j',
    (expects = true, date, { startDate = today, status = 'planning' } = {}) => {
      const order = mockOrderData({ startDate, status })
      expect(orderApi.overlap(date, order)).toBe(expects)
    }
  )

  it.each([
    [true, today],
    [false, today, { status: 'cart' }],

    [true, today.subtract({ day: 4 })],
    [false, today.subtract({ day: 5 })],

    [true, today.add({ day: 13 })],
    [false, today.add({ day: 14 })],
  ])(
    'Order lifecycle overlaps with another order %j %j %j',
    (
      expects = true,
      date,
      { startDate = today.set({ day: 6 }), status = 'planning' } = {}
    ) => {
      const order = mockOrderData({ startDate, status })
      const dateRange = range({ startDate: date, rentalLength: 'short' })
      expect(orderApi.overlap(dateRange, order)).toBe(expects)
    }
  )
})
