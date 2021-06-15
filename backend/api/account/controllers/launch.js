"use strict";

const stripe = require("stripe")(process.env.STRIPE_KEY);

const SMALLEST_CURRENCY_UNIT = 100;
const TICKET_PRICE = 25;
const PROMO_DISCOUNT = 25;
const PROMO_CODE = "ICGYBGUEST";

// https://stripe.com/docs/payments/accept-a-payment-synchronously
module.exports = {
  async promo(ctx) {
    const code = ctx.query.code;
    console.log(code);
    console.log(code === PROMO_CODE || code === "GIVEYOURBEST");
    ctx.send(code === PROMO_CODE || code === "GIVEYOURBEST");
  },

  async join(ctx) {
    const body = ctx.request.body;
    const discount =
      body.promoCode === "GIVEYOURBEST"
        ? 5
        : body.promoCode === PROMO_CODE
        ? PROMO_DISCOUNT
        : 0;
    const donationPrice = body.donation + TICKET_PRICE - discount;
    const donationAmount = donationPrice.toFixed(2) * SMALLEST_CURRENCY_UNIT;

    try {
      let intent;
      if (body.paymentMethod) {
        intent = await stripe.paymentIntents.create({
          payment_method: body.paymentMethod,
          amount: donationAmount,
          currency: "gbp",
          confirm: true,
          confirmation_method: "manual",
        });
      } else if (body.paymentIntent) {
        intent = await stripe.paymentIntents.confirm(body.paymentIntent);
      }

      if (intent.success) {
        // TODO: send email to user
        // TODO: send email/add to database
      }

      return ctx.send(generateResponse(intent));
    } catch (e) {
      return ctx.send({ error: "Could not process payment" });
    }
  },
};

const generateResponse = (intent) => {
  if (
    intent.status === "requires_action" &&
    intent.next_action.type === "use_stripe_sdk"
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    };
  } else if (intent.status === "succeeded") {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    };
  } else {
    // Invalid status
    return {
      error: "Invalid PaymentIntent status",
    };
  }
};
