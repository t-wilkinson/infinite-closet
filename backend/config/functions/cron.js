'use strict'

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    strapi.plugins['orders'].services.helpers.updateContactList()

    const orders = await strapi
      .query('order', 'orders')
      .find({ status_in: ['planning', 'shipping'] }, [
        'product',
        'product.designer',
        'user',
      ])
    const filterOrders = (status) =>
      orders.filter((order) => order.status === status)

    const shippingOrders = filterOrders('shipping')
    // strapi.plugins['orders'].services.helpers.sendToCleaners(shippingOrders)
    strapi.plugins['orders'].services.helpers.notifyArrival(shippingOrders)

    const planningOrders = filterOrders('planning')
    strapi.plugins['orders'].services.helpers.notifyAction(planningOrders)
  },
}
