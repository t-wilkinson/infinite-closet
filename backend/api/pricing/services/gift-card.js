'use strict'

const crypto = require('crypto')
const {toId} = require('../../../utils')

function generateCode() {
  return crypto.randomBytes(8).toString('base64')
}

function amountUsed(giftcard) {
  return giftcard.orders.reduce((acc, {amount}) => acc + amount, 0)
}

function amountLeft(giftcard) {
  return giftcard.amount - amountUsed(giftcard)
}

async function generate({amount}) {
  const code = generateCode()
  const giftCard = await strapi.query('gift-card').create({
    code,
    amount,
  })
  return giftCard
}

/**
 * Attach order information to gift card to find the new gift card amount
 */
async function onCheckout(giftCard, order, amount) {
  await strapi.query('gift-card').update({ id: toId(giftCard) }, {
    orders: giftCard.purchases.contact({order: toId(order), amount})
  })
}

module.exports = {
  generateCode,
  amountUsed,
  amountLeft,
  generate,
  onCheckout,
}
