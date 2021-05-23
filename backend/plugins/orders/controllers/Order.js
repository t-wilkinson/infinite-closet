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
    const body = ctx.request.body;
    const user = ctx.state.user;

    if (!["cart", "list"].includes(body.status)) {
      return;
    }

    const previousOrders = await strapi.query("order", "orders").find({
      product: body.product,
      size: body.size,
    });
    const previousQuantity = previousOrders.reduce(
      (sum, order) => sum + order.quantity,
      0
    );

    const order = await strapi.query("order", "orders").create({
      status: body.status,
      product: body.product,
      date: body.date,
      rentalLength: body.rentalLength.toLowerCase(),
      quantity: previousQuantity + body.quantity,
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

    let cart = await strapi.query("order", "orders").find(
      {
        user: user.id,
        status: "cart",
      },
      ["product", "product.designer", "product.images"]
    );

    const numAvailable = await strapi.plugins[
      "orders"
    ].services.order.numAvailable(cart);

    // add total and available quantity to each order
    cart = cart.map((order) => {
      const key = strapi.plugins["orders"].services.order.toKey(order);
      return {
        ...order,
        price: strapi.plugins["orders"].services.order.price(order),
        available: numAvailable[key],
      };
    });

    ctx.send({
      cart,
    });
  },

  async removeCartItem(ctx) {
    const { id } = ctx.params;
    const order = await strapi
      .query("order", "orders")
      .update({ id }, { status: "dropped" });
    ctx.send({
      order,
    });
  },

  async checkout(ctx) {
    const body = ctx.request.body;
    const numAvailable = await strapi.plugins[
      "orders"
    ].services.order.numAvailable(body.cart);

    const updates = body.cart.map((order) => {
      const key = strapi.plugins["orders"].services.order.toKey(order);
      if (!strapi.plugins["orders"].services.order.dateValid(order)) {
        return Promise.reject(`${dayjs(order.date)} is not valid date`);
      } else if (order.quantity > 0 && order.quantity <= numAvailable[key]) {
        return strapi.query("order", "orders").update(
          { id: order.id },
          {
            address: body.address,
            paymentMethod: body.paymentMethod,
            status: "planning",
          }
        );
      } else {
        return Promise.reject(
          `Not enough quantity available for order ${order.id}`
        );
      }
    });
    const result = await Promise.allSettled(updates);

    ctx.send({ status: 200, result });
  },

  async cartPrice(ctx) {
    const user = ctx.state.user;
    const price = strapi.plugins["orders"].services.order.cartPrice(
      body.cart || user.cart
    );
    ctx.send({ price });
  },

  async amount(ctx) {
    const amount = strapi.plugins["orders"].services.order.amount(body.order);
    ctx.send({ amount });
  },

  // TODO: this method should be protected
  async ship(ctx) {
    const { order } = ctx.request.body;
    const { address } = order;
    const amount = await strapi.plugins["orders"].services.order.amount(order);
    const user = order.user;

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
        strapi
          .query("order", "orders")
          .update({ id: order.id }, { paymentIntent: paymentIntent.id })
      )

      .then(() => {
        if (process.env.NODE_ENV === "production") {
          return fetch(hived.parcels, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + hived.key,
              "Content-Type": "application/json",
            },
            body: {
              Collection: "Infinite Closet",
              Collection_Address_Line_1: "22 Horder Rd",
              Collection_Town: "London",
              Collection_Postcode: "SW6 5EE",
              Collection_Email_Address: "sarah.korich@infinitecloset.co.uk",

              Recipient: address.first_name + " " + address.last_name,
              Recipient_Address_Line_1: address.address,
              Recipient_Town: address.town,
              Recipient_Postcode: address.postcode,
              Recipient_Email_Address: user.email,
              Recipient_Phone_Number: user.phone_number,

              Shipping_Class: "One-Day",
              Sender: "Infinite Closet",
              Value_GBP: amount / 100, // 1000,
              // Sender_Chosen_Collection_Date: MM/DD/YYYY
              // Sender_Chosen_Delivery_Date: MM/DD/YYYY
            },
          }).then((res) => res.json());
        } else {
          return new Promise((res) => res());
        }
      })

      .then((res) =>
        // only update status once payment and delivery are valid
        strapi
          .query("order", "orders")
          .update({ id: order.id }, { status: "shipping", shipment: res.id })
      )

      .then(() => {
        // TODO: send email to user?
      })

      .catch((err) => {
        // TODO: something failed, contact user with next step to take
        if (err.error) {
          // stripe error
        } else {
        }
      });

    ctx.send({
      status: 200,
    });
  },

  // TODO: this method should be protected
  async complete(ctx) {
    const body = ctx.request.body;
    const { order } = body;

    const res = await strapi
      .query("order", "orders")
      .update({ id: order.id }, { status: "completed" });

    ctx.send({
      status: 200,
      order: res,
    });
  },
};
