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

module.exports = {
  async createPaymentIntent(ctx) {
    const body = ctx.request.body;
    const user = ctx.state.user;
    const cartIds = body.cart;
    const cartItems = await strapi
      .query("cart-item")
      .find({ id_in: body.cart }, ["product"]);

    const itemPrice = (item) => {
      const itemPrice = item.product[rentalPrice[item.rentalLength]];
      // stripe expects an integer price in smallest unit of currency
      return item.quantity * itemPrice * 100;
    };

    let cartPrice = cartItems.reduce(
      (price, item) => price + itemPrice(item),
      0
    );
    if (process.env.NODE_ENV === 'development' && cartPrice === 0) { cartPrice = 2000 }

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "gbp",
      payment_method_types: ["card"],
      setup_future_usage: "off_session",
      amount: cartPrice,
      customer: user.customer,
      payment_method: body.paymentMethod,
    });

    ctx.send({
      status: 200,
      paymentIntent,
    });
  },

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
};
