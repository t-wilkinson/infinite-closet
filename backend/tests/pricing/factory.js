const defaultData = {
  type: 'amount_off',
  amount: 10,
  code: 'COUPON_CODE',
  maxUses: 1,
  context: 'checkout',
}

function mockCoupon(data) {
  return { ...defaultData, ...data }
}

async function createCoupon(strapi, data) {
  strapi.query('coupon').create(mockCoupon(data))
}

module.exports = {
  defaultData,
  mockCoupon,
  createCoupon,
}
