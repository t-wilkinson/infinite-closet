'use strict'

// Split name into first and last name
function splitName(name) {
  if (!name || typeof name !== 'string') {
    return { firstName: '', lastName: '' }
  }

  const [first, last] = name.split('[^.] ') // Don't split `Dr.`, etc.

  return { firstName: first || '', lastName: last || '' }
}

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

    await strapi.plugins['email'].services.email.send({
      template: 'mailinglist-subscription',
      to: { name: body.name, email: body.email },
      subject: 'You subscribed to the mailing list',
    })

    const [firstName, lastName] = splitName(body.name)
    await strapi.query('contact').create({
      email: body.email,
      phoneNumber: body.phoneNumber,
      firstName,
      lastName,
      dateOfBirth: body.dateOfBirth,
      subscribed: body.subscribe,
    })

    ctx.send({})
  },
}
