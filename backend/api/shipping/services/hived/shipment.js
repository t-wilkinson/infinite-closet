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
  } else {
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
      } else {
        acc[format[key]] = value
      }
      return acc
    }, {})
  }
}

module.exports = {
  formatAddress,
}
