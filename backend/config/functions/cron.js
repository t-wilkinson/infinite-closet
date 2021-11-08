'use strict'
const { splitName } = require('../../api/utils')

function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

function laterDate(d1, d2) {
  const date1 = new Date(d1)
  const date2 = new Date(d2)
  if (!isValidDate(date1) && !isValidDate(date2)) {
    return null
  } else if (!isValidDate(date1)) {
    return date2
  } else if (!isValidDate(date2)) {
    return date1
  } else {
    return date1 < date2 ? date2 : date1
  }
}

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
  const definedProps = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== undefined && v !== null && v !== ''
      )
    )

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

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    updateContactList()

    const orders = await strapi
      .query('order', 'orders')
      .find({ status_in: ['planning', 'shipping'] }, [
        'product',
        'product.designer',
        'user',
      ])
    const filterOrders = (status) =>
      orders.filter((order) => order.status === status)

    const shippingOrders = filterOrders('shipping')
    strapi.plugins['orders'].services.helpers.sendToCleaners(shippingOrders)
    strapi.plugins['orders'].services.helpers.notifyArrival(shippingOrders)

    const planningOrders = filterOrders('planning')
    strapi.plugins['orders'].services.helpers.notifyAction(planningOrders)
  },
}
