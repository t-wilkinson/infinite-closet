'use strict'

// const marketing = require('../marketing')
// const storeId = () => strapi.services.mailchimp.config.ids('store')

// const toMailchimp = async ([email, orders]) => {
//   const lines = orders.map((order) => {
//     const price = strapi.plugins['orders'].services.price.orderPrice(order)
//     return {
//       id: order.id,
//       product_id: order.product.id,
//       product_variant_id: `${order.product.id}_${order.size}`,
//       quantity: 1,
//       price: price.productPrice + price.insurancePrice,
//       discount: 0,
//     }
//   })

//   const contact = await marketing.lists.getListMember(
//     strapi.services.mailchimp.config.ids('list'),
//     email
//   )

//   return {
//     id: email,
//     customer: { id: contact.id },
//     currency_code: 'GBP',
//     lines,
//     shipping_total: orders.reduce(
//       (total, order) =>
//         total +
//         strapi.plugins['orders'].services.price.orderPrice(order).shippingPrice,
//       0
//     ),
//   }
// }

// const item = {
//   async add(localItem) {
//     await marketing.ecommerce.addStoreOrder(storeId(), await toMailchimp(localItem))
//   },
//   async delete(_, mailchimpItem) {
//     await marketing.ecommerce.deleteOrder(storeId(), mailchimpItem.id)
//   },
//   async update(localItem) {
//     const [email] = localItem
//     await marketing.ecommerce.updateOrder(
//       storeId(),
//       email,
//       await toMailchimp(localItem)
//     )
//   },
// }

// const list = async () => {
//   let res

//   // Sync orders
//   const localOrders = await strapi.query('order', 'orders').find(
//     {
//       status: 'cart',
//     },
//     ['user', 'product']
//   )

//   // Split orders by user
//   const carts = localOrders.reduce((carts, order) => {
//     const email = order.email || order.user?.email
//     if (!carts[email]) {
//       carts[email] = []
//     }
//     carts[email].push(order)
//     return carts
//   }, {})

//   // Mailchimp Orders
//   res = await marketing.ecommerce.getStoreOrders(storeId(), {
//     count: 1000,
//     fields: ['id'],
//   })

//   if (res.orders.length >= 1000) {
//     const err = new Error('Orders list too long')
//     strapi.services.template_email.mailchimpLimitReached(err)
//     throw err
//   }

//   await strapi.services.mailchimp.sync.list(
//     item,
//     { list: Object.entries(carts), toKey: ([email]) => email },
//     { list: res.orders, toKey: (order) => order.id }
//   )
//   strapi.log.info('Sync mailchimp store', res)
// }

// module.exports = {
//   item,
//   list,
// }
