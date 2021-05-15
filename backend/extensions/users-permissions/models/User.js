"use strict";

const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

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
