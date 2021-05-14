"use strict";

/*
 * It is critical to compute some values for stripe on the backend (ex: payment amount).
 * Here we wrap stripe requests with our defaults where possible.
 */

const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

const rental_price = {
  short: "short_rental_price",
  long: "long_rental_price",
};

const amountToCapture = (intent) => {
  // TODO:
  // Find corresponding order.
  // Remove from amount any un-fulfilled orders
  return intent.amount;
};

module.exports = {
  async capturePaymentIntent(ctx) {
    const { id } = ctx.params;

    const intent = await stripe.paymentIntents.capture(id, {
      amount_to_capture: amountToCapture(intent),
    });

    ctx.send({
      status: 200,
    });
  },

  async createPaymentIntent(ctx) {
    const user = ctx.state.user;
    const cartPrice = user.cart.reduce((price, item) => {
      const key = rental_price[item.rental_length];
      return price + item.quantity * item.product[key];
    }, 0);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartPrice,
      currency: "gbp",
      customer: user.customer,
      payment_method_types: ["card"],
      capture_method: "manual",
    });

    ctx.send({
      clientSecret: paymentIntent.client_secret,
    });
  },

  async paymentMethods(ctx) {
    const user = ctx.state.user;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.id,
      type: "card",
    });

    ctx.send({
      paymentMethods,
    });
  },
};
