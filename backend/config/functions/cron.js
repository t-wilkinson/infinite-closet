'use strict'

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    const orders = await strapi
      .query('order', 'orders')
      .find({ status: 'shipping' }, ['product', 'product.designer', 'user'])

    if (process.env.NODE_ENV === 'production') {
      strapi.plugins['orders'].services.helpers.sendToCleaners(orders)
      strapi.plugins['orders'].services.helpers.notifyArrival(orders)
    }
  },
}
