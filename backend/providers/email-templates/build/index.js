'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

require('./styles.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var user = {
  firstName: 'First Name',
  lastName: 'Last Name'
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
  size: 'MD',
  product: product,
  user: user,
  address: address
};

var orderData = {
  firstName: 'First Name',
  cartItem: {
    order: order,
    totalPrice: 30.13,
    range: { start: '8/24/2020', end: '8/28/2020' }
  },
  user: user
};

var recommendations = [product, product, product, product];

var data = {
  misc: {
    label: 'Misc',
    components: orderData,
    // 'newsletter-subscription': {},
    // 'waitlist-subscription': {},
    // 'mailinglist-subscription': {},
    'forgot-password': {
      user: user,
      url: '/REST_URL'
    }
  },

  order: {
    label: 'Order lifecycle',
    'order-confirmation': {
      cart: [orderData.cartItem, orderData.cartItem],
      address: address,
      summary: summary,
      recommendations: recommendations,
      contact: {
        nickName: 'First Name'
      }
    },
    'order-shipped': orderData,
    'order-starting': orderData,
    'order-ending': orderData,
    'order-received': orderData,
    'order-review': orderData
  },

  money: {
    label: 'Money',
    'gift-card': {
      recommendations: recommendations,
      firstName: 'First Name',
      giftCard: giftCard
    },
    'store-credit': {
      firstName: 'First Name',
      amount: 20,
      recommendations: recommendations
    }
  },

  'non-user-facing': {
    label: 'Non user-facing',
    'trust-pilot': orderData,
    'order-shipping-failure': {
      order: {},
      error: {}
    },
    'contact-us': {
      firstName: 'First Name',
      lastName: 'Last Name',
      emailAddress: 'Email',
      phoneNumber: 'Phone',
      message: 'Random message'
    }
  },

  old: {
    label: 'Old',
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

var NavLink = function NavLink(_ref) {
  var sub = _ref.sub,
      k = _ref.k;

  return _react2.default.createElement(
    'a',
    {
      key: k,
      href: '/' + sub + '/' + k,
      style: {
        color: 'black',
        textDecoration: 'none',
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 14
      }
    },
    k
  );
};

var Emails = function Emails() {
  var _React$useState = _react2.default.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      Email = _React$useState2[0],
      setEmail = _React$useState2[1];

  var defaultEmail = ['misc', 'components'];
  var path = window.location.pathname.split('/').slice(1, 3);

  _react2.default.useEffect(function () {
    var Email = _react2.default.lazy(function () {
      return import('./email-templates/' + (path[1] || defaultEmail[1]));
    });
    setEmail(Email);
  }, []);

  return _react2.default.createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'row'
      }
    },
    _react2.default.createElement(
      'nav',
      {
        style: {
          backgroundColor: '#eee',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap'
        }
      },
      Object.keys(data).map(function (key) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          { key: key },
          _react2.default.createElement(
            'strong',
            { style: { marginTop: 8 } },
            data[key].label
          ),
          Object.keys(data[key]).map(function (k) {
            return k !== 'label' && _react2.default.createElement(NavLink, { key: k, k: k, sub: key });
          })
        );
      })
    ),
    _react2.default.createElement(
      'div',
      {
        style: {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      },
      _react2.default.createElement(
        'div',
        { style: { maxWidth: 1000, width: '100%' } },
        Email && _react2.default.createElement(
          _react2.default.Suspense,
          { fallback: _react2.default.createElement('div', null) },
          _react2.default.createElement(Email, {
            data: data[path[0] || defaultEmail[0]][path[1] || defaultEmail[1]]
          })
        )
      )
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(Emails, null), document.getElementById('root'));