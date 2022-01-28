'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('./api');

Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _api[key];
    }
  });
});

var _date = require('./date');

Object.keys(_date).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _date[key];
    }
  });
});
var fmtPrice = exports.fmtPrice = function fmtPrice() {
  var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var simple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var fmt = price % 1 === 0 && simple ? price.toString() : price.toFixed(2);
  return price >= 0 ? '\xA3' + fmt : '-\xA3' + fmt;
};