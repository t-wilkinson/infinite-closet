'use strict'

module.exports = {
  async range(ctx) {
    const body = ctx.request.body
    const range = strapi.plugins['orders'].services.date.range(body)
    ctx.send({ range })
  },

  async datesValid(ctx) {
    const body = ctx.request.body
    const {
      product,
      rentalLength,
      size: { quantity, size },
    } = body

    let orders = await strapi
      .query('order', 'orders')
      .find({ product: product.id, size }, [])
    orders = await Promise.all(
      orders.map(async (order) => {
        order.range = strapi.plugins['orders'].services.date.range(order)
        order.product = await strapi
          .query('product')
          .findOne({ id: order.product }, ['sizes'])
        return order
      })
    )

    let validDates = {}
    // prettier-ignore
    for (const date of body.dates) {
      if (orders.length === 0) {
        validDates[date] = strapi.plugins['orders'].services.date.valid(date, quantity)
        continue
      }

      const key = strapi.plugins['orders'].services.order.toKey(orders[0]) // all orders have the same key
      const dates = { [key]: [strapi.plugins['orders'].services.date.dateRange(date, rentalLength)] }
      const numAvailable = strapi.plugins['orders'].services.order.numAvailable(orders, dates)[key]

      validDates[date] = strapi.plugins['orders'].services.date.valid(date, numAvailable, quantity)
    }

    ctx.send({ valid: validDates })
  },
}
