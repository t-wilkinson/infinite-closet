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

    for (const order of orders) {
      order.price = strapi.plugins["orders"].services.price.price(order);
    }

    ctx.send({
      orders,
    });
  },

  async ship(ctx) {
    const { order } = ctx.request.body;

    if (process.NODE_ENV === "production") {
      strapi
        .query("order", "orders")
        .update(
          { id: order.id },
          {
            status: "shipping",
            shippingDate: dayjs().tz("Europe/London").toJSON(),
          }
        )
        .then(() => strapi.plugins["orders"].services.hived.ship(order))
        .then((res) => res.json())

        .then((res) =>
          strapi
            .query("order", "orders")
            .update({ id: order.id }, { shipment: res.id })
        )

        .then(() => {
          strapi.services.mailchimp.template("order-shipped", {
            to: order.user.email,
            subject: `Your order of ${order.product.name} by ${order.product.designer.name} has just shipped`,
            global_merge_vars: [
              {
                name: "shipping_date",
                content: dayjs(order.date).format("ddd, MMM DD"),
              },
            ],
          });
        })

        .catch((err) => {
          strapi
            .query("order", "orders")
            .update({ id: order.id }, { status: "error", message: err });

          strapi.services.mailchimp.template("order-shipping-failure", {
            to: "info@infinitecloset.co.uk",
            global_merge_vars: [
              { name: "order", content: JSON.stringify(order, null, 4) },
              { name: "error", content: JSON.stringify(err, null, 4) },
            ],
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
            shippingDate: dayjs().tz("Europe/London").toJSON(),
          }
        )

        .then(() => {
          strapi.services.mailchimp.template("order-shipped", {
            to: [
              {
                name: order.user.email,
                email: "info+test@infinitecloset.co.uk",
              },
            ],
            subject: `Your order of ${order.product.name} by ${order.product.designer.name} has just shipped`,
            global_merge_vars: [
              {
                name: "shipping_date",
                content: dayjs(order.date).format("ddd, MMM DD"),
              },
            ],
          });
        })

        .catch((err) => {
          strapi
            .query("order", "orders")
            .update({ id: order.id }, { status: "error", message: err });

          strapi.services.mailchimp.template("order-shipping-failure", {
            to: "info@infinitecloset.co.uk",
            global_merge_vars: [
              { name: "order", content: JSON.stringify(order, null, 4) },
              { name: "error", content: JSON.stringify(err, null, 4) },
            ],
          });

          strapi.log.error(err);
        });
    }

    ctx.send({});
  },
};
