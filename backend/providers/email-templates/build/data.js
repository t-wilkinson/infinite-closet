"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var orderData = {
  name: "First Name",
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

exports.default = {
  checkout: {
    name: "First Name",
    orders: [orderData, orderData]
  },
  "newsletter-subscription": { name: "Bob" },
  "order-arriving": orderData,
  "order-leaving": orderData,
  "join-launch-party": {
    TICKET_PRICE: 25,
    donation: 25.0,
    discount: 5
  }
};