'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFrontendURL = getFrontendURL;
exports.getBackendURL = getBackendURL;
function getFrontendURL(url) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return 'https://' + process.env.FRONTEND_DOMAIN + url;
}

function getBackendURL(url) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return 'https://' + process.env.BACKEND_DOMAIN + url;
}