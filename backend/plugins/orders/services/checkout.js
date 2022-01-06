const stripe = require('stripe')(process.env.STRIPE_KEY)

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
  const cart = await strapi.plugins['orders'].services.cart.createValidCart(
    body.orders
  )

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
  return {
    address: body.address,
    contact: body.contact,
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
  contact,
  address,
  cart,
  summary,
  paymentIntent,
  paymentMethod,
}) {
  // Create/update address
  const mergeParams = { email: contact.email, fullName: contact.fullName }
  switch (typeof address) {
    case 'object':
      address = await strapi
        .query('address')
        .create({ ...mergeParams, ...address })
      break
    case 'string':
    case 'number':
      address = await strapi
        .query('address')
        .update({ id: address }, mergeParams)
      break
  }

  await Promise.all(
    cart.map((cartItem) =>
      strapi
        .query('order', 'orders')
        .update({ id: cartItem.order.id }, { address: address.id })
    )
  )

  // Validate address
  const isAddressValid = await strapi.services.shipment.validateAddress(address)
  if (!isAddressValid) {
    throw new Error('Expected a valid address.')
  }

  strapi.plugins['orders'].services.lifecycle.on['confirmed']({
    cart,
    contact,
    summary,
    address,
    paymentIntent: paymentIntent?.id || null,
    paymentMethod: paymentMethod?.id || null,
  })
}

module.exports = {
  onCheckout,
  prepareData,
}
