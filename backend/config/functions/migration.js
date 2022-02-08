const version = require('../../package.json').version
const { toId, } = require('../../utils')

const migrations = {}

migrations['0.1.0'] = async () => {
  const marketing = strapi.services.mailchimp.marketing
  const listId = strapi.services.mailchimp.config.ids('list')
  const storeId = strapi.services.mailchimp.config.ids('store')

  // Sync store store
  const store = {
    id: storeId,
    list_id: listId,
    name: 'Infinite Closet',
    currency_code: 'GBP',
    domain: 'infinitecloset.co.uk',
    email_address: 'info@infinitecloset.co.uk',
    money_format: '£',
    primary_locale: 'en-gb',
    timezone: 'Europe/London',
  }

  try {
    const { id } = await marketing.ecommerce.getStore(storeId)
    if (!id) {
      throw new Error(`Could not find ${id}`)
    } else {
      // await marketing.ecommerce.updateStore(storeId, store)
    }
  } catch {
    await marketing.ecommerce.addStore(store)
  }

  await strapi.services.mailchimp.sync.product.all()
  await strapi.services.mailchimp.sync.cart.all()
}

migrations['0.2.0'] = async () => {
  const users = await strapi.query('user', 'users-permissions').find({}, [])
  await Promise.all(
    users.map(async (user) => {
      const contact = await strapi.services.contact.upsertContact(
        strapi.services.contact.toContact(user)
      )
      await strapi.query('user', 'users-permissions').update(
        { id: user.id },
        {
          contact: contact?.id,
        }
      )
    })
  )

  const orders = await strapi
    .query('order', 'orders')
    .find({}, ['user', 'product'])
  await Promise.all(
    orders.map(async (order) => {
      // If order has already been updated
      if (order.expectedStart || order.shipment) {
        return
      }

      // Contact
      const contact = await strapi.services.contact.upsertContact(
        strapi.services.contact.toContact(order)
      )

      let orderStatus
      let shipmentStatus
      let shipmentShippingStatus = 'normal'

      switch (order.status) {
        case 'cart':
        case 'list':
        case 'dropped':
          orderStatus = order.status
          break

        case 'error':
          orderStatus = 'dropped'
          break

        case 'planning':
          orderStatus = 'shipping'
          shipmentStatus = 'confirmed'
          break

        case 'shipping':
          orderStatus = 'shipping'
          shipmentStatus = 'shipped'
          break

        case 'cleaning':
          orderStatus = 'shipping'
          shipmentStatus = 'cleaning'
          break

        case 'completed':
          orderStatus = order.status
          shipmentStatus = order.status
          break

        case 'delayed':
          orderStatus = order.status
          shipmentShippingStatus = 'delayed'
          shipmentStatus = 'completed'
          break
      }

      let shipment
      if (order.shippingDate || shipmentStatus) {
        // Rental
        shipment = await strapi.query('shipment').create({
          shipmentId: order.shipment,
          shipped: order.shippingDate,
          status: shipmentStatus,
          shippingStatus: shipmentShippingStatus,
        })
      }

      // Order
      await strapi.query('order', 'orders').update(
        { id: order.id },
        {
          expectedStart: order.startDate,
          contact: contact?.id,
          shipment: shipment?.id,
          status: orderStatus,
        }
      )

      let purchase
      try {
        // Purchase
        purchase = await strapi.query('purchase').create({
          paymentIntent: order.paymentIntent,
          paymentMethod: order.paymentMethod,
          charge: order.charge,
          coupon: order.coupon,
          giftCard: order.giftCard,
          giftCardDiscount: order.giftCardDiscount,
          contact: contact?.id,
        })
      } catch {
        //
      }

      // Checkout
      await strapi.query('checkout').create({
        orders: [order.id],
        purchase: purchase?.id,
        address: toId(order.address),
        user: toId(order.user),
      })
    })
  )
}

module.exports = async () => {
  const migration = migrations[version]
  if (migration) {
    strapi.log.info(`Migrating to version ${version}`)
    await migration()
  }
}
