"use strict";

/*
 * It is critical to compute some values for stripe on the backend (ex: payment amount).
 * Here we wrap stripe requests with our defaults where possible.
 */

const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

const rentalPrice = {
  short: "shortRentalPrice",
  long: "longRentalPrice",
};

const amountToCapture = (intent) => {
  // TODO:
  // Find corresponding order.
  // Remove from amount any un-fulfilled orders
  return intent.amount;
};

module.exports = {
  async createPaymentIntent(ctx) {
    const user = ctx.state.user;
    const cartIds = user.cart.map((item) => item.id);
    const cart = await strapi
      .query("cart-item")
      .find({ id_in: cartIds }, ["product"]);

    const itemPrice = (item) => {
      const itemPrice = item.product[rentalPrice[item.rentalLength]];
      // stripe expects an integer price in smallest unit of currency
      return item.quantity * itemPrice * 100;
    };

    const cartPrice = cart.reduce((price, item) => price + itemPrice(item), 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartPrice,
      currency: "gbp",
      customer: user.customer,
      payment_method_types: ["card"],
      capture_method: "manual",
      metadata: {
        user: user.id,
      },
    });

    ctx.send({
      clientSecret: paymentIntent.client_secret,
    });
  },

  async capturePaymentIntent(ctx) {
    const { id } = ctx.params;

    const intent = await stripe.paymentIntents.capture(id, {
      amount_to_capture: amountToCapture(intent),
    });

    ctx.send({
      status: 200,
    });
  },

  async paymentMethods(ctx) {
    const user = ctx.state.user;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.customer,
      type: "card",
    });

    ctx.send({
      paymentMethods,
    });
  },
};
