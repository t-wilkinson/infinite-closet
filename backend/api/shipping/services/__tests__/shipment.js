/**
 * @group lib
 */
'use strict'

const acsConfig = require('../acs/config')
const hivedConfig = require('../hived/config')
const { formatAddress } = require('../shipment')

it('Formats acs addresses', () => {
  const address = {
    name: 'Infinite Closet',
    email: 'info@infinitecloset.co.uk',
    phone: '1234567890',
    address: ['Address 1', 'Address 2', 'Address 3'],
    town: 'Town',
    postcode: 'Postcode',
    deliveryInstructions: 'Delivery instructions',
  }

  const res = formatAddress(acsConfig.addressFormats.recipient, address)
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

describe('Format hived addresses', () => {
  const address = {
    name: 'Infinite Closet',
    email: 'info@infinitecloset.co.uk',
    phone: '1234567890',
    address: ['Address 1', 'Address 2', 'Address 3'],
    town: 'Town',
    postcode: 'Postcode',
    deliveryInstructions: 'Delivery instructions',
  }

  it('correctly formats sender', () => {
    const res = formatAddress(hivedConfig.addressFormats.sender, address)
    expect(res).toMatchObject({
      Sender: 'Infinite Closet',
      Sender_Address_Line_1: 'Address 1',
      Sender_Address_Line_2: 'Address 2',
      Sender_Address_Line_3: 'Address 3',
      Sender_Town: 'Town',
      Sender_Postcode: 'Postcode',
    })
  })

  it('correctly formats collection', () => {
    const res = formatAddress(hivedConfig.addressFormats.collection, address)
    expect(res).toMatchObject({
      Collection_Contact_Name: 'Infinite Closet',
      Collection_Email_Address: 'info@infinitecloset.co.uk',
      Collection_Phone_Number: '1234567890',
      Collection_Address_Line_1: 'Address 1',
      Collection_Address_Line_2: 'Address 2',
      Collection_Address_Line_3: 'Address 3',
      Collection_Town: 'Town',
      Collection_Postcode: 'Postcode',
      Collection_Instructions: 'Delivery instructions',
    })
  })

  it('correctly formats recipients', () => {
    const res = formatAddress(hivedConfig.addressFormats.recipient, address)
    expect(res).toMatchObject({
      Recipient: 'Infinite Closet',
      Recipient_Email_Address: 'info@infinitecloset.co.uk',
      Recipient_Phone_Number: '1234567890',
      Recipient_Address_Line_1: 'Address 1',
      Recipient_Address_Line_2: 'Address 2',
      Recipient_Address_Line_3: 'Address 3',
      Recipient_Town: 'Town',
      Recipient_Postcode: 'Postcode',
      Delivery_Instructions: 'Delivery instructions',
    })
  })
})
