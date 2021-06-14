"use strict";
const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports = {
  async paymentMethods(ctx) {
    const user = ctx.state.user;
    let paymentMethods = [];
    do {
      // fetch all payment methods attached to user
      const res = await stripe.paymentMethods.list({
        customer: user.customer,
        type: "card",
      });
      paymentMethods = paymentMethods.concat(res.data);
    } while (paymentMethods.has_more);

    ctx.send({
      paymentMethods,
    });
  },

  async attachSetupIntent(ctx) {
    const user = ctx.state.user;
    const intent = await stripe.setupIntents.create({
      customer: user.customer,
    });

    ctx.send({
      status: 200,
      clientSecret: intent.client_secret,
    });
  },
};
