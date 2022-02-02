const stripe = require('stripe')(process.env.STRIPE_KEY)
const { splitName } = require('../../../utils')

/**
 * @typedef {object} Contact
 * @prop {string} fullName
 * @prop {string} nickName
 * @prop {string} email
 */

/**
 * Convert request body to more useful information
 * @returns - {summary, cart, paymentIntent, paymentMethod}
 */
async function prepareData(body, user = null) {
  let error = null
  const cart = await strapi.plugins['orders'].services.cart.createValidCart(
    body.orders
  )

  // Ensure contact has right content
  let contact = body.contact
  if (user) {
    contact = strapi.services.contact.toContact(user)
  } else if (contact && contact.fullName) {
    const name = splitName(contact.fullName)
    contact.firstName = name.firstName || contact.firstName
    contact.lastName = name.lastName || contact.lastName
  }

  const summary = await strapi.plugins['orders'].services.price.summary({
    cart,
    user,
    discountCode: body.discountCode,
  })

  let paymentIntent, paymentMethod
  if (body.paymentIntent) {
    paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntent)
  }
  if (body.paymentMethod) {
    paymentMethod = await stripe.paymentMethods.retrieve(body.paymentMethod)
  }

  if (cart.length === 0) {
    error = 'Cart is empty or has no valid items to checkout.'
  }

  if (paymentIntent && paymentIntent.amount !== summary.amount) {
    error = 'Payment intent invalid.'
  }

  return {
    error,
    user,
    address: body.address,
    contact,
    summary,
    cart,
    paymentIntent,
    paymentMethod,
  }
}

/**
 * Core function used by all checkout methods which handles administrative tasks
 * On checkout, we need to:
 *  - Validate address
 *  - Update information about orders (change status, etc.)
 *  - Send an email to the client
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
  strapi.plugins['orders'].services.lifecycle.on['confirmed']({
    user,
    cart,
    contact,
    summary,
    address,
    paymentIntent,
    paymentMethod,
  })
}

module.exports = {
  onCheckout,
  prepareData,
}
