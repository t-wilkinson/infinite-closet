'use strict'

const { splitName } = require('../../../api/utils')

function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

function laterDate(d1, d2) {
  const date1 = new Date(d1)
  const date2 = new Date(d2)
  const valid1 = isValidDate(date1)
  const valid2 = isValidDate(date2)

  if (valid1 && valid2) {
    return date1 < date2 ? date2 : date1
  } else if (!valid1) {
    return date2
  } else if (!valid2) {
    return valid1
  } else {
    return null
  }
}

async function notifyArrival(orders) {
  for (const order of orders) {
    const user = order.user
    const range = strapi.services.timing.range(order)
    const date = strapi.services.timing.day(range.start)
    const today = strapi.services.timing.day()

    if (!date.isSame(today, 'day')) continue
    // const complete = await strapi.services.shipment.complete(order.shipment)
    // if (!complete) return

    strapi.log.info('order arriving %o', order.id)
    strapi.plugins['email'].services.email.send({
      template: 'order-arriving',
      to: user.email,
      subject: `Your order of ${order.product.name} by ${order.product.designer.name} is arriving today`,
      data: {
        ...(await strapi.plugins['orders'].services.cart.createCartItem(order)),
        firstName: user.firstName,
      },
    })
  }
}

async function sendToCleaners(orders) {
  for (const order of orders) {
    const range = strapi.services.timing.range(order)
    const date = strapi.services.timing.day(range.end)
    const today = strapi.services.timing.day()
    if (!date.isSame(today, 'day')) continue

    const { user } = order
    const shippingRequest = {
      collection:
        strapi.plugins['orders'].services.order.toShippingAddress(order),
      recipient: 'oxwash',
      shippingClass: 'two',
      shipmentPrice: strapi.plugins['orders'].services.price.orderTotal(order),
    }
    const cartItem = await strapi.plugins[
      'orders'
    ].services.cart.createCartItem(order)

    strapi.log.info('cleaning order %o', order.id)
    strapi
      .query('order', 'orders')
      .update({ id: order.id }, { status: 'cleaning' })
      .then(() => strapi.services.shipment.ship(shippingRequest))
      .then(() =>
        strapi.plugins['email'].services.email.send({
          template: 'order-leaving',
          to: user.email,
          bcc: 'battersea@oxwash.com',
          subject: `Your order of ${order.product.name} by ${order.product.designer.name} is ending today`,
          data: {
            firstName: user.firstName,
            ...cartItem,
          },
        })
      )
      .catch((err) =>
        strapi.plugins['orders'].services.helpers.shippingFailure(cartItem, err)
      )
  }
}

async function shippingFailure(order, err) {
  await strapi
    .query('order', 'orders')
    .update({ id: order.id }, { status: 'error', message: err })
  await strapi.plugins['email'].services.email.send({
    template: 'order-shipping-failure',
    to: 'info@infinitecloset.co.uk',
    subject: 'Failed to ship order',
    data: { order, error: err },
  })
  strapi.log.error('failed to ship order to client %o', err)
}

async function notifyAction(orders) {
  // Find orders that require manual action through the strapi plugin
  orders = orders.filter((order) => {
    const range = strapi.services.timing.range(order)
    const today = strapi.services.timing.day()
    const shipped = strapi.services.timing.day(range.shipped)
    return today.isSame(shipped, 'day')
  })

  if (orders.length === 0) {
    return
  }

  const cart = await strapi.plugins['orders'].services.cart.create(orders)
  await strapi.plugins['email'].services.email.send({
    template: 'shipping-action',
    to: 'info@infinitecloset.co.uk',
    subject: 'Some orders need to be shipped today',
    data: {
      cart,
    },
  })
}

/**
 * Merge mailchimp and local contacts list
 */
async function updateContactList() {
  const { members } = await strapi.services.mailchimp.lists.getListMembersInfo(
    strapi.services.mailchimp.contactsListId,
    {
      fields: [
        'members.full_name',
        'members.email_address',
        'members.status',
        'members.timestamp_signup',
        'members.last_changed',
      ],
      count: 1000,
    }
  )

  let contacts = await strapi
    .query('contact')
    .find({ _sort: 'email:desc', _limit: -1 })
  // TODO: speed this up (sorting?)
  // Update contacts with mailchimp data
  nextMember: for (const member of members) {
    for (const contact of contacts) {
      // If both contact and member exist for some email so merge their data
      if (contact.email === member.email_address) {
        strapi.query('contact').update(
          { id: contact.id },
          {
            status:
              member.status == null
                ? contact.status
                : member.status === 'subscribed',
            created_at: laterDate(contact.created_at, member.timestamp_signup),
          }
        )

        continue nextMember
      }
    }

    // If contact does not exist, create contact based on member data
    if (member.email_address) {
      const { firstName, lastName } = splitName(member.full_name)
      strapi.query('contact').create({
        firstName,
        lastName,
        status: member.status === 'subscribed',
        email: member.email_address,
        created_at: member.timestamp_signup,
      })
    }
  }

  // When merging objects, don't overwrite with empty values
  function definedProps(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== undefined && v !== null && v !== ''
      )
    )
  }

  contacts = await strapi
    .query('contact')
    .find({ _limit: -1, _sort: 'email:desc' })
  let currentContact = {}
  let ids = []

  // Merge contacts with duplicate emails
  for (const contact of contacts) {
    if (contact.email !== currentContact.email) {
      if (ids.length > 0) {
        strapi.query('contact').update({ id: ids[0] }, currentContact)
        ids.slice(1).forEach((id) => strapi.query('contact').delete({ id }))
      }
      currentContact = {}
      ids = []
    }

    currentContact = Object.assign(currentContact, definedProps(contact))
    ids.push(contact.id)
  }
}

module.exports = {
  shippingFailure,
  notifyArrival,
  sendToCleaners,
  notifyAction,
  updateContactList,
}
