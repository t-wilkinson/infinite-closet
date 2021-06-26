const fetch = require("node-fetch");

const hived = {
  parcels: "https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels",
  postcodes: "https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes",
  key: "keyzCmMhMH9fvKBPV",
  shippingClass: "2-Day", // Same-Day Next-Day 2-Day
};

const collections = {
  shipping: {
    Collection: "Infinite Closet",
    Collection_Address_Line_1: "22 Horder Rd",
    Collection_Town: "London",
    Collection_Postcode: "SW6 5EE",
    Collection_Email_Address: "sarah.korich@infinitecloset.co.uk",
  },
  cleaning: {
    Collection: "Oxwash",
    Collection_Address_Line_1: "Avro House",
    Collection_Address_Line_2: "Unit AH003",
    Collection_Address_Line_3: "Havelock Terrace",
    Collection_Town: "London",
    Collection_Postcode: "SW8 4AS",
    Collection_Email_Address: "battersea@oxwash.com",
  },
};

module.exports = {
  ship(order) {
    const price = strapi.plugins["orders"].services.order.price(order);
    const { address } = order;
    const user = order.user;

    const hivedBody = {
      ...collections[order.status],
      Recipient: address.firstName + " " + address.lastName,
      Recipient_Address_Line_1: address.address,
      Recipient_Town: address.town,
      Recipient_Postcode: address.postcode,
      Recipient_Email_Address: user.email,
      Recipient_Phone_Number: user.phoneNumber,
      Shipping_Class: hived.shippingClass,
      Sender: "Infinite Closet",
      Value_GBP: price,
      // Sender_Chosen_Collection_Date: MM/DD/YYYY
      // Sender_Chosen_Delivery_Date: MM/DD/YYYY
    };

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
