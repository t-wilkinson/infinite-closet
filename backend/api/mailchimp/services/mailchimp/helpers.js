'use strict'

const marketing = require('./marketing')
/**
 * @typedef {object} SyncList
 * Represents mailchimp/local lists that can be synced
 * @prop {item[]} list
 * @prop {(item) => string} toKey
 */

async function sync() {
  await strapi.services.contact.updateContactList()
  await strapi.services.mailchimp.sync.product.all()
  await strapi.services.mailchimp.sync.cart.all()
}

async function bootstrap() {
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

module.exports = {
  sync,
  bootstrap,
}
