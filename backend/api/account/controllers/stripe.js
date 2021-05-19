"use strict";
const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

module.exports = {
  async paymentMethods(ctx) {
    const user = ctx.state.user;
    let paymentMethods = []
    do { // fetch all payment methods attached to user
       const res = await stripe.paymentMethods.list({
        customer: user.customer,
        type: "card",
      });
      paymentMethods = paymentMethods.concat(res.data)
    } while (paymentMethods.has_more)

    ctx.send({
      paymentMethods,
    });
  },

  async attachSetupIntent(ctx) {
    const user = ctx.state.user
    const intent =  await stripe.setupIntents.create({
      customer: user.customer,
    });

    ctx.send({
      status: 200,
      clientSecret: intent.client_secret,
    })
  }
};
