"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { generateAPI } = require("../../../api/utils");
const fetch = require("node-fetch");

// TODO: hardcode settings for now
const rentalLengths = {
  Short: 4,
  Long: 8,
};
const hived = {
  parcels: "https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels",
  postcodes: "https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes",
  key: "keyzCmMhMH9fvKBPV",
};

module.exports = {
  // TODO: probably don't need this
  ...generateAPI("order", "orders"),

  async create(ctx) {
    // TODO: make sure products are available
    const body = ctx.request.body;
    const user = ctx.state.user;

    //     let dropoffDate = new Date(body.date);
    //     dropoffDate.setUTCDate(
    //       dropoffDate.getUTCDate() + rentalLengths[body.rentalLength]
    //     );
    console.log(body.date);

    const order = await strapi.query("order", "orders").create({
      // pickupDate: body.date,
      // dropoffDate: dropoffDate.toJSON(),
      status: "cart",
      product: body.product,
      date: body.date,
      rentalLength: body.rentalLength.toLowerCase(),
      quantity: body.quantity,
      user: user.id,
      size: body.size,
    });

    ctx.send({
      status: 200,
      order,
    });
  },

  async checkout(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body;

    const updates = body.cart.map((order) => {
      return strapi.query("order", "orders").update({
        id: order.id,
        address: body.address,
        paymentMethodID: body.paymentMethod,
        status: "planning",
      });
    });
    Promise.all(updates);

    ctx.send({ status: 200 });
  },

  async calculateCartPrice(ctx) {
    const user = ctx.state.user;
    const price = await strapi.plugins["orders"].services.calculateCartPrice(
      body.cart || user.cart
    );
    ctx.send({ price });
  },

  async calculateAmount(ctx) {
    const user = ctx.state.user;
    const amount = await strapi.plugins["orders"].services.calculateAmount(
      body.order
    );
    ctx.send({ amount });
  },

  async ship(ctx) {
    const { order } = ctx.request.body;
    strapi.log.info("order %o", order);
    const { address } = order;
    const amount = await strapi.plugins["orders"].services.calculateAmount(
      order
    );
    const user = await strapi
      .query("user", "users-permissions")
      .find({ id: order.user });

    stripe.paymentIntents
      .create({
        amount,
        currency: "gbp",
        customer: user.customer,
        payment_method: order.paymentMethodID,
        off_session: true,
        confirm: true,
      })

      .then((paymentIntent) =>
        strapi.query("order", "orders").update({
          id: order.id,
          status: "shipping",
          paymentIntentID: paymentIntent.id,
        })
      )

      .then(() =>
        fetch(hived.parcels, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + hived.key,
            "Content-Type": "application/json",
          },
          body: {
            // TODO: Infinite Closet info
            Collection: "Infinite Closet",
            Collection_Address_Line_1: address.address,
            Collection_Town: address.town,
            Collection_Postcode: address.postcode,
            Collection_Email_Address: "sarah.korich@infinitecloset.co.uk",
            Collection_Phone_Number: user.phone_number,

            Recipient: address.first_name + " " + address.last_name,
            Recipient_Address_Line_1: address.address,
            Recipient_Town: address.town,
            Recipient_Postcode: address.postcode,
            Recipient_Email_Address: user.email,
            Recipient_Phone_Number: user.phone_number,

            Shipping_Class: "One-Day",
            Sender: "Infinite Closet",
            Value_GBP: amount, // 1000,
            // Sender_Chosen_Collection_Date
            // Sender_Chosen_Delivery_Date
          },
        })
      )

      .then(() => {
        // TODO: send email to user?
      })

      .catch((err) => {
        // TODO: something failed, contact user with next step to take
      });

    ctx.send({
      status: 200,
    });
  },
};

/*
 * Hived API
 *

const shippingClass = {
  one_day: "One-Day",
  two_day: "2-Day",
  next_day: "Next-Day",
};

React.useEffect(() => {
  if (order.status === "shipping" && order.shipping && !order.shipping_json) {
    fetch(plugin.hived.api, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + plugin.hived.key,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        order.shipping_json = res;
      });
  }
}, [order.status]);

return Promise.all(
  res.map((order) =>
    fetch(
      plugin.stripe.api + "/payment_intents/" + order.payment_intent,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + plugin.stripe.key,
        },
      }
    )
      .then((res) => res.json())
      .catch(() => null)
  )
);

.then((payment_intents) => {
setOrders((orders) =>
  orders.map((order, i) => {
    if (payment_intents[i]) {
      return {
        ...order,
        // TODO: there is probably a better solution
        payment_intent_json: payment_intents[i],
      };
    } else {
      return order;
    }
  })
);

*/
