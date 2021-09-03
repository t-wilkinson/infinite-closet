const pricingApi = require('../../plugins/orders/services/price')
// const { createOrder } = require('./factory')

describe('Total Price', () => {
  it('should sum', async () => {
    const totalPrice = await pricingApi.totalPrice({
      insurance: {},
      cart: [],
      user: undefined,
    })
    expect(totalPrice.total).toBe(0)
  })
})
