'use strict'
const { splitName } = require('../../utils')

module.exports = {
  // async newsletter(ctx) {
  //   const body = ctx.request.body

  //   await strapi.plugins['email'].services.email.send({
  //     template: 'newsletter-subscription',
  //     to: body.email,
  //     subject: 'You Made The List!',
  //   })

  //   await strapi.query('contact').create({
  //     contact: body.email,
  //     context: 'newsletter',
  //     metadata: {
  //       email: body.email,
  //     },
  //   })

  //   ctx.send({ ok: true })
  // },

  // async waitlist(ctx) {
  //   const body = ctx.request.body

  //   await strapi.plugins['email'].services.email.send({
  //     template: 'waitlist-subscription',
  //     to: { name: body.name, email: body.email },
  //     subject: 'You subscribed to the newsletter',
  //   })

  //   await strapi.query('contact').create({
  //     contact: body.email,
  //     context: 'waitlist',
  //     metadata: {
  //       name: body.name,
  //       email: body.email,
  //       comment: body.comment,
  //       subscribe: body.subscribe,
  //       marketing: body.marketing,
  //     },
  //   })

  //   ctx.send({ ok: true })
  // },

  async mailingList(ctx) {
    const body = ctx.request.body

    // await strapi.plugins['email'].services.email.send({
    //   template: 'mailinglist-subscription',
    //   to: { name: body.name, email: body.email },
    //   subject: 'You subscribed to the mailing list',
    // })

    console.log('sending email')
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
