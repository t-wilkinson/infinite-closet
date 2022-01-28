'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fmtDate = undefined;

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _utc = require('dayjs/plugin/utc');

var _utc2 = _interopRequireDefault(_utc);

var _timezone = require('dayjs/plugin/timezone');

var _timezone2 = _interopRequireDefault(_timezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dayjs2.default.extend(_utc2.default);
_dayjs2.default.extend(_timezone2.default);

var fmtDate = exports.fmtDate = function fmtDate(date) {
    return (0, _dayjs2.default)(date).tz('Europe/London').format('dddd, MMM D');
};