'use strict'

module.exports = {
  async range(ctx) {
    const body = ctx.request.body
    const range = strapi.services.timing.range(body)
    ctx.send({ range })
  },

  async availableOrderDates(ctx) {
    const body = ctx.request.body
    const { dates, product, rentalLength, size } = body

    const orderProduct = await strapi
      .query('product')
      .findOne({ id: product }, ['sizes'])
    const quantity = orderProduct.sizes.find((s) => s.size === size).quantity

    const matchingOrders = await strapi
      .query('order', 'orders')
      .find({ product, size }, []) // TODO: why can't we attach products.sizes

    // Attach product to orders
    const orders = matchingOrders.map((order) => {
      order.product = orderProduct
      return order
    })

    // For each date, find available product is available for order
    let validDates = {}
    // prettier-ignore
    for (const date of dates) {
      if (orders.length === 0) {
        validDates[date] = strapi.services.timing.valid(date, quantity, quantity)
        continue
      } else {
        const key = strapi.plugins['orders'].services.order.toKey(orders[0]) // all orders have the same key
        const dates = { [key]: [strapi.services.timing.dateRange(date, rentalLength)] }
        const numAvailable = strapi.plugins['orders'].services.order.numAvailable(orders, dates)[key]

        validDates[date] = strapi.services.timing.valid(date, numAvailable, quantity, orders.length)
      }
    }

    ctx.send({ valid: validDates })
  },
}
