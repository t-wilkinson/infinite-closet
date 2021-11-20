'use strict'
const { shipment } = require('./hived')

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

module.exports = {...shipment, provider: 'hived'}
