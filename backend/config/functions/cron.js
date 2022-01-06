'use strict'
const { day } = require('../../utils')

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    strapi.services.contact.updateContactList()
    const helpers = strapi.plugins['orders'].services.helpers
    const ship = strapi.plugins['orders'].services.ship

    let orders = { }
    orders.all = await strapi
      .query('order', 'orders')
      .find({ status_in: ['planning', 'shipping'] }, [
        'product',
        'product.designer',
        'user',
        'address',
        'coupon',
      ])
    const filterOrders = (status) =>
      orders.all.filter((order) => order.status === status)
    orders.shipping = filterOrders('shipping')
    orders.planning = filterOrders('planning')
    orders.completed = filterOrders('completed')

    ship.ordersEnding(orders.shipping)
    helpers.notifyArrival(orders.shipping)

    // Send user email if they are recieving order today
    if (strapi.services.shipment.providerName === 'acs') {
      const today = day().utc()
      const isToday = (date) => today.isSame(day(date).utc(), 'day')
      for (const order of orders.all) {
        if (isToday(order.startDate)) {
          strapi.plugins['orders'].services.cart
            .createCartItem(order)
            .then((cartItem) =>
              strapi.services.template_email.orderShipped(cartItem)
            )
            .catch((err) =>
              strapi.plugins['orders'].services.ship.shippingFailure(order, err)
            )
        }
      }
    }

    if (strapi.services.shipment.providerName !== 'acs') {
      ship.shipOrders(orders.planning)
      // helpers.notifyAction(orders.planning)
    }

    // TODO!: also need to update order status (using api) when updating to completed, send the email
    helpers.ordersCompleted(orders.completed)
  },
}
