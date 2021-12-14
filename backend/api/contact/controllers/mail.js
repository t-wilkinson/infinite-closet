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

    const { firstName, lastName } = splitName(body.name)
    await strapi.plugins['email'].services.email.send({
      template: 'contact-us',
      to: { name: body.name, email: 'info@infinitecloset.co.uk' },
      subject: `[Contact] ${body.name}`,
      data: body,
    })

    await strapi.query('contact').create({
      email: body.emailAddress,
      phoneNumber: body.phoneNumber,
      firstName,
      lastName,
    })

    ctx.send(null)
  },
}
