'use strict'
const { shipment } = require('./acs')

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

module.exports = shipment
