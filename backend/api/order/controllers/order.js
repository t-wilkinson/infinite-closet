'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async createOrder(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body;

    const order = await strapi.query("order").create({
      paymentIntent: body.paymentIntent,
      cart: body.cart,
      shippingClass: body.shippingClass,
      address: body.address,
    });

    await strapi.query("user", "users-permissions").update(
      { id: user.id },
      {
        orders: [...user.orders, order.id],
        cart: user.cart.filter((item) => !body.cart.includes(item.id)),
      }
    );

    ctx.send({
      status: 200
    })
  },

};
