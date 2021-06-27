const fetch = require("node-fetch");

const hived = {
  parcels: "https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels",
  postcodes: "https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes",
  key: "keyzCmMhMH9fvKBPV",
  shippingClass: "2-Day", // Same-Day Next-Day 2-Day
};

const addresses = {
  infinitecloset: {
    Name: "Infinite Closet",
    Address_Line_1: "22 Horder Rd",
    Town: "London",
    Postcode: "SW6 5EE",
    Email_Address: "sarah.korich@infinitecloset.co.uk",
  },
  oxwash: {
    Name: "Oxwash",
    Address_Line_1: "Avro House",
    Address_Line_2: "Unit AH003",
    Address_Line_3: "Havelock Terrace",
    Town: "London",
    Postcode: "SW8 4AS",
    Email_Address: "battersea@oxwash.com",
  },
};

const toAddress = (addr, role) => {
  const res = {};

  for (const [k, v] of Object.entries(addr)) {
    if (k === "Name") {
      res[`${type}`] = v;
    } else {
      res[`${type}_${k}`] = v;
    }
  }

  return res;
};

module.exports = {
  ship(order) {
    const price = strapi.plugins["orders"].services.price.price(order);
    const { address } = order;
    const user = order.user;

    const orderAddress = {
      Name: address.firstName + " " + address.lastName,
      Address_Line_1: address.address,
      Town: address.town,
      Postcode: address.postcode,
      Email_Address: user.email,
      Phone_Number: user.phoneNumber,
    };

    let hivedBody = {
      Shipping_Class: hived.shippingClass,
      Sender: "Infinite Closet",
      Value_GBP: price,
      // Sender_Chosen_Collection_Date: MM/DD/YYYY
      // Sender_Chosen_Delivery_Date: MM/DD/YYYY
    };

    if (order.status === "shipping") {
      Object.assign(
        hivedBody,
        toAddress(addresses.infinitecloset, "Collection"),
        toAddress(orderAddress, "Recipient")
      );
    } else if (order.status === "cleaning") {
      Object.assign(
        hivedBody,
        toAddress(orderAddress, "Collection"),
        toAddress(addresses.oxwash, "Recipient")
      );
    }

    return fetch(hived.parcels, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + hived.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hivedBody),
    });
  },
};
