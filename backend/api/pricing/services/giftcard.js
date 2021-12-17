'use strict'
const crypto = require('crypto')
const bs58 = require('bs58')
const { secureKey, toId } = require('../../../utils')
const stripe = require('stripe')(process.env.STRIPE_KEY)

function generateCode(clientSecret) {
  const hmac = crypto.createHmac('sha256', secureKey)
  hmac.update(clientSecret)
  const d = hmac.digest()
  return bs58.encode(d)
}

function amountUsed(giftcard) {
  if (!giftcard.orders) {
    throw new Error('Giftcard.errors must be defined')
  }

  return giftcard.orders.reduce((acc, { amount }) => acc + amount, 0)
}

function amountLeft(giftcard) {
  return giftcard.amount - amountUsed(giftcard)
}

function paymentIntentValid(paymentIntent) {
  if (paymentIntent.status !== 'succeeded') {
    return false
  }

  return true
}

function fromPaymentIntent(paymentIntent) {
  return {
    id: paymentIntent.id,
    amount: strapi.services.price.toPrice(paymentIntent.amount),
  }
}

async function generate({ user, paymentIntent }) {
  const code = generateCode(paymentIntent.client_secret)
  if (!paymentIntentValid(paymentIntent)) {
    throw new Error('Payment must be completed.')
  }

  let giftCard
  giftCard = await strapi.query('gift-card').findOne({ code })
  if (giftCard) {
    return giftCard
  }

  const { id, amount } = fromPaymentIntent(paymentIntent)
  giftCard = await strapi.query('gift-card').create({
    code,
    user,
    paymentIntent: id,
    amount,
  })
  return giftCard
}

async function valid(giftCard) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    giftCard.paymentIntent
  )
  const { amount } = fromPaymentIntent(paymentIntent)
  return paymentIntentValid(paymentIntent) && amount == giftCard.amount
}

/**
 * Attach order information to gift card to find the new gift card amount
 */
async function onCheckout(giftCard, order, amount) {
  await strapi.query('gift-card').update(
    { id: toId(giftCard) },
    {
      orders: giftCard.purchases.contact({ order: toId(order), amount }),
    }
  )
}

module.exports = {
  generateCode,
  amountUsed,
  amountLeft,
  generate,
  onCheckout,
  valid,
}
