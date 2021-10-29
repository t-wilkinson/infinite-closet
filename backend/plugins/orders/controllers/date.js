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
      .findOne({ id: product.id || product }, ['sizes'])
    const quantity = orderProduct.sizes.find((s) => s.size === size).quantity

    const orders = await strapi.plugins['orders'].services.order.relevantOrders(
      { size, product: orderProduct }
    )

    // Find if order can be made on each date
    let validDates = {}
    for (const date of dates) {
      if (orders.length === 0) {
        validDates[date] = strapi.services.timing.valid(
          date,
          quantity, // If no orders exist for that product then numAvailable=quantity
          quantity
        )
        continue
      } else {
        const range = strapi.services.timing.range({
          startDate: date,
          rentalLength,
        })

        const overlaps = strapi.plugins['orders'].services.order.totalOverlaps(
          range,
          orders
        )

        validDates[date] = strapi.services.timing.valid(
          date,
          quantity - overlaps,
          quantity,
          orders.length
        )
      }
    }

    ctx.send({ valid: validDates })
  },
}
