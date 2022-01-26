'use strict'
const { splitName } = require('../../../utils')

module.exports = {
  async mailingList(ctx) {
    const body = ctx.request.body

    strapi.services.mailchimp.transactional.template(
      'welcome-to-the-fashion-revolution',
      {
        subject: 'Welcome to the fashion revolution',
        to: { name: body.name, email: body.email },
      }
    )

    const { firstName, lastName } = splitName(body.name)
    strapi.query('contact').create({
      email: body.email,
      phoneNumber: body.phoneNumber || null,
      firstName,
      lastName,
      dateOfBirth: body.dateOfBirth || null,
      subscribed: body.subscribe || false,
    })

    ctx.send(null)
  },

  async contact(ctx) {
    const body = ctx.request.body
    const { name, email, phoneNumber, message} = body

    const { firstName, lastName } = splitName(name)
    await strapi.services.template_email.contact({ name, email, phoneNumber, message  })

    await strapi.query('contact').create({
      email,
      phoneNumber,
      firstName,
      lastName,
    })

    ctx.send(null)
  },
}
