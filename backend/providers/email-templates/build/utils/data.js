'use strict';

var contact = {
  fullName: 'First Last',
  nickName: 'First',
  email: 'info+test@infinitecloset.co.uk'
};

var user = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'info+test@infinitecloset.co.uk'
};

var address = {
  fullName: 'First Last',
  addressLine1: 'Address line 1',
  mobileNumber: '123 456 7890'
};

var summary = {
  valid: true,
  preDiscount: 30,
  subtotal: 30,
  shipping: 5,
  insurance: 5,
  discount: 5,
  coupon: undefined,
  giftCard: undefined,
  total: 35,
  amount: 3000
};

var giftCard = {
  value: 20,
  code: 'ABCDEFG'
};

var product = {
  name: 'Product name',
  slug: 'product',
  designer: {
    name: 'Designer name',
    slug: 'designer'
  },
  sizes: [{ size: 'S', quantity: 1 }, { size: 'M', quantity: 1 }],
  images: [{
    url: 'https://infinitecloset.co.uk/_next/image?url=https%3A%2F%2Fapi.infinitecloset.co.uk%2Fuploads%2Flarge_dress_simone_night_fall_81ebcf791b.jpg&w=1920&q=75',
    // url: '/uploads/Screen_Shot_2021_08_22_at_10_36_33_PM_54e21ccc8e.png',
    alternativeText: 'Alt Text'
  }],
  shortRentalPrice: 50,
  longRentalPrice: 70,
  retailPrice: 200
};

var order = {
  id: '1',
  size: 'MD',
  product: product,
  user: user,
  address: address
};

var cartItem = {
  order: order,
  totalPrice: 30.13,
  range: { start: '8/24/2020', end: '8/28/2020' },
  user: user
};

var orderData = {
  firstName: 'First Name',
  cartItem: cartItem,
  user: user
};

var recommendations = [product, product, product, product];

module.exports = {
  cartItem: cartItem,
  defaultData: {
    components: orderData,
    'forgot-password': {
      user: user,
      url: '/REST_URL'
    },

    'order-confirmation': {
      cart: [orderData.cartItem, orderData.cartItem],
      address: address,
      summary: summary,
      recommendations: recommendations,
      contact: contact,
      firstName: contact.nickName
    },
    'order-shipped': orderData,
    'order-starting': orderData,
    'order-ending': orderData,
    'order-received': orderData,
    'order-review': orderData,

    'gift-card': {
      recommendations: recommendations,
      firstName: 'First Name',
      giftCard: giftCard
    },
    'store-credit': {
      firstName: 'First Name',
      amount: 20,
      recommendations: recommendations
    },

    'trust-pilot': orderData,
    'order-shipping-failure': {
      order: {},
      error: {}
    },
    'contact-us': {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'info+test@infinitecloset.co.uk',
      phoneNumber: 'Phone',
      message: 'Random message'
    },

    'join-launch-party': {
      firstName: 'First Name',
      ticketPrice: 25,
      donation: 25.0,
      discount: 5,
      total: 45,
      guests: ['Bob', 'Joe']
    }
  }
};