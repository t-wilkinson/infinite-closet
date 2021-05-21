"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { generateAPI } = require("../../../api/utils");
const fetch = require("node-fetch");

// TODO: hardcode settings for now
const hived = {
  parcels: "https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels",
  postcodes: "https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes",
  key: "keyzCmMhMH9fvKBPV",
};

module.exports = {
  // TODO: probably don't need this
  ...generateAPI("order", "orders"),

  async create(ctx) {
    // TODO: make sure products are available
    const body = ctx.request.body;
    const user = ctx.state.user;

    const order = await strapi.query("order", "orders").create({
      status: "cart",
      product: body.product,
      date: body.date,
      rentalLength: body.rentalLength.toLowerCase(),
      quantity: body.quantity,
      user: user.id,
      size: body.size,
    });

    ctx.send({
      status: 200,
      order,
    });
  },

  async getCart(ctx) {
    const user = ctx.state.user;

    let cart = await strapi.query("order", "orders").find({
      user: user.id,
      status: "cart",
    },
    [ "product", "product.designer", "product.images"]);
    cart = cart.map(item => ({...item, price: strapi.plugins["orders"].services.order.calculatePrice(item)}))

    ctx.send({
      cart,
    });
  },

  async checkout(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body;

    const updates = body.cart.map((order) => {
      return strapi.query("order", "orders").update(
        {id: order.id},
        {
        address: body.address,
        paymentMethod: body.paymentMethod,
        status: "planning",
      });
    });
    const result = await Promise.allSettled(updates);
    strapi.log.info('checkout:result = %o', result)

    ctx.send({ status: 200, result});
  },

  async calculateCartPrice(ctx) {
    const user = ctx.state.user;
    const price = strapi.plugins["orders"].services.order.calculateCartPrice(
      body.cart || user.cart
    );
    ctx.send({ price });
  },

  async calculateAmount(ctx) {
    const user = ctx.state.user;
    const amount = strapi.plugins["orders"].services.order.calculateAmount(
      body.order
    );
    ctx.send({ amount });
  },

  // TODO: this method should be protected
  async ship(ctx) {
    const { order } = ctx.request.body;
    strapi.log.info("orders:ship:order %o", order);
    const { address } = order;
    const amount = await strapi.plugins["orders"].services.order.calculateAmount( order);
    const user = order.user

    stripe.paymentIntents
      .create({
        amount,
        currency: "gbp",
        customer: user.customer,
        payment_method: order.paymentMethod,
        off_session: true,
        confirm: true,
      })

      .then((paymentIntent) =>
            strapi.query("order", "orders").update(
              { id: order.id},
              { paymentIntent: paymentIntent.id, }
      ))

      /* TODO: production: uncomment
      .then(() =>
        fetch(hived.parcels, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + hived.key,
            "Content-Type": "application/json",
          },
          body: {
            // TODO: Infinite Closet info
            Collection: "Infinite Closet",
            Collection_Address_Line_1: '22 Horder Rd',
            Collection_Town: 'London',
            Collection_Postcode: 'SW6 5EE',
            Collection_Email_Address: "sarah.korich@infinitecloset.co.uk",

            Recipient: address.first_name + " " + address.last_name,
            Recipient_Address_Line_1: address.address,
            Recipient_Town: address.town,
            Recipient_Postcode: address.postcode,
            Recipient_Email_Address: user.email,
            Recipient_Phone_Number: user.phone_number,

            Shipping_Class: "One-Day",
            Sender: "Infinite Closet",
            Value_GBP: amount / 100, // 1000,
            // Sender_Chosen_Collection_Date: MM/DD/YYYY
            // Sender_Chosen_Delivery_Date: MM/DD/YYYY
          },
        })
        .then(res => res.json())
      )
      */

      .then((res) =>
        // only update status once payment and delivery are valid
            strapi.query("order", "orders").update(
              { id: order.id},
              { status: "recieving",
                shipment: res.id
              }
      ))

      .then(() => {
        // TODO: send email to user?
      })

      .catch((err) => {
        // TODO: something failed, contact user with next step to take
        if (err.error) { // stripe error
        } else {
        }
      });

    ctx.send({
      status: 200,
    });
  },

  // TODO: this method should be protected
  async complete(ctx) {
    const body = ctx.request.body;
    const {order} = body

    const res = await strapi.query("order", "orders").update(
      {id: order.id},
      {status: "completed"}
    );

    ctx.send({
      status: 200,
      order: res,
    })
  },

};
