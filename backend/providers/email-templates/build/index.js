'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Misc


// Order lifecycle

// import OrderStarting from './email-templates/order-starting'


// Money


// Non user-facing


// Old


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

require('./styles.css');

var _data = require('./utils/data');

var _components = require('./email-templates/components');

var _components2 = _interopRequireDefault(_components);

var _forgotPassword = require('./email-templates/forgot-password');

var _forgotPassword2 = _interopRequireDefault(_forgotPassword);

var _orderConfirmation = require('./email-templates/order-confirmation');

var _orderConfirmation2 = _interopRequireDefault(_orderConfirmation);

var _orderShipped = require('./email-templates/order-shipped');

var _orderShipped2 = _interopRequireDefault(_orderShipped);

var _orderEnding = require('./email-templates/order-ending');

var _orderEnding2 = _interopRequireDefault(_orderEnding);

var _orderReceived = require('./email-templates/order-received');

var _orderReceived2 = _interopRequireDefault(_orderReceived);

var _orderReview = require('./email-templates/order-review');

var _orderReview2 = _interopRequireDefault(_orderReview);

var _giftCard = require('./email-templates/gift-card');

var _giftCard2 = _interopRequireDefault(_giftCard);

var _storeCredit = require('./email-templates/store-credit');

var _storeCredit2 = _interopRequireDefault(_storeCredit);

var _trustPilot = require('./email-templates/trust-pilot');

var _trustPilot2 = _interopRequireDefault(_trustPilot);

var _orderShippingFailure = require('./email-templates/order-shipping-failure');

var _orderShippingFailure2 = _interopRequireDefault(_orderShippingFailure);

var _contactUs = require('./email-templates/contact-us');

var _contactUs2 = _interopRequireDefault(_contactUs);

var _joinLaunchParty = require('./email-templates/join-launch-party');

var _joinLaunchParty2 = _interopRequireDefault(_joinLaunchParty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templates = {
  misc: {
    label: 'Misc',
    components: _components2.default,
    // 'newsletter-subscription': {},
    // 'waitlist-subscription': {},
    // 'mailinglist-subscription': {},
    'forgot-password': _forgotPassword2.default
  },

  order: {
    label: 'Order lifecycle',
    'order-confirmation': _orderConfirmation2.default,
    'order-shipped': _orderShipped2.default,
    // 'order-starting': OrderStarting,
    'order-ending': _orderEnding2.default,
    'order-received': _orderReceived2.default,
    'order-review': _orderReview2.default
  },

  money: {
    label: 'Money',
    'gift-card': _giftCard2.default,
    'store-credit': _storeCredit2.default
  },

  'non-user-facing': {
    label: 'Non user-facing',
    'trust-pilot': _trustPilot2.default,
    'order-shipping-failure': _orderShippingFailure2.default,
    'contact-us': _contactUs2.default
  },

  old: {
    label: 'Old',
    'join-launch-party': _joinLaunchParty2.default
  }
};

var NavLink = function NavLink(_ref) {
  var group = _ref.group,
      template = _ref.template,
      active = _ref.active;

  return _react2.default.createElement(
    'a',
    {
      key: template,
      href: '/' + group + '/' + template,
      style: {
        fontWeight: active ? 'bold' : 'normal',
        color: 'black',
        textDecoration: 'none',
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 14
      }
    },
    template
  );
};

var Emails = function Emails() {
  // const [Email, setEmail] = React.useState()
  var _window$location$path = window.location.pathname.split('/').slice(1, 3),
      _window$location$path2 = _slicedToArray(_window$location$path, 2),
      group = _window$location$path2[0],
      template = _window$location$path2[1];

  if (!templates[group] || !templates[group][template]) {
    group = 'misc';
    template = 'components';
  }
  var Email = templates[group][template];

  //   React.useEffect(() => {
  //     const Email = React.lazy(() =>
  //       import(`./email-templates/${path[1] || defaultEmail[1]}`)
  //     )
  //     setEmail(Email)
  //   }, [])

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
      Object.keys(templates).map(function (grp) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          { key: grp },
          _react2.default.createElement(
            'strong',
            { style: { marginTop: 8 } },
            templates[grp].label
          ),
          Object.keys(templates[grp]).map(function (temp) {
            return temp !== 'label' && _react2.default.createElement(NavLink, { key: temp, template: temp, group: grp, active: grp === group && temp === template });
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
        { width: '100%', style: { maxWidth: 1200, width: '100%' } },
        _react2.default.createElement(Email, { data: _data.defaultData[template] })
      )
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(Emails, null), document.getElementById('root'));