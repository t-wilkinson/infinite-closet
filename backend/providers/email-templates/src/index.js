import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

const user = {
  firstName: 'First Name',
  lastName: 'Last Name',
}

const address = {
  fullName: 'First Last',
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
  name: 'Product name',
  slug: 'product',
  designer: {
    name: 'Designer name',
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
      // url: 'https://ci6.googleusercontent.com/proxy/0i_xXUdxzuItZLDm1D_gMnKlbWwQGzeTJkobLx32DdFSHfnxDaJXpXYzol9sUEWpPoykOc9n9Ez5hBZKecHtI8ztei6z6CwJTUC-y2kQgKWzTegtLg8XCg6VZb_vS0pf=s0-d-e1-ft#https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._AC_SR80,80_.jpg',
      // url: 'https://infinitecloset.co.uk/_next/image?url=https%3A%2F%2Fapi.infinitecloset.co.uk%2Fuploads%2Flarge_NKIE_WD_394_V1_2_22a4139b48.jpg&w=1920&q=75',
      alternativeText: 'Alt Text',
    },
  ],
  shortRentalPrice: 50,
  longRentalPrice: 70,
  retailPrice: 200,
}

const order = {
  size: 'MD',
  product,
  user,
  address,
}

const orderData = {
  firstName: 'First Name',
  cartItem: {
    order,
    totalPrice: 30.13,
    range: { start: '8/24/2020', end: '8/28/2020' },
  },
  user,
}

const recommendations = [product, product, product, product]

const data = {
  misc: {
    label: 'Misc',
    components: orderData,
    // 'newsletter-subscription': {},
    // 'waitlist-subscription': {},
    // 'mailinglist-subscription': {},
    'forgot-password': {
      user,
      url: '/REST_URL',
    },
  },

  order: {
    label: 'Order lifecycle',
    'order-confirmation': {
      cart: [orderData.cartItem, orderData.cartItem],
      address,
      summary,
      recommendations,
      contact: {
        nickName: 'First Name',
      },
    },
    'order-shipped': orderData,
    'order-starting': orderData,
    'order-ending': orderData,
    'order-received': orderData,
    'order-review': orderData,
  },

  money: {
    label: 'Money',
    'gift-card': {
      recommendations,
      firstName: 'First Name',
      giftCard,
    },
    'store-credit': {
      firstName: 'First Name',
      amount: 20,
      recommendations,
    },
  },

  'non-user-facing': {
    label: 'Non user-facing',
    'trust-pilot': orderData,
    'order-shipping-failure': {
      order: {},
      error: {},
    },
    'contact-us': {
      firstName: 'First Name',
      lastName: 'Last Name',
      emailAddress: 'Email',
      phoneNumber: 'Phone',
      message: 'Random message',
    },
  },

  old: {
    label: 'Old',
    'join-launch-party': {
      firstName: 'First Name',
      ticketPrice: 25,
      donation: 25.0,
      discount: 5,
      total: 45,
      guests: ['Bob', 'Joe'],
    },
  },
}

const NavLink = ({ sub, k }) => {
  return (
    <a
      key={k}
      href={`/${sub}/${k}`}
      style={{
        color: 'black',
        textDecoration: 'none',
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 14,
      }}
    >
      {k}
    </a>
  )
}

const Emails = () => {
  const [Email, setEmail] = React.useState()
  const defaultEmail = ['misc', 'components']
  const path = window.location.pathname.split('/').slice(1, 3)

  React.useEffect(() => {
    const Email = React.lazy(() =>
      import(`./email-templates/${path[1] || defaultEmail[1]}`)
    )
    setEmail(Email)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <nav
        style={{
          backgroundColor: '#eee',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
        }}
      >
        {Object.keys(data).map((key) => (
          <React.Fragment key={key}>
            <strong style={{ marginTop: 8 }}>{data[key].label}</strong>
            {Object.keys(data[key]).map(
              (k) => k !== 'label' && <NavLink key={k} k={k} sub={key} />
            )}
          </React.Fragment>
        ))}
      </nav>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 1000, width: '100%' }}>
          {Email && (
            <React.Suspense fallback={<div />}>
              <Email
                data={
                  data[path[0] || defaultEmail[0]][path[1] || defaultEmail[1]]
                }
              />
            </React.Suspense>
          )}
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<Emails />, document.getElementById('root'))
