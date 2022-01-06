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

var product = {
  name: 'Product name',
  slug: 'product',
  designer: {
    name: 'Designer name',
    slug: 'designer'
  },
  sizes: [{ size: 'S', quantity: 1 }, { size: 'M', quantity: 1 }],
  images: [{
    url: '/uploads/Screen_Shot_2021_08_22_at_10_36_33_PM_54e21ccc8e.png',
    // url: 'https://ci6.googleusercontent.com/proxy/0i_xXUdxzuItZLDm1D_gMnKlbWwQGzeTJkobLx32DdFSHfnxDaJXpXYzol9sUEWpPoykOc9n9Ez5hBZKecHtI8ztei6z6CwJTUC-y2kQgKWzTegtLg8XCg6VZb_vS0pf=s0-d-e1-ft#https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._AC_SR80,80_.jpg',
    // url: 'https://infinitecloset.co.uk/_next/image?url=https%3A%2F%2Fapi.infinitecloset.co.uk%2Fuploads%2Flarge_NKIE_WD_394_V1_2_22a4139b48.jpg&w=1920&q=75',
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
  order: order,
  firstName: 'First Name',
  totalPrice: 30.13,
  range: { start: '8/24/2020', end: '8/28/2020' }
};

var recommendations = [product, product, product, product];

var data = {
  'contact-us': {
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email',
    phoneNumber: 'Phone',
    message: 'Random message'
  },
  'order-shipping-failure': {
    order: {},
    error: {}
  },
  'forgot-password': {
    user: user,
    url: '/REST_URL'
  },

  'newsletter-subscription': {},
  'waitlist-subscription': {},
  'mailinglist-subscription': {},

  'join-launch-party': {
    firstName: 'First Name',
    ticketPrice: 25,
    donation: 25.0,
    discount: 5,
    total: 45,
    guests: ['Bob', 'Joe']
  },
  'order-confirmation': {
    firstName: 'First Name',
    cart: [orderData, orderData],
    address: address,
    summary: summary,
    recommendations: recommendations
  },
  'order-shipped': orderData,
  'order-starting': orderData,
  'order-ending': orderData,
  'order-received': orderData,
  'order-review': orderData,

  'gift-card': {
    recommendations: recommendations,
    firstName: 'First Name',
    amount: 20
  },
  'store-credit': {
    firstName: 'First Name',
    amount: 20,
    recommendations: recommendations
  },

  components: orderData
};

var NavLink = function NavLink(_ref) {
  var k = _ref.k;
  return _react2.default.createElement(
    'a',
    {
      key: k,
      href: '/' + k,
      style: {
        margin: '0.25rem 0.25rem',
        color: 'black',
        textDecoration: 'none',
        padding: '4px 8px',
        backgroundColor: '#eee',
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

  var defaultEmail = Object.keys(data).slice(-1)[0];
  var path = window.location.pathname.split('/')[1];

  _react2.default.useEffect(function () {
    var Email = _react2.default.lazy(function () {
      return import('./email-templates/' + (path || defaultEmail));
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
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap'
        }
      },
      Object.keys(data).sort().map(function (key) {
        return _react2.default.createElement(NavLink, { key: key, k: key });
      })
    ),
    _react2.default.createElement(
      'div',
      { style: { width: '100%' } },
      Email && _react2.default.createElement(
        _react2.default.Suspense,
        { fallback: _react2.default.createElement('div', null) },
        _react2.default.createElement(Email, { data: data[path || defaultEmail] })
      )
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(Emails, null), document.getElementById('root'));