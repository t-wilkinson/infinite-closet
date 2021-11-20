/**
 * @group lib
 */
const config = require('../config')
const { formatAddress } = require('../shipment')

it('Formats addresses', () => {
  const address = {
    name: 'Infinite Closet',
    email: 'info@infinitecloset.co.uk',
    phone: '1234567890',
    address: ['Address 1', 'Address 2', 'Address 3'],
    town: 'Town',
    postcode: 'Postcode',
    deliveryInstructions: 'Delivery instructions',
  }

  const res = formatAddress(config.addressFormats.recipient, address)
  expect(res).toMatchObject({
    FirstName: 'Infinite',
    LastName: 'Closet',
    Email: 'info@infinitecloset.co.uk',
    MobilePhone: '1234567890',
    Delivery_Address1: 'Address 1',
    Delivery_Address2: 'Address 2',
    Delivery_Address3: 'Address 3',
    Delivery_City: 'Town',
    Delivery_Postcode: 'Postcode',
    Comment: 'Delivery instructions',
  })
})
