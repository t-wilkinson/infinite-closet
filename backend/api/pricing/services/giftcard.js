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

async function create({ user = undefined, value }) {
  const code = generateRandomCode()
  const giftCard = await strapi.query('gift-card').create({
    code,
    owner: user,
    value,
  })
  return giftCard
}

async function add({ user, paymentIntent }) {
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
    owner: user,
    paymentIntent: id,
    value,
  })
  return giftCard
}

async function availableGiftCard(code) {
  if ( typeof code !== 'string' || !code) {
    return null
  }

  const giftCard = await strapi.query('gift-card').findOne({ code })
  return giftCard
}

async function valid(giftCard) {
  if (!giftCard) {
    return false
  }

  if ((await valueLeft(giftCard)) <= 0) {
    return false
  }

  // If paymentIntent isn't attached there are no more checks to make
  if (!giftCard.paymentIntent) {
    return true
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    giftCard.paymentIntent
  )
  const { value } = fromPaymentIntent(paymentIntent)
  return paymentIntentValid(paymentIntent) && value == giftCard.value
}

async function valueUsed(giftCard) {
  const orders = await strapi
    .query('order', 'orders')
    .find({ giftCard: toId(giftCard), status_nin: ['error', 'dropped', 'cart', 'list'] }, [])
  return orders.reduce(
    (acc, { giftCardDiscount }) => acc + (giftCardDiscount || 0),
    0
  )
}

async function valueLeft(giftCard) {
  return giftCard.value - (await valueUsed(giftCard))
}

async function discount(price, giftCard, valid = true) {
  if (!valid) {
    return 0
  }

  const value = await valueLeft(giftCard)
  return Math.min(value, price)
}

module.exports = {
  add,
  availableGiftCard,
  create,
  discount,
  generateCode,
  generateRandomCode,
  valid,
  valueLeft,
  valueUsed,
}
