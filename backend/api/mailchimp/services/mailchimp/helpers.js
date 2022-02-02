'use strict'

async function sync() {
  await strapi.services.contact.updateContactList()
  await strapi.services.mailchimp.sync.product.all()
  await strapi.services.mailchimp.sync.cart.all()
}

module.exports = {
  sync,
}
