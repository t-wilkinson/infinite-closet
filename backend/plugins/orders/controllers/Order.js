"use strict";

const crypto = require("crypto");
const { generateAPI } = require("../../../api/utils");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
  ...generateAPI("order", "orders"),

  async amount(ctx) {
    const body = ctx.request.body;
    const amount = strapi.plugins["orders"].services.price.amount(body.order);
    ctx.send({ amount });
  },

  // TODO: remove this, use PUT instead
  async complete(ctx) {
    const body = ctx.request.body;
    const { order } = body;
    const res = await strapi
      .query("order", "orders")
      .update({ id: order.id }, { status: "completed" });
    ctx.send({
      order: res,
    });
  },

  async create(ctx) {
    const body = ctx.request.body;
    const user = ctx.state.user;

    if (strapi.plugins["orders"].services.order.inProgress(body.status)) {
      return;
    }

    const orderBody = {
      status: "cart",
      product: body.product,
      startDate: body.date,
      rentalLength: body.rentalLength,
      user: user.id,
      size: body.size,
    };

    // const matchingOrder = await strapi
    //   .query('order', 'orders')
    //   .findOne({ product: body.product, status: body.status })

    let order;
    // if (matchingOrder) {
    //   order = await strapi
    //     .query('order', 'orders')
    //     .update({ id: matchingOrder.id }, orderBody)
    // } else {
    //   order = await strapi.query('order', 'orders').create(orderBody)
    // }
    order = await strapi.query("order", "orders").create(orderBody);

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

    for (const order of orders) {
      strapi.plugins["orders"].services.date.shippingClass(order);
      order.price = strapi.plugins["orders"].services.price.price(order);
    }

    ctx.send({
      orders,
    });
  },

  async ship(ctx) {
    let { order } = ctx.request.body;
    if (order.status === "shipping") {
      ctx.send({ message: "Already shipping" });
    }

    order = await strapi.query("order", "orders").update(
      { id: order.id },
      {
        status: "shipping",
        shippingDate: strapi.plugins["orders"].services.date.day().toJSON(),
      }
    );
    order = await strapi
      .query("order", "orders")
      .findOne({ id: order.id }, [
        "product",
        "user",
        "product.designer",
        "product.images",
      ]);
    const user = order.user;

    const onError = async (err) => {
      await strapi
        .query("order", "orders")
        .update({ id: order.id }, { status: "error", message: err });
      await strapi.plugins["email"].services.email.send({
        template: "order-shipping-failure",
        to: "info@infinitecloset.co.uk",
        subject: "Failed to ship order",
        data: { order, error: err },
      });
      strapi.log.error(err);
    };

    const sendShippingEmail = () =>
      strapi.plugins["email"].services.email.send({
        template: "order-shipped",
        to: {
          name: `${user.firstName} ${user.lastName}`,
          email: "info+shanna@infinitecloset.co.uk",
        },
        subject: `Your order of ${order.product.name} by ${order.product.designer.name} has shipped!`,
        data: {
          ...order,
          firstName: user.firstName,
          range: strapi.plugins["orders"].services.date.range(order),
          price: strapi.plugins["orders"].services.price.price(order),
        },
      });

    if (process.NODE_ENV === "production") {
      strapi.plugins["orders"].services.hived
        .ship(order)
        .then((res) =>
          strapi
            .query("order", "orders")
            .update({ id: order.id }, { shipment: res.id })
        )
        .then(sendShippingEmail)
        .catch(onError);
    } else {
      strapi
        .query("order", "orders")
        .update(
          { id: order.id },
          { shipment: crypto.randomBytes(16).toString("base64") }
        )
        .then(sendShippingEmail)
        .catch(onError);
    }

    ctx.send({});
  },
};
