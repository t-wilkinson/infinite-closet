const { config, fetchHived } = require('./utils')

module.exports = {
  verify: (postcode) =>
    fetchHived(config.postcodes, 'POST', { Recipient_Postcode: postcode })
      .then((res) => res.fields.Address_in_Delivery_Area === 'Valid')
      .catch(() => false),
}
