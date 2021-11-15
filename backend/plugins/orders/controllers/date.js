'use strict'

/**
 * Determines if an order date is valid by calculating the number of overlapping orders
 */
function isDateValid({ date, quantity, orders, rentalLength }) {
  if (orders.length === 0) {
    return strapi.services.timing.valid(
      date,
      quantity, // If no orders exist for that product then numAvailable=quantity
      quantity
    )
  } else {
    const range = strapi.services.timing.range({
      startDate: date,
      rentalLength,
    })

    const overlaps = strapi.plugins['orders'].services.order.totalOverlaps(
      range,
      orders
    )

    return strapi.services.timing.valid(
      date,
      quantity - overlaps,
      quantity,
      orders.length
    )
  }
}

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

    // For each date, determine if order can be made
    let validDates = {}
    for (const date of dates) {
      validDates[date] = isDateValid({ date, quantity, orders, rentalLength })
    }

    ctx.send({ valid: validDates })
  },
}
