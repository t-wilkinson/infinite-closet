'use strict'
const crypto = require('crypto')
const bs58 = require('bs58')
const { secureKey, toId } = require('../../../utils')
const stripe = require('stripe')(process.env.STRIPE_KEY)

function generateCode(clientSecret) {
  const hmac = crypto.createHmac('sha256', secureKey)
  hmac.update(clientSecret)
  const d = hmac.digest()
  return bs58.encode(d).slice(0, 8)
}

function generateRandomCode() {
  return generateCode(crypto.randomUUID())
}

async function getPaymentIntent(giftCard) {
  if (!giftCard?.paymentIntent) {
    return undefined
  } else {
    return await stripe.paymentIntents.retrieve(giftCard.paymentIntent)
  }
}

function fromPaymentIntent(paymentIntent) {
  return {
    id: paymentIntent.id,
    value: strapi.services.price.toPrice(paymentIntent.amount),
  }
}

function paymentIntentValid(paymentIntent) {
  if (paymentIntent.status !== 'succeeded') {
    return false
  }

  return true
}

async function create({ value }) {
  const code = generateRandomCode()
  const giftCard = await strapi.query('gift-card').create({
    code,
    value,
  })
  return giftCard
}

async function add({ paymentIntent, info }) {
  if (!paymentIntentValid(paymentIntent)) {
    throw new Error('Payment must be completed.')
  }

  const code = generateCode(paymentIntent.client_secret)
  const existingGiftCard = await strapi.query('gift-card').findOne({ code })
  if (existingGiftCard) {
    return existingGiftCard
  }

  const { id, value } = fromPaymentIntent(paymentIntent)
  const giftCard = await strapi.query('gift-card').create({
    code,
    paymentIntent: id,
    value,
    ...info,
  })
  return giftCard
}

async function availableGiftCard(code) {
  if (typeof code !== 'string' || !code) {
    return null
  }

  const giftCard = await strapi.query('gift-card').findOne({ code })
  return giftCard
}

function valid(giftCard, paymentIntent) {
  if (!giftCard) {
    return false
  }

  if (valueLeft(giftCard) <= 0) {
    return false
  }

  if (giftCard.paymentIntent && !paymentIntent) {
    throw new Error('Must pass retrieve paymentIntent from stripe')
  }

  // If paymentIntent isn't attached there are no more checks to make
  if (!paymentIntent) {
    return true
  }

  const { value } = fromPaymentIntent(paymentIntent)
  return paymentIntentValid(paymentIntent) && value == giftCard.value
}

async function getPurchases(giftCard) {
  return await strapi.query('purchase').find({ giftCard: toId(giftCard) }, [])
}

function valueUsed(purchases) {
  return purchases.reduce(
    (acc, { giftCardDiscount }) => acc + (giftCardDiscount || 0),
    0
  )
}

function valueLeft(giftCard, purchases) {
  return Math.max(giftCard.value - valueUsed(purchases), 0)
}

function discount(price, giftCard, purchases, valid = true) {
  if (!valid) {
    return 0
  }

  const effectiveValue = valueLeft(giftCard, purchases)
  return Math.min(effectiveValue, price)
}

module.exports = {
  add,
  availableGiftCard,
  create,
  valid,

  getPaymentIntent,
  generateRandomCode,
  getPurchases,
  valueLeft,
  discount,
}
