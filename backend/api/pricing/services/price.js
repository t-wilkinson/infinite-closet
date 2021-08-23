const SMALLEST_CURRENCY_UNIT = 100

// Services like stripe expect no decimal points, and to be in units of smallest currency
const toAmount = (price) => Math.round(price * SMALLEST_CURRENCY_UNIT)
const toPrice = (amount) => amount / SMALLEST_CURRENCY_UNIT

module.exports = {
  toAmount,
  toPrice,
}
