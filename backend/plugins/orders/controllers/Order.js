"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { generateAPI } = require("../../../api/utils");
const fetch = require("node-fetch");

// TODO: hardcode settings for now
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

    const order = await strapi.query("order", "orders").create({
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

  async getCart(ctx) {
    const user = ctx.state.user;

    let cart = await strapi.query("order", "orders").find({
      user: user.id,
      status: "cart",
    },
    [ "product", "product.designer", "product.images"]);
    cart = cart.map(item => ({...item, price: strapi.plugins["orders"].services.order.calculatePrice(item)}))

    ctx.send({
      cart,
    });
  },

  async checkout(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body;

    const updates = body.cart.map((order) => {
      return strapi.query("order", "orders").update(
        {id: order.id},
        {
        address: body.address,
        paymentMethod: body.paymentMethod,
        status: "planning",
      });
    });
    const result = await Promise.allSettled(updates);
    strapi.log.info('checkout:result = %o', result)

    ctx.send({ status: 200, result});
  },

  async calculateCartPrice(ctx) {
    const user = ctx.state.user;
    const price = strapi.plugins["orders"].services.order.calculateCartPrice(
      body.cart || user.cart
    );
    ctx.send({ price });
  },

  async calculateAmount(ctx) {
    const user = ctx.state.user;
    const amount = strapi.plugins["orders"].services.order.calculateAmount(
      body.order
    );
    ctx.send({ amount });
  },

  async ship(ctx) {
    const { order } = ctx.request.body;
    strapi.log.info("orders:ship:order %o", order);
    const { address } = order;
    const amount = await strapi.plugins["orders"].services.order.calculateAmount( order);
    const user = order.user

    stripe.paymentIntents
      .create({
        amount,
        currency: "gbp",
        customer: user.customer,
        payment_method: order.paymentMethod,
        off_session: true,
        confirm: true,
      })

      .then((paymentIntent) =>
            strapi.query("order", "orders").update(
              { id: order.id},
              { status: "shipping",
                paymentIntent: paymentIntent.id,
              }
      ))

      /* TODO: production: uncomment
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
            Collection_Address_Line_1: 'TODO',
            Collection_Town: 'TODO',
            Collection_Postcode: 'TODO',
            Collection_Email_Address: "sarah.korich@infinitecloset.co.uk",
            Collection_Phone_Number: 'TODO',

            Recipient: address.first_name + " " + address.last_name,
            Recipient_Address_Line_1: address.address,
            Recipient_Town: address.town,
            Recipient_Postcode: address.postcode,
            Recipient_Email_Address: user.email,
            Recipient_Phone_Number: user.phone_number,

            Shipping_Class: "One-Day",
            Sender: "Infinite Closet",
            Value_GBP: amount, // 1000,
            // Sender_Chosen_Collection_Date: MM/DD/YYYY
            // Sender_Chosen_Delivery_Date: MM/DD/YYYY
          },
        })
      )
      */

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
