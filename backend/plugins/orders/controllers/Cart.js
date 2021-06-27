"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);
const dayjs = require("dayjs");

module.exports = {
  async totalPrice(ctx) {
    const body = ctx.request.body;
    const total = strapi.plugins["orders"].services.price.totalPrice({
      cart: body.cart,
      insurance: body.insurance,
    });
    ctx.send(total);
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
      const dateValid = strapi.plugins["orders"].services.date.valid(
        order.date
      );

      return {
        ...order,
        price: strapi.plugins["orders"].services.price.price(order),
        available: numAvailable[key],
        valid: dateValid,
        dateValid,
      };
    });

    ctx.send({
      cart,
    });
  },

  // TODO: remove this, use PUT instead
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
      if (!strapi.plugins["orders"].services.date.valid(order.date)) {
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

    const amount = strapi.plugins["orders"].services.price.totalAmount({
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
        strapi.services.mailchimp.template("checkout-cart", {
          to: user.email,
          global_merge_vars: [
            {
              name: "total_price",
              content: strapi.plugins["orders"].services.price.toPrice(
                amount.total
              ),
            },
          ],
        });
        return orders;
      })

      .catch((err) => strapi.log.error(err));

    ctx.send({ status: 200, result });
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
