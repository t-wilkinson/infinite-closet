/**
 * @group lib
 */
const orderApi = require('../order')
const {day } = require('../../../../utils')
const { range } = require('../../../../api/shipping/services/timing')

const defaultOrderData = {
  status: 'cart',
  size: 'MD',
  startDate: new Date().toJSON(),
  shippingDate: null,
  rentalLength: 'short',
  address: {
    fullName: 'First Last',
    addressLine1: 'Line 1',
    addressLien2: 'Line 2',
    town: 'Town',
    postcode: 'Postcode',
  },
  paymentMethod: null,
  paymentIntent: null,
  shipment: null,
  product: null,
  user: null,
  insurance: false,
  coupon: null,
  charge: null,
  fullName: 'First Last',
  nickName: 'Nick name',
  email: 'firstlast@example.com',
}

const mockOrderData = (options = {}) => {
  return {
    ...defaultOrderData,
    ...options,
  }
}

describe.skip('Overlaps', () => {
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
      expects,
      date,
      { startDate = today.set({ day: 6 }), status = 'planning' } = {}
    ) => {
      const order = mockOrderData({ startDate, status })
      const dateRange = range({ startDate: date, rentalLength: 'short' })
      expect(orderApi.overlap(dateRange, order)).toBe(expects)
    }
  )
})
