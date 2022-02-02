const version = require('../../package.json').version

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

migrations['0.1.1'] = async () => {
  const users = await strapi.query('user', 'users-permissions').find({}, [])
  await Promise.all(users.map(async user => {
    const contact = await strapi.services.contact.upsertContact(strapi.services.contact.toContact(user))
    await strapi.query('user', 'users-permissions').update({ id: user.id }, {
      contact: contact?.id,
    })
  }))

  const orders = await strapi.query('order', 'orders').find({}, ['user', 'product'])
  await Promise.all(orders.map(async order => {
    // Contact
    const contact = await strapi.services.contact.upsertContact(strapi.services.contact.toContact(order))

    // Purchase
    await strapi.query('purchase').create({
      paymentIntent: order.paymentIntent,
      paymentMethod: order.paymentMethod,
      charge: order.charge,
      coupon: order.coupon,
      giftCard: order.giftCard,
      giftCardDiscount: order.giftCardDiscount,
      contact: contact?.id,
    })

    // Rental

    await strapi.query('order', 'orders').update({ id: order.id }, {
      contact: contact?.id,
      // rental: rental?.id,
    })
  }))
}

module.exports = async () => {
  await migrations[version]?.()
}
