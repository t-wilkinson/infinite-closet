"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

require("./styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orderData = {
  firstName: "First Name",
  price: 30.13,
  size: "MD",
  range: { start: "8/24/2020", end: "8/28/2020" },
  product: {
    name: "Product",
    designer: {
      name: "Designer"
    },
    images: [{
      url: "https://ci6.googleusercontent.com/proxy/0i_xXUdxzuItZLDm1D_gMnKlbWwQGzeTJkobLx32DdFSHfnxDaJXpXYzol9sUEWpPoykOc9n9Ez5hBZKecHtI8ztei6z6CwJTUC-y2kQgKWzTegtLg8XCg6VZb_vS0pf=s0-d-e1-ft#https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._AC_SR80,80_.jpg",
      alternativeText: "Alt Text"
    }]
  }
};

var data = {
  "contact-us": {
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email",
    phoneNumber: "Phone",
    message: "Random message"
  },
  "order-shipping-failure": {
    order: {},
    error: {}
  },
  "forgot-password": {
    url: "REST_URL"
  },
  checkout: {
    firstName: "First Name",
    orders: [orderData, orderData],
    totalPrice: 25
  },
  "newsletter-subscription": {},
  "waitlist-subscription": {},
  "join-launch-party": {
    firstName: "First Name",
    TICKET_PRICE: 25,
    donation: 25.0,
    discount: 5,
    total: 45
  },
  "confirm-email-address": {
    url: "URL"
  },
  "order-arriving": orderData,
  "order-leaving": orderData
};

var Emails = function Emails() {
  var _React$useState = _react2.default.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      Email = _React$useState2[0],
      setEmail = _React$useState2[1];

  var _React$useState3 = _react2.default.useState(Object.keys(data).slice(-1)[0]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      selected = _React$useState4[0],
      setSelected = _React$useState4[1];

  _react2.default.useEffect(function () {
    var Email = _react2.default.lazy(function () {
      return import("./templates/" + selected);
    });
    setEmail(Email);
  }, [selected]);

  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "nav",
      { className: "flex-row justify-start space-x-2 border-b border-gray p-2" },
      Object.keys(data).map(function (k) {
        return _react2.default.createElement(
          "button",
          {
            key: k,
            onClick: function onClick() {
              setSelected(k);
              setEmail(undefined);
            }
          },
          k
        );
      })
    ),
    _react2.default.createElement(
      "span",
      { style: { fontWeight: 900 } },
      selected
    ),
    _react2.default.createElement(
      "div",
      null,
      Email && _react2.default.createElement(
        _react2.default.Suspense,
        { fallback: _react2.default.createElement("div", null) },
        _react2.default.createElement(Email, { data: data[selected] })
      )
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(Emails, null), document.getElementById("root"));