const contact = {
  fullName: '<Full name>',
  nickName: '<Nick name>',
  email: 'info+test@infinitecloset.co.uk',
}

const user = {
  firstName: '<First name>',
  lastName: '<Last name>',
  email: 'info+test@infinitecloset.co.uk',
}

const address = {
  fullName: contact.fullName,
  addressLine1: 'Address line 1',
  mobileNumber: '123 456 7890',
}

const summary = {
  valid: true,
  preDiscount: 30,
  subtotal: 30,
  shipping: 5,
  insurance: 5,
  discount: 5,
  coupon: undefined,
  giftCard: undefined,
  total: 35,
  amount: 3000,
}

const giftCard = {
  value: 20,
  code: 'ABCDEFG',
}

const product = {
  name: '<Product name>',
  slug: 'product',
  designer: {
    name: '<Designer name>',
    slug: 'designer',
  },
  sizes: [
    { size: 'S', quantity: 1 },
    { size: 'M', quantity: 1 },
  ],
  images: [
    {
      url: 'https://infinitecloset.co.uk/_next/image?url=https%3A%2F%2Fapi.infinitecloset.co.uk%2Fuploads%2Flarge_dress_simone_night_fall_81ebcf791b.jpg&w=1920&q=75',
      // url: '/uploads/Screen_Shot_2021_08_22_at_10_36_33_PM_54e21ccc8e.png',
      alternativeText: 'Alt Text',
    },
  ],
  shortRentalPrice: 50,
  longRentalPrice: 70,
  retailPrice: 200,
}

const order = {
  id: '1',
  size: 'MD',
  product,
  user,
  address,
}

const cartItem = {
  isDefault: true,
  order,
  totalPrice: 30.13,
  range: { start: '8/24/2020', end: '8/28/2020' },
  user,
}

const orderData = {
  firstName: '<First Name>',
  cartItem,
  user,
}

const recommendations = [product, product, product, product]

module.exports = {
  cartItem,
  defaultData: {
    components: orderData,
    'forgot-password': {
      isDefault: true,
      user,
      url: '/REST_URL',
    },

    'order-confirmation': {
      isDefault: true,
      cart: [orderData.cartItem, orderData.cartItem],
      address,
      summary,
      recommendations,
      contact,
      firstName: contact.nickName,
    },
    'order-shipped': orderData,
    'order-starting': orderData,
    'order-ending': orderData,
    'order-received': orderData,
    'order-review': orderData,

    'gift-card': {
      isDefault: true,
      recommendations,
      firstName: 'First Name',
      giftCard,
    },
    'store-credit': {
      isDefault: true,
      firstName: 'First Name',
      amount: 20,
      recommendations,
    },

    'trust-pilot': orderData,
    'order-shipping-failure': {
      isDefault: true,
      order: {},
      error: {},
    },
    'contact-us': {
      isDefault: true,
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'info+test@infinitecloset.co.uk',
      phoneNumber: 'Phone',
      message: 'Random message',
    },

    'join-launch-party': {
      isDefault: true,
      firstName: 'First Name',
      ticketPrice: 25,
      donation: 25.0,
      discount: 5,
      total: 45,
      guests: ['Bob', 'Joe'],
    },
  }
}

