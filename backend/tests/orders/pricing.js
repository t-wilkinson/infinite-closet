const pricingApi = require('../../plugins/orders/services/price')
// const { createOrder } = require('./factory')

describe.skip('Total Price', () => {
  it('should sum', async () => {
    const totalPrice = await pricingApi.summary({
      cart: [],
      user: undefined,
    })
    expect(totalPrice.total).toBe(0)
  })
})
