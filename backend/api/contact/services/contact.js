'use strict'

const _ = require('lodash')
const {splitName} = require('../../../utils')
const crypto = require('crypto')

function toHash(email) {
  return crypto
    .createHash('md5')
    .update(email?.toLowerCase())
    .digest('hex')
    .toLowerCase()
}

function toContact(obj) {
  if (!obj) {
    return null
  }

  let name
  if (obj.fullName) {
    name = splitName(obj.fullName)
  } else {
    name = {
      firstName: obj.firstName || obj.nickName,
      lastName: obj.lastName,
    }
  }

  const contact = {
    email: obj.email || obj.emailAddress,
    ...name,
  }

  if (!contact.email) {
    return null
  }

  return contact
}

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

/**
 * Merge mailchimp and local contacts list
 */
async function updateContactList() {
  const { members } = await strapi.services.mailchimp.marketing.lists.getListMembersInfo(
    strapi.services.mailchimp.config.ids('list'),
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

  if (members.length >= 1000) {
    const err = new Error('Contacts list too long')
    strapi.services.template_email.mailchimpLimitReached(err)
    throw err
  }

  let contacts = await strapi
    .query('contact')
    .find({ _sort: 'email:desc', _limit: -1 })
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

async function upsertContact(contact) {
  if (!contact?.email) {
    return null
  }

  try {
    const existingContact = await strapi
      .query('contact')
      .findOne({ email: contact.email })
    const contactData = _.pick(contact, ['firstName', 'lastName', 'email'])

    if (existingContact) {
      return await strapi.query('contact').update({ id: existingContact.id }, contactData)
    } else {
      return await strapi.query('contact').create(contactData)
    }
  } catch (e) {
    strapi.log.error('Failure creating contact.', e.stack)
    return null
  }
}

module.exports = {
  updateContactList,
  upsertContact,

  toHash,
  toContact,
}
