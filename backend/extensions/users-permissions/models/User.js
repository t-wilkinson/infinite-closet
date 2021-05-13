"use strict";

const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          id: data.id,
          username: data.username,
        },
      });

      data.customer = customer.id;
    },
  },
};
