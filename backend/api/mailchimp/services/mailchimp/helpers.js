'use strict'

async function sync() {
  strapi.log.info('Update contact list')
  await strapi.services.contact.updateContactList()
  strapi.log.info('Update product list')
  await strapi.services.mailchimp.sync.product.all()
  strapi.log.info('Update cart list')
  await strapi.services.mailchimp.sync.cart.all()
}

module.exports = {
  sync,
}
