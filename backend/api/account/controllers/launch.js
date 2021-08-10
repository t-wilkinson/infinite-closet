'use strict'

const stripe = require('stripe')(process.env.STRIPE_KEY)
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)

const SMALLEST_CURRENCY_UNIT = 100

// https://stripe.com/docs/payments/accept-a-payment-synchronously
module.exports = {
  async promo(ctx) {
    const code = ctx.query.code
    ctx.send(code === 'ICGYBGUEST' || code === 'GIVEYOURBEST')
  },

  async join(ctx) {
    const body = ctx.request.body
    const today = dayjs().tz('Europe/London')
    const TICKET_PRICE = today.isSameOrBefore('2021-08-18', 'day')
      ? 20
      : today.isSameOrBefore('2021-09-11')
        ? 30
        : today.isSameOrBefore('2021-09-15')
          ? 35
          : 'past-release'
    const PROMO_DISCOUNT = TICKET_PRICE

    if (TICKET_PRICE === 'past-release') {
      return ctx.send()
    }

    const discount =
      body.promoCode === 'GIVEYOURBEST'
        ? 5
        : body.promoCode === 'ICGYBGUEST'
          ? PROMO_DISCOUNT
          : 0
    const ticketPrice = Number(
      (body.donation + TICKET_PRICE - discount).toFixed(2)
    )
    const ticketAmount = ticketPrice * SMALLEST_CURRENCY_UNIT

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
            TICKET_PRICE,
            total: ticketPrice,
            firstName: body.firstName,
            donation: body.donation,
            discount,
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
