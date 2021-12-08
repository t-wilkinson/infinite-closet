'use strict'
const api = require('./hived/api')

/**
 * @typedef ShippingClass
 * @type {'one'|'two'}
 */

/**
 * @typedef DateLike
 * @type {Date|Dayjs}
 */

/**
 * @typedef {Object} Address
 * @property {string} name - Name of individual who address is attached to
 * @property {string[]} address - Up to 3 address lines
 * @property {string} town
 * @property {string} postcode
 * @property {string} email
 * @property {string} phone
 * @property {string} deliveryInstructions
 */

/**
 * Be clear about who our shipping provider is
 * @typedef Provider
 * @type {'acs'|'hived'}
 */

/**
 * Validate address for shipping
 */
async function validateAddress(address) {
  if (!address) {
    return false
  }
  const valid = await api.verify(address.postcode)

  return (
    valid &&
    ['addressLine1', 'town', 'postcode', 'email'].every(
      (field) => field in address
    )
  )
}

module.exports = { ...api, validateAddress, provider: 'hived' }
