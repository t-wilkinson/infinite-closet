'use strict'
const fs = require('fs')

async function send(...props) {
  const res = await strapi.plugins['email'].services.email.send(...props)

  // If testing save email to file
  if (process.env.NODE_ENV === 'test') {
    const email = Buffer.from(res, 'base64').toString('utf-8')
    const snapshots = './tests/__snapshots__/emails'
    if (!fs.existsSync(snapshots)) {
      fs.mkdirSync(snapshots, { recursive: true })
    }
    await fs.writeFileSync(`${snapshots}/${new Date().toISOString()}`, email)
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
  async orderLeaving(cartItem) {
    const { order, user } = unpackCartItem(cartItem)
    await send({
      template: 'order-leaving',
      to: toEmailAddress(user),
      bcc:
        process.env.NODE_ENV === 'production'
          ? [
            'battersea@oxwash.com',
            'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
          ]
          : [],
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
      data: { ...cartItem, firstName: user.firstName },
    })
  },

  async trustPilot(cartItem) {
    const { order, user } = unpackCartItem(cartItem)
    await send({
      template: 'order-leaving',
      to: 'infinitecloset.co.uk+6c3ff2e3e1@invite.trustpilot.com',
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
      data: { ...cartItem, firstName: user.firstName },
    })
  },

  async orderArriving(cartItem) {
    const { order, user } = unpackCartItem(cartItem)
    await send({
      template: 'order-arriving',
      to: toEmailAddress(user),
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is arriving today`,
      data: {
        firstName: user.firstName,
      },
    })
  },

  async orderShippingFailure(order, err) {
    await send({
      template: 'order-shipping-failure',
      to: 'info@infinitecloset.co.uk',
      subject: 'Failed to ship order',
      data: { order, error: err },
    })
  },

  async shippingAction(cart) {
    await send({
      template: 'shipping-action',
      to: 'info@infinitecloset.co.uk',
      subject: 'Some orders need to be shipped today',
      data: { cart },
    })
  },

  async orderShipped(cartItem) {
    const { order, user } = unpackCartItem(cartItem)
    await send({
      template: 'order-shipped',
      to: toEmailAddress(user),
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} has shipped!`,
      data: {
        firstName: user.firstName,
        ...cartItem,
      },
    })
  },

  async checkout({ contact, cart, summary }) {
    await send({
      template: 'checkout',
      to: toEmailAddress(contact),
      bcc:
        process.env.NODE_ENV === 'production'
          ? ['info@infinitecloset.co.uk']
          : [],
      subject: 'Thank you for your order',
      data: {
        cart,
        name: contact.fullName,
        firstName: contact.nickName,
        totalPrice: summary.total,
      },
    })
  },
}
