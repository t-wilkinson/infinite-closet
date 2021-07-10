"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getURL = getURL;
function getURL(url) {
  if (url == null) {
    return null;
  }

  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  return "https://" + process.env.BACKEND_DOMAIN + url;
}