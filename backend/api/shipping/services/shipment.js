'use strict'
const { providerName } = require('../../../utils')
const provider = require(`./${providerName}`)

/**
 * Be clear about who our shipping provider is
 * @typedef ProviderName
 * @type {'acs'|'hived'}
 */

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
 * Validate address for shipping
 */
async function validateAddress(address) {
  if (!address) {
    return false
  }
  const valid = await provider.api.verify(address.postcode)

  return (
    valid &&
    ['addressLine1', 'town', 'postcode', 'email'].every(
      (field) => field in address
    )
  )
}

module.exports = {
  providerName,
  ...provider.api,
  validateAddress,
}
