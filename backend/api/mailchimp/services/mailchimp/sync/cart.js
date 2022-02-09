'use strict'

const _ = require('lodash')
const marketing = require('../marketing')
const { ids } = require('../config')
const storeId = ids('store')

const toMailchimp = async (email, orders) => {
  let res

  const lines = orders.map((order) => {
    const price = strapi.plugins['orders'].services.price.orderPrice(order)
    return {
      id: order.id.toString(),
      product_id: order.product.id.toString(),
      product_variant_id: `${order.product.id}_${order.size}`,
      quantity: 1,
      price: price.productPrice + price.insurancePrice,
    }
  })

  let customer
  const hash = strapi.services.contact.toHash(email)
  try {
    res = await marketing.lists.getListMember(ids('list'), hash)
    customer = { id: res.id, email_address: email, opt_in_status: true }
  } catch {
    customer = {
      opt_in_status: true,
      email_address: email,
      id: hash,
    }
  }

  return {
    id: email,
    currency_code: 'GBP',
    // TODO: does mailchimp us emails as id for customer?
    customer,
    lines,
    order_total: lines.reduce((total, order) => total + order.price, 0),
  }
}

const sync = {
  async add(key, localItem) {
    await marketing.ecommerce.addStoreCart(
      storeId,
      await toMailchimp(key, localItem)
    )
  },
  async delete(key) {
    await marketing.ecommerce.deleteStoreCart(storeId, key)
  },
  async update(key, localItem) {
    await marketing.ecommerce.updateStoreCart(
      storeId,
      key,
      _.omit(await toMailchimp(key, localItem), ['id', 'customer'])
    )
  },
}

async function getLocalItems() {
  const orders = await strapi.query('order', 'orders').find(
    {
      status: 'cart',
    },
    ['contact', 'user', 'product']
  )

  // Split orders by user
  const carts = orders.reduce((carts, order) => {
    const key = order.contact?.email || order.user?.email
    if (!key) {
      return carts
    }
    if (!carts[key]) {
      carts[key] = []
    }
    carts[key].push(order)
    return carts
  }, {})

  return carts
}

async function getMailchimpItems() {
  const res = await marketing.ecommerce.getStoreCarts(storeId, {
    count: 1000,
    fields: ['total_items', 'carts.id'],
  })

  if (res.total_items >= 1000) {
    const err = new Error('Carts list too long')
    strapi.services.template_email.mailchimpLimitReached(err)
    throw err
  }

  const mailchimpCarts = (res.carts || []).reduce((carts, cart) => {
    carts[cart.id] = cart
    return carts
  }, {})

  return mailchimpCarts
}

const all = async () => {
  try {
    await strapi.services.mailchimp.sync.all(
      sync,
      await getLocalItems(),
      await getMailchimpItems()
    )
  } catch (e) {
    console.log(e, e.stack, e.message)
  }
  strapi.log.info('Sync mailchimp cart')
}

module.exports = {
  toMailchimp,
  getLocalItems,
  getMailchimpItems,
  sync,
  all,
}
