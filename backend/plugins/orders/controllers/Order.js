"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { generateAPI } = require("../../../api/utils");
const fetch = require("node-fetch");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const hived = {
  parcels: "https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels",
  postcodes: "https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes",
  key: "keyzCmMhMH9fvKBPV",
};

module.exports = {
  ...generateAPI("order", "orders"),

  async create(ctx) {
    const body = ctx.request.body;
    const user = ctx.state.user;

    if (!["cart", "list"].includes(body.status)) {
      return;
    }

    const order = await strapi.query("order", "orders").create({
      status: body.status,
      product: body.product,
      date: body.date,
      rentalLength: body.rentalLength.toLowerCase(),
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

    // add price and available quantity to each order
    cart = cart.map((order) => {
      const key = strapi.plugins["orders"].services.order.toKey(order);
      const dateValid = strapi.plugins["orders"].services.order.dateValid(
        order
      );

      return {
        ...order,
        price: strapi.plugins["orders"].services.order.price(order),
        available: numAvailable[key],
        valid: dateValid,
        dateValid,
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
    const user = ctx.state.user;
    const body = ctx.request.body;
    const numAvailable = await strapi.plugins[
      "orders"
    ].services.order.numAvailable(body.cart);

    const updates = body.cart.map((order) => {
      const key = strapi.plugins["orders"].services.order.toKey(order);
      if (!strapi.plugins["orders"].services.order.dateValid(order)) {
        return Promise.reject(`${dayjs(order.date)} is not valid date`);
      } else if (numAvailable[key] >= 1) {
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
    const cart = result.reduce((acc, settled) => {
      if (settled.status === "fulfilled") {
        acc.push(settled.value);
      }
      return acc;
    }, []);
    strapi.log.info("result -> %o", result);

    const amount = await strapi.plugins["orders"].services.order.cartAmount(
      cart
    );

    stripe.paymentIntents
      .create({
        amount,
        currency: "gbp",
        customer: user.customer,
        payment_method: body.paymentMethod,
        off_session: false,
        confirm: true,
      })
      .then((paymentIntent) =>
        strapi
          .query("order", "orders")
          .update(
            { id_in: cart.map((order) => order.id) },
            { paymentIntent: paymentIntent.id }
          )
      )
      .catch((err) => strapi.log.error(err));

    ctx.send({ status: 200, result });
  },

  async amount(ctx) {
    const amount = strapi.plugins["orders"].services.order.amount(body.order);
    ctx.send({ amount });
  },

  async ship(ctx) {
    const { order } = ctx.request.body;
    const { address } = order;
    const amount = await strapi.plugins["orders"].services.order.amount(order);
    const user = order.user;
    const hivedBody = {
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
      Shipping_Class: "Next-Day", // Same-Day Next-Day 2-Day
      Sender: "Infinite Closet",
      Value_GBP: amount / 100,
      // Sender_Chosen_Collection_Date: MM/DD/YYYY
      // Sender_Chosen_Delivery_Date: MM/DD/YYYY
    };

    // stripe.paymentIntents
    //   .create({
    //     amount,
    //     currency: "gbp",
    //     customer: user.customer,
    //     payment_method: order.paymentMethod,
    //     off_session: true,
    //     confirm: true,
    //   })

    //   .then((paymentIntent) =>
    //     strapi
    //       .query("order", "orders")
    //       .update({ id: order.id }, { paymentIntent: paymentIntent.id })
    //   )

    if (process.NODE_ENV === "production") {
      fetch(hived.parcels, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + hived.key,
          "Content-Type": "application/json",
        },
        body: hivedBody,
      })
        .then((res) => res.json())
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
          strapi.log.error(err);
        });
    } else {
    }

    ctx.send({
      status: 200,
    });
  },

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
