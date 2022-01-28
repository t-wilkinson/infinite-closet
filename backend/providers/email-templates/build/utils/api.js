'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFrontendURL = getFrontendURL;
exports.getBackendURL = getBackendURL;
exports.normalizeSize = normalizeSize;
// const env = obj => obj[process.env.NODE_ENV]

var frontendOrigin = process.env.REACT_APP_FRONTEND_ORIGIN || 'http://ic.com';
var backendOrigin = process.env.REACT_APP_BACKEND_ORIGIN || 'http://api.ic.com';

function getFrontendURL(url) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return '' + frontendOrigin + url;
}

function getBackendURL(url) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return '' + backendOrigin + url;
}

function normalizeSize(size) {
  return size ? size.size.replace('_', '') : size;
}