"use strict";

const stripe = require("stripe")(
  "sk_test_51Ikb9lDnNgAk4A84a08Vrtj9h0K7Zg6C3HLSEhbZXRkC2E3wX2y9JDo67TOZI8spmVj4nvaHSamVwiKUokS9Kg5S00whW8RV3K"
);

// TODO: should move this to order plugin
module.exports = {
  async find(...props) {
    console.log(props);
  },
  // find: strapi.query("order", "orders").find,

  async create(ctx) {
    // TODO: make sure products are available
    console.log("creating order");
    const body = ctx.request.body;
    const user = ctx.state.user;

    // each cart item should have rental length. calculate the shipping and recieving date
    // shippingDate: body.date, // TODO: calculate correct date
    // recieveDate: body.date,
    const order = await strapi.query("order", "orders").create({
      paymentMethod: body.intent.id,
      cart: body.cart,
      shippingClass: body.shippingClass,
      address: body.address,
    });

    await strapi.query("user", "users-permissions").update(
      { id: user.id },
      {
        orders: [...user.orders, order.id], // add order to users existing orders
        cart: user.cart.filter((item) => !body.cart.includes(item.id)), // remove items from cart
      }
    );

    ctx.send({
      status: 200,
    });
  },

  async calculatePrice(ctx) {
    const user = ctx.state.user;
    const price = await strapi.plugins["orders"].services.calculatePrice(
      body.cart || user.cart
    );
    ctx.send({ price });
  },

  async ship(ctx) {
    const { order } = ctx.request.body;
    const user = await strapi
      .query("user", "users-permissions")
      .find({ id: order.user });
    const price = await strapi.plugins["orders"].services.calculatePrice(
      body.cart || user.cart
    );

    stripe.paymentIntents
      .create({
        amount: price,
        currency: "gbp",
        customer: user.customer,
        payment_method: order.paymentMethod,
        off_session: true,
        confirm: true,
      })
      .then((paymentIntent) => {
        // TODO: make a shipping request
      })
      .then(() => {
        // TODO: update status of order
      })
      .catch((err) => {
        // TODO: contact user with next step to take
      });

    ctx.send({
      status: 200,
    });
  },
};

/*
 * Hived API
 *

const shippingClass = {
  one_day: "One-Day",
  two_day: "2-Day",
  next_day: "Next-Day",
};

fetch(plugin.hived.api, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + plugin.hived.key,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  }),

fields: {
  Recipient: address.first_name + address.last_name,
  Recipient_Address_Line_1: address.address,
  Recipient_Town: address.town,
  Recipient_Postcode: address.postcode,
  Sender: plugin.hived.sender,
  Value_GBP: order.payment_intent_json.amount,
  Recipient_Email_Address: user.email,
  Recipient_Phone_Number: user.phone_number,
  Shipping_Class: shippingClass[order.shipping_class],
},

React.useEffect(() => {
  if (order.status === "shipping" && order.shipping && !order.shipping_json) {
    fetch(plugin.hived.api, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + plugin.hived.key,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        order.shipping_json = res;
      });
  }
}, [order.status]);

return Promise.all(
  res.map((order) =>
    fetch(
      plugin.stripe.api + "/payment_intents/" + order.payment_intent,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + plugin.stripe.key,
        },
      }
    )
      .then((res) => res.json())
      .catch(() => null)
  )
);

.then((payment_intents) => {
setOrders((orders) =>
  orders.map((order, i) => {
    if (payment_intents[i]) {
      return {
        ...order,
        // TODO: there is probably a better solution
        payment_intent_json: payment_intents[i],
      };
    } else {
      return order;
    }
  })
);

*/
