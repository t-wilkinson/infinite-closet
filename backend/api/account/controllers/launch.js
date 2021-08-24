'use strict'

const stripe = require('stripe')(process.env.STRIPE_KEY)
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)

const getTicketPrice = () => {
  const today = strapi.services.timing.day()
  const ticketPrice = today.isSameOrBefore('2021-08-18', 'day')
    ? 20
    : today.isSameOrBefore('2021-09-11')
      ? 30
      : today.isSameOrBefore('2021-09-15')
        ? 35
        : -1
  return ticketPrice
}

// https://stripe.com/docs/payments/accept-a-payment-synchronously
module.exports = {
  async ticketPrice(ctx) {
    ctx.send(getTicketPrice())
  },

  async promo(ctx) {
    const code = ctx.query.code
    const summary = await strapi.services.price.summary({
      price: getTicketPrice(),
      context: 'launch-party',
      code,
      existingCoupons: [],
    })

    // TODO: clean this
    ctx.send({ ...summary, price: summary.total })
  },

  async join(ctx) {
    const body = ctx.request.body
    const ticketPrice = getTicketPrice()
    if (ticketPrice === -1) {
      return ctx.send()
    }

    const summary = await strapi.services.price.summary({
      price: ticketPrice,
      context: 'launch-party',
      code: body.promoCode,
      existingCoupons: [],
    })
    const ticketAmount = Math.round(
      strapi.services.price.toAmount(body.donation + summary.total)
    )

    try {
      let intent
      if (body.paymentMethod) {
        intent = await stripe.paymentIntents.create({
          payment_method: body.paymentMethod,
          amount: ticketAmount,
          currency: 'gbp',
          confirm: true,
          confirmation_method: 'manual',
        })
      } else if (body.paymentIntent) {
        intent = await stripe.paymentIntents.confirm(body.paymentIntent)
      }

      const response = generateResponse(intent)

      if (response.success) {
        await strapi.plugins['email'].services.email.send({
          template: 'join-launch-party',
          to: { name: body.name, email: body.email },
          subject: 'Joined Launch Party',
          data: {
            guests: body.guests,
            ticketPrice,
            firstName: body.firstName,
            donation: body.donation,
            total: summary.total,
            discount: summary.discount,
          },
        })

        await strapi.query('contact').create({
          contact: body.email,
          context: 'launch_party',
          metadata: {
            paymentIntent: intent.id,
            guests: body.guests,
            donation: `£${body.donation}`,
            promo: body.promoCode,
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
          },
        })
      }

      return ctx.send(response)
    } catch (e) {
      strapi.log.error(e)
      return ctx.send({ error: 'Could not process payment' })
    }
  },
}

const generateResponse = (intent) => {
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    }
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    }
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status',
    }
  }
}
