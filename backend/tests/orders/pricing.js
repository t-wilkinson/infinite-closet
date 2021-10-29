const pricingApi = require('../../plugins/orders/services/price')
const { mockOrderData } = require('./factory')

describe.skip('Total Price', () => {
  it('Total price is calculated', async () => {
    const orderData = mockOrderData()
    const price = pricingApi.orderPrice(orderData)
  })
})
