'use strict'
// const fs = require('fs')
const templateData = require('email-templates/src/utils/data.cjs')

const trustPilotEmail = 'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com'

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
  async orderConfirmation(
    { isDefault, contact, cart, summary, address } = templateData.defaultData[
      'order-confirmation'
    ]
  ) {
    const recommendations = await strapi.services.product.recommendations()
    await send({
      template: 'order-confirmation',
      to: toEmailAddress(contact),
      bcc:
        process.env.NODE_ENV === 'production' && !isDefault
          ? ['info@infinitecloset.co.uk']
          : [],
      subject: `We've got your order`,
      data: {
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

  async orderEnding({ isDefault, ...cartItem } = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'order-ending',
      to: toEmailAddress(user),
      bcc:
        process.env.NODE_ENV === 'production' && !isDefault
          ? [
              // 'battersea@oxwash.com',
              trustPilotEmail,
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
   * Money
   */
  async giftCard(
    { email, firstName, giftCard } = templateData.defaultData['gift-card']
  ) {
    const recommendations = await strapi.services.product.recommendations()
    await send({
      template: 'gift-card',
      subject: `You've received a gift card`,
      to: email,
      data: {
        firstName,
        giftCard,
        recommendations,
      },
    })
  },

  async storeCredit(
    { firstName, amount } = templateData.defaultData['store-credit']
  ) {
    const recommendations = await strapi.services.product.recommendations()
    await send({
      template: 'store-credit',
      subject: `You have store credit!`,
      to: 'info+test@infinitecloset.co.uk',
      data: {
        firstName,
        amount,
        recommendations,
      },
    })
  },

  async forgotPassword(
    { url, user } = templateData.defaultData['forgot-password']
  ) {
    await send({
      template: 'forgot-password',
      to: user.email,
      subject: 'Password reset request',
      data: {
        url,
        user,
      },
    })
  },

  /*
   * Non user-facing
   */
  async contact(
    { name, email, message, phoneNumber } = templateData.defaultData[
      'contact-us'
    ]
  ) {
    await send({
      template: 'contact-us',
      to: { name, email: 'info@infinitecloset.co.uk' },
      subject: `[Contact] ${name} `,
      data: {
        name,
        email,
        phoneNumber,
        message,
      },
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

  /**
   * Mailchimp has a limit of items it will return
   * Reaching the limit means we need better algorithms
   * and there are potential performance issues
   */
  async mailchimpLimitReached(error) {
    await send({
      to: 'info@infinitecloset.co.uk',
      subject: `Mailchimp api data limit reached`,
      text: `
${error.message}

${error.stack}
`,
    })
  },

  async trustPilot(cartItem = templateData.cartItem) {
    const { user } = unpackCartItem(cartItem)
    await send({
      template: 'order-ending',
      to: 'info@infinitecloset.co.uk',
      bcc: process.env.NODE_ENV === 'production' ? [trustPilotEmail] : [],
      subject: `Your rental is ending soon`,
      data: { cartItem, firstName: user.firstName, user },
    })
  },

  async wardrobeItemCreation({user, status}) {
    if (!user) {
      return
    }
    await send({
      template: 'create-wardrobe-item',
      status,
      user,
      firstName: user.firstName,
    })
  }
}
