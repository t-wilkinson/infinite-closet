'use strict'
const { sanitizeEntity } = require('strapi-utils')
const { toFullName, toId } = require('../../../utils')

/**
 * @typedef CartItem
 * @prop {object} order
 * @prop {number} totalPrice
 * @prop {number} shippingPrice
 * @prop {number} insurancePrice
 * @prop {number} productPrice
 * @prop {DateRange} range
 * @prop {ShippingClass} shippingClass
 */

/**
 * For each order, find the number of existing orders whose lifecycle overlaps
 * @param {Order[]} orders
 * @returns {object<string,number>}
 */
async function numAvailable(orders = []) {
  const available = {}

  for (const order of orders) {
    const key = strapi.services.product.toKey(order)
    if (available[key]) {
      continue
    }

    const existingOrders = await strapi.plugins[
      'orders'
    ].services.rental.existingOrders(order)
    available[key] = await strapi.plugins[
      'orders'
    ].services.order.totalAvailable(order, existingOrders)
  }

  return available
}

async function createCartItem(order) {
  order = await strapi
    .query('order', 'orders')
    .findOne({ id: toId(order) }, [
      'address',
      'product.images',
      'product.designer',
      'user',
      'shipment',
    ])
  order.product.sizes = await strapi
    .query('product')
    .findOne({ id: order.product.id }, ['sizes'])
    .then((res) => res.sizes)
  const price = strapi.plugins['orders'].services.price.orderPrice(order)

  return {
    order,
    ...price,
    totalPrice: Object.values(price).reduce((total, price) => total + price, 0),
    range: strapi.plugins['orders'].services.order.range(order),
    shippingClass: strapi.plugins['orders'].services.order.shippingClass(
      order
    ),
  }
}

/**
 * @param CartItem
 */
function unpackCartItem(cartItem) {
  return {
    cartItem,
    order: cartItem.order,
    user: cartItem.order.user,
  }
}

async function createAvailableCartItem(numAvailableOrders, order) {
  const quantity = await strapi.services.product.quantity(order)
  const key = strapi.services.product.toKey(order)
  const existingOrders = await strapi.plugins['orders'].services.rental.numExistingOrders(order)

  const valid = strapi.services.timing.valid(
    order.expectedStart,
    numAvailableOrders[key],
    quantity,
    existingOrders
  )

  const cartItem = await createCartItem(order)

  return {
    ...cartItem,
    valid,
    available: numAvailableOrders[key],
  }
}

async function create(orders) {
  const numAvailableOrders = await numAvailable(orders)

  // add price and available quantity to each order
  const settledOrders = await Promise.allSettled(
    orders.map((order) => createAvailableCartItem(numAvailableOrders, order))
  )

  return settledOrders
    .filter((v) => v.status === 'fulfilled')
    .map((value) => value.value)
}

async function createValidCart(orders) {
  const cart = await create(orders)
  return validItems(cart)
}

function validItems(cart) {
  return cart.filter((item) => item.valid)
}

function orders(cart) {
  return cart.map((item) => item.order)
}

function validOrders(cart) {
  return orders(validItems(cart))
}

function sanitizeOrder(order) {
  return sanitizeEntity(order, {
    model: strapi.query('order', 'orders').model,
  })
}

function sanitizeOrders(orders) {
  return orders.map(sanitizeOrder)
}

function sanitizeCart(cart) {
  return cart.map((cartItem) => ({
    ...cartItem,
    order: sanitizeOrder(cartItem.order),
  }))
}

/**
 * Core function used by all checkout methods which handles necessary checkout functions
 * On checkout, we need to:
 *  - Validate address
 *  - Update information about orders (change status, etc.)
 *  - Send an email to the client
 *  - Ship order
 *  - etc.
 */
async function onCheckout({
  user,
  contact,
  address,
  cart,
  summary,
  paymentIntent,
  paymentMethod,
}) {
  // Create/update address
  const addressParams = {
    email: contact.email,
    fullName: toFullName(contact),
  }
  switch (typeof address) {
    case 'object':
      address = await strapi
        .query('address')
        .create({ ...addressParams, ...address })
      break
    case 'string':
    case 'number':
      address = await strapi
        .query('address')
        .update({ id: address }, addressParams)
      break
  }

  // Validate address
  const isAddressValid = await strapi.services.shipment.validateAddress(address)
  if (!isAddressValid && process.env.NODE_ENV === 'production') {
    throw new Error('Expected a valid address.')
  }

  // Contact
  contact = await strapi.services.contact.upsertContact(contact)

  // Purchase
  const purchase = await strapi.query('purchase').create({
    paymentIntent: paymentIntent?.id,
    paymentMethod: paymentMethod?.id,
    charge: summary.total,
    coupon: summary.coupon?.id,
    giftCard: summary.giftCard?.id,
    giftCardDiscount: summary.giftCardDiscount,
    contact: contact?.id,
  })

  // Checkout
  const orderIds = strapi.plugins['orders'].services.cart
    .orders(cart)
    .map((order) => toId(order.id))
  const checkout = await strapi.query('checkout').create({
    orders: orderIds,
    address: address.id,
    purchase: purchase.id,
    user: user?.id,
    contact: contact?.id,
  })

  if (user && !user?.contact) {
    strapi.query('user', 'users-permissions').update(
      { id: toId(user) },
      { contact: toId(contact), }
    )
  }

  // Forward lifecycle of each order
  const settled = await Promise.allSettled(
    cart.map(async (cartItem) => {
      const shipment = await strapi.query('shipment').create({
        shippingClass: cartItem.shippingClass,
      })
      const order = await strapi.query('order', 'orders').update(
        { id: toId(cartItem.order) },
        {
          status: 'shipping',
          checkout: toId(checkout),
          contact: toId(contact),
          user: toId(user),
          address: toId(address),
          shipment: toId(shipment),
        }
      )

      // ACS expects orders asap
      if (strapi.services.shipment.providerName === 'acs') {
        await strapi.plugins['orders'].services.ship.shipOrderToClient(order)
      }
    })
  )

  // Error handling
  const failed = settled
    .filter((res) => res.status === 'rejected')
    .map((res) => res.reason)
  if (failed.length > 0) {
    strapi.log.error('Failed to prepare cart for shipping', { failed, settled, purchase, contact })
  }

  strapi.services.template_email.orderConfirmation({
    contact,
    summary,
    cart,
    address,
  })

  return checkout
}

module.exports = {
  create,
  createCartItem,
  unpackCartItem,
  numAvailable,

  createValidCart,
  validItems,
  validOrders,
  orders,

  sanitizeOrder,
  sanitizeCart,
  sanitizeOrders,

  onCheckout,
}
