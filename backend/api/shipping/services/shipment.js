'use strict'
const { providerName, splitName } = require('../../../utils')
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

/**
 * Format address according to specification
 * @param {Object} format - Mapping of address fields to api fields
 * @param {Address} addr
 * @returns {Object} Address with fields set by specification
 */
function formatAddress(format, addr) {
  if (typeof addr === 'string') {
    return formatAddress(format, provider.config.addresses[addr])
  }

  return Object.entries(addr).reduce((acc, [key, value]) => {
    if (!value || !format[key]) {
      return acc
    }

    if (key === 'address') {
      for (const i in format.address) {
        if (format.address[i] && value[i]) {
          acc[format.address[i]] = value[i]
        }
      }

      // In case format requires seperate field for first and last name
    } else if (key === 'name' && Array.isArray(format[key])) {
      const { firstName, lastName } = splitName(value)
      acc[format.name[0]] = firstName
      acc[format.name[1]] = lastName
    } else {
      acc[format[key]] = value
    }
    return acc
  }, {})
}

module.exports = {
  providerName,
  ...provider.api,
  validateAddress,
  formatAddress,
}
