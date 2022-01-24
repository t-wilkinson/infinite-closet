'use strict'
// const fs = require('fs')
const templateData = require('email-templates/src/utils/data')

async function send(...props) {
  await strapi.plugins['email'].services.email.send(...props)

  // If testing save email to file
  if (process.env.NODE_ENV === 'test') {
    // const email = Buffer.from(res, 'base64').toString('utf-8')
    // const snapshots = './tests/__snapshots__/emails'
    // if (!fs.existsSync(snapshots)) {
    //   fs.mkdirSync(snapshots, { recursive: true })
    // }
    // await fs.writeFileSync(`${snapshots}/${new Date().toISOString()}`, email)
  }
}

function toEmailAddress({ fullName, name, firstName, lastName, email }) {
  if (!email) {
    throw new Error('Email must be defined')
  }

  name = fullName || name || [firstName, lastName].join(' ').trim()
  return {
    name,
    email,
  }
}

const unpackCartItem = (cartItem) =>
  strapi.plugins['orders'].services.cart.unpackCartItem(cartItem)

module.exports = {
  /*
   * Order lifecycle
   */
  async orderConfirmation({ contact, cart, summary, address } = templateData.defaultData['order-confirmation']) {
    console.log(contact)
    const recommendations = await strapi.services.product.recommendations()
    await send({
      template: 'order-confirmation',
      to: toEmailAddress(contact),
      bcc:
        process.env.NODE_ENV === 'production'
          ? ['info@infinitecloset.co.uk']
          : [],
      subject: `We've got your order`,
      data: {
        firstName: contact.nickName,
        contact,
        cart,
        address,
        summary,
        recommendations,
      },
    })
  },

  async orderShipped(cartItem = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'order-shipped',
      to: toEmailAddress(user),
      subject: `Your order is on it's way`, // `Your order of ${order.product.name} by ${order.product.designer.name} has shipped!`,
      data: {
        user,
        firstName: user.firstName,
        cartItem,
      },
    })
  },

  //   async orderStarting(cartItem) {
  //     const { order, user } = unpackCartItem(cartItem)
  //     await send({
  //       template: 'order-starting',
  //       to: toEmailAddress(user),
  //       subject: `Your order of ${order.product.name} by ${order.product.designer.name} is arriving today`,
  //       data: {
  //         user,
  //         firstName: user.firstName,
  //         cartItem,
  //       },
  //     })
  //   },

  async orderEnding(cartItem = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'order-ending',
      to: toEmailAddress(user),
      bcc:
        process.env.NODE_ENV === 'production'
          ? [
            'battersea@oxwash.com',
            'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
          ]
          : [],
      subject: `Your rental is ending soon`, // `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
      data: { cartItem, firstName: user.firstName, user },
    })
  },

  async orderReceived(cartItem = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'order-received',
      to: toEmailAddress(user),
      subject: `We've received your return`, // `Your order of ${order.product.name} by ${order.product.designer.name} has been received`,
      data: { user, cartItem, firstName: user.firstName },
    })
  },

  async orderReview(cartItem = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'order-review',
      to: toEmailAddress(user),
      subject: `What did you think?`,
      data: { user, cartItem, firstName: user.firstName },
    })
  },

  /*
   * Non user-facing
   */
  async trustPilot(cartItem = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'trust-pilot',
      to: 'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
      data: { cartItem, user, firstName: user.firstName },
    })
  },

  async orderShippingFailure(order = {}, err = {}) {
    await send({
      template: 'order-shipping-failure',
      to: 'info@infinitecloset.co.uk',
      subject: 'Failed to ship order',
      data: { order, error: err },
    })
  },

  /*
   * Money
   */
  async giftCard({ firstName, giftCard } = templateData.defaultData['gift-card']) {
    const recommendations = await strapi.services.product.recommendations()
    await send({
      template: 'gift-card',
      subject: `You've received a gift card`,
      data: {
        firstName,
        giftCard,
        recommendations,
      },
    })
  },

  async storeCredit({ firstName, amount } = templateData.defaultData['store-credit']) {
    const recommendations = await strapi.services.product.recommendations()
    await send({
      template: 'store-credit',
      subject: `You have store credit!`,
      data: {
        firstName,
        amount,
        recommendations,
      },
    })
  },
}
