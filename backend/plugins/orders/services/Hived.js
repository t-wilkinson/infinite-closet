const fetch = require('node-fetch');
const crypto = require('crypto');

const hivedApi = {
  parcels: 'https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels',
  postcodes: 'https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes',
  key: 'keyzCmMhMH9fvKBPV',
  shippingClass: '2-Day', // Same-Day Next-Day 2-Day
  shippingClasses: {
    zero: 'Same-Day',
    one: 'Next-Day',
    two: '2-Day',
  },
};

const addresses = {
  infinitecloset: {
    Name: 'Infinite Closet',
    Address_Line_1: '22 Horder Rd',
    Town: 'London',
    Postcode: 'SW6 5EE',
    Email_Address: 'sarah.korich@infinitecloset.co.uk',
  },
  oxwash: {
    Name: 'Oxwash',
    Address_Line_1: 'Avro House',
    Address_Line_2: 'Unit AH003',
    Address_Line_3: 'Havelock Terrace',
    Town: 'London',
    Postcode: 'SW8 4AS',
    Email_Address: 'battersea@oxwash.com',
  },
};

const toAddress = (addr, role) => {
  const res = {};

  for (const [k, v] of Object.entries(addr)) {
    if (k === 'Name') {
      res[`${role}`] = v;
    } else {
      res[`${role}_${k}`] = v;
    }
  }

  return res;
};

async function fetchHived(url, method, body = {}) {
  return fetch(url, {
    method,
    headers: {
      Authorization: 'Bearer ' + hivedApi.key,
      'Content-Type': 'application/json',
    },
    body:
      method === 'GET'
        ? undefined
        : JSON.stringify({
          fields: body,
        }),
  }).then((res) => res.json());
}

const api = {
  shipment: {
    ship: (shipment) => fetchHived(hivedApi.parcels, 'POST', shipment),
    retrieve: (shipment) =>
      fetchHived(`${hivedApi.parcels}/${shipment}`, 'GET'),
    complete: (shipment) =>
      fetchHived(`${hivedApi.parcels}/${shipment}`, 'GET').then(
        (res) => res.Tracking_ID_Complete === 'COMPLETE'
      ),
  },
  postcode: {
    verify: (postcode) =>
      fetchHived(hivedApi.postcodes, 'GET', { Recipient_Postcode: postcode }),
  },
};

async function verify(postcode) {
  let valid;

  try {
    const res = api.postcode.verify(postcode);
    valid = res.fields.Address_in_delivery_Area === 'Valid';
  } catch (e) {
    valid = false;
  }

  return valid;
}

async function ship(order) {
  const price = strapi.plugins['orders'].services.price.price(order);
  const { address } = order;
  const user = order.user;

  const orderAddress = {
    Name: address.firstName + ' ' + address.lastName,
    Address_Line_1: address.address,
    Town: address.town,
    Postcode: address.postcode,
    Email_Address: user.email,
    Phone_Number: user.phoneNumber,
  };

  let hivedBody = {
    Shipping_Class: hivedApi.shippingClass,
    Sender:
      process.env.NODE_ENV === 'production'
        ? 'Infinite Closet'
        : 'Infinite Closet Testing',
    Value_GBP: price,
    // Sender_Chosen_Collection_Date: MM/DD/YYYY
    // Sender_Chosen_Delivery_Date: MM/DD/YYYY
  };

  if (order.status === 'shipping') {
    Object.assign(
      hivedBody,
      toAddress(addresses.infinitecloset, 'Collection'),
      toAddress(orderAddress, 'Recipient'),
      {
        Shipping_Class:
          hivedApi.shippingClasses[
            strapi.plugins['orders'].services.date.shippingClass(order)
          ] || 'one',
      }
    );
  } else if (order.status === 'cleaning') {
    Object.assign(
      hivedBody,
      toAddress(orderAddress, 'Collection'),
      toAddress(addresses.oxwash, 'Recipient'),
      { Shipping_Class: '2-Day' }
    );
  }

  if (process.env.NODE_ENV === 'production') {
    return await api.shipment.ship(hivedBody);
  } else {
    return { id: crypto.randomBytes(16).toString('base64') };
  }
}

module.exports = { fetchHived, api, verify, ship };
