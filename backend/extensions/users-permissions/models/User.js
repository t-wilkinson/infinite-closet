"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      // TODO: we can add the customer.id after creation (more time efficient)
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          user: data.id,
        },
      });

      data.customer = customer.id;
    },
  },
};
