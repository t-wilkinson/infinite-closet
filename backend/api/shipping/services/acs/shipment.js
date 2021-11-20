'use strict'
const {splitName} = require('../../../../utils')
const config = require('./config')

/**
 * Format address according to specification
 * @param {Object} format - Mapping of address fields to api fields
 * @param {Address} addr
 * @returns {Object} Address with fields set by specification
 */
function formatAddress(format, addr) {
  if (typeof addr === 'string') {
    return formatAddress(format, config.addresses[addr])
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
  formatAddress,
}
