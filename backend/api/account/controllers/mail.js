'use strict'
const { splitName } = require('../../../utils')

module.exports = {
  async mailingList(ctx) {
    const body = ctx.request.body

    // await strapi.plugins['email'].services.email.send({
    //   template: 'mailinglist-subscription',
    //   to: { name: body.name, email: body.email },
    //   subject: 'You subscribed to the mailing list',
    // })

    strapi.services.mailchimp.template('welcome-to-the-fashion-revolution', {
      subject: 'Welcome to the fashion revolution',
      to: { name: body.name, email: body.email },
    })

    const { firstName, lastName } = splitName(body.name)
    strapi.query('contact').create({
      email: body.email,
      phoneNumber: body.phoneNumber || null,
      firstName,
      lastName,
      dateOfBirth: body.dateOfBirth || null,
      subscribed: body.subscribe || false,
    })

    ctx.send({})
  },
}
