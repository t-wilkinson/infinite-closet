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
 * Change stage of cart items to 'planning' and update other information
 */
async function toPlanning({
  cart,
  contact,
  paymentIntent,
  summary,
  address,
  paymentMethod,
}) {
  const settled = await Promise.allSettled(
    strapi.plugins['orders'].services.cart.orders(cart).map((order) =>
      strapi.query('order', 'orders').update(
        { id: order.id },
        {
          address,
          paymentIntent: paymentIntent
            ? paymentIntent.id
            : paymentIntent || null,
          paymentMethod: paymentMethod
            ? paymentMethod.id
            : paymentMethod || null,
          status: 'planning',
          charge: strapi.plugins['orders'].services.price.orderPriceTotal(order),
          giftCard: summary.giftCard ? summary.giftCard.id : null,
          giftCardDiscount: summary.giftCardDiscount,
          coupon: summary.coupon ? summary.coupon.id : null,
          // couponDiscount: summary.couponDiscount,
          fullName: contact.fullName,
          nickName: contact.nickName,
          email: contact.email,
        }
      )
    )
  )

  const failed = settled.filter((res) => res.status === 'rejected')
  if (failed.length > 0) {
    strapi.log.error('Failed to prepare cart for shipping', failed)
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

  // Update information for orders in cart
  await toPlanning({
    cart,
    contact,
    summary,
    address,
    paymentIntent,
    paymentMethod,
  })

  strapi.plugins['orders'].services.lifecycle.on['confirmed']({
    cart,
    contact,
    summary,
    address,
  })
}

module.exports = {
  onCheckout,
  prepareData,
}
