"use strict";

const crypto = require("crypto");
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
  shippingClass: "Next-Day", // Same-Day Next-Day 2-Day
};

module.exports = {
  ...generateAPI("order", "orders"),

  async create(ctx) {
    const body = ctx.request.body;
    const user = ctx.state.user;

    if (strapi.plugins["orders"].services.order.inProgress(body.status)) {
      return;
    }

    const orderBody = {
      status: body.status,
      product: body.product,
      date: body.date,
      rentalLength: body.rentalLength.toLowerCase(),
      user: user.id,
      size: body.size,
    };
    const matchingOrder = await strapi
      .query("order", "orders")
      .findOne({ product: body.product, status: body.status });

    let order;
    if (matchingOrder) {
      order = await strapi
        .query("order", "orders")
        .update({ id: matchingOrder.id }, orderBody);
    } else {
      order = await strapi.query("order", "orders").create(orderBody);
    }

    ctx.send({
      status: 200,
      order,
    });
  },

  async status(ctx) {
    const user = ctx.state.user;

    let orders = await strapi
      .query("order", "orders")
      .find({ user: user.id }, [
        "product",
        "product.designer",
        "product.images",
      ]);

    // add price to each order
    orders = orders.map((order) => {
      return {
        ...order,
        price: strapi.plugins["orders"].services.order.price(order),
      };
    });

    ctx.send({
      orders,
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
            insurance: body.insurance[order.id] || false,
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

    const amount = await strapi.plugins["orders"].services.order.totalAmount({
      cart,
      insurance: body.insurance,
    });

    stripe.paymentIntents
      .create({
        amount: amount.total,
        currency: "gbp",
        customer: user.customer,
        payment_method: body.paymentMethod,
        off_session: false,
        confirm: true,
      })

      .then((paymentIntent) =>
        Promise.allSettled(
          cart.map((order) =>
            strapi
              .query("order", "orders")
              .update({ id: order.id }, { paymentIntent: paymentIntent.id })
          )
        )
      )

      .then((settled) => {
        const orders = settled.filter((settle) => settle.status == "fulfilled");
        strapi.plugins["email"].services.email.send({
          to: user.email,
          subject: "Thank you for your purchase",
          html: `We thank you for your purchase of £${
            amount.total / 100
          } and hope you enjoyed the experience.`,
        });
        return orders;
      })

      .catch((err) => strapi.log.error(err));

    ctx.send({ status: 200, result });
  },

  async totalPrice(ctx) {
    const body = ctx.request.body;
    const total = strapi.plugins["orders"].services.order.totalPrice({
      cart: body.cart,
      insurance: body.insurance,
    });
    ctx.send(total);
  },

  async totalAmount(ctx) {
    const body = ctx.request.body;
    const total = strapi.plugins["orders"].services.order.totalAmount({
      cart: body.cart,
      insurance: body.insurance,
    });
    ctx.send(total);
  },

  async amount(ctx) {
    const amount = strapi.plugins["orders"].services.order.amount(body.order);
    ctx.send({ amount });
  },

  async ship(ctx) {
    const { order } = ctx.request.body;
    const { address } = order;
    const amount = await strapi.plugins["orders"].services.order.totalAmount(
      order
    );
    const user = order.user;
    const hivedBody = {
      Collection: "Infinite Closet",
      Collection_Address_Line_1: "22 Horder Rd",
      Collection_Town: "London",
      Collection_Postcode: "SW6 5EE",
      Collection_Email_Address: "sarah.korich@infinitecloset.co.uk",
      Recipient: address.firstName + " " + address.lastName,
      Recipient_Address_Line_1: address.address,
      Recipient_Town: address.town,
      Recipient_Postcode: address.postcode,
      Recipient_Email_Address: user.email,
      Recipient_Phone_Number: user.phoneNumber,
      Shipping_Class: hived.shippingClass,
      Sender: "Infinite Closet",
      Value_GBP: amount.total / 100,
      // Sender_Chosen_Collection_Date: MM/DD/YYYY
      // Sender_Chosen_Delivery_Date: MM/DD/YYYY
    };

    if (process.NODE_ENV === "production") {
      fetch(hived.parcels, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + hived.key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hivedBody),
      })
        .then((res) => res.json())
        .then((res) =>
          strapi
            .query("order", "orders")
            .update({ id: order.id }, { status: "shipping", shipment: res.id })
        )
        .then(() => {
          strapi.plugins["email"].services.email.send({
            to: order.user.email,
            subject: `Your order of ${order.product.name} by ${order.product.designer.name} has just shipped`,
            html: `Expect a delivery on ${dayjs(order.date).format(
              "ddd, MMM DD"
            )}.`,
          });
        })
        .catch((err) => {
          strapi.query("order", "orders").update(
            { id: order.id },
            {
              status: "error",
              message: `Shipping order failed with error: ${err}.`,
            }
          );

          strapi.plugins["email"].services.email.send({
            to: "info@infinitecloset.co.uk",
            subject: `Failed to ship order`,
            html: `
            Order:
              ${JSON.stringify(order, null, 4)}

            Error:
              ${JSON.stringify(err, null, 4)}
            `,
            html: `Expect a delivery on ${dayjs(order.date).format(
              "ddd, MMM DD"
            )}.`,
          });

          strapi.log.error(err);
        });
    } else {
      strapi
        .query("order", "orders")
        .update(
          { id: order.id },
          {
            status: "shipping",
            shipment: crypto.randomBytes(16).toString("base64"),
          }
        )

        .then(() => {
          strapi.plugins["email"].services.email.send({
            to: `${order.user.email} <info+test@infinitecloset.co.uk>`,
            subject: `Your order of ${order.product.name} by ${order.product.designer.name} has just shipped`,
            html: `Expect a delivery on ${dayjs(order.date).format(
              "ddd, MMM DD"
            )}.`,
          });
        })

        .catch((err) => {
          strapi.plugins["email"].services.email.send({
            to: "info@infinitecloset.co.uk",
            subject: `Failed to ship order`,
            html: `
            Order:
              ${JSON.stringify(order, null, 4)}

            Error:
              ${JSON.stringify(err, null, 4)}
            `,
            html: `Expect a delivery on ${dayjs(order.date).format(
              "ddd, MMM DD"
            )}.`,
          });

          strapi.log.error(err);
        });
    }

    ctx.send({
      status: 200,
    });
  },

  async cleaning(ctx) {
    const body = ctx.request.body;
    const { order } = body;
    const res = await strapi
      .query("order", "orders")
      .update({ id: order.id }, { status: "cleaning" });
    ctx.send({
      status: 200,
      order: res,
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

/* Incase we want to charge user during shipment(not checkout)
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
*/
