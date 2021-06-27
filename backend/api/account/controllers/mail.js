"use strict";
const _ = require("lodash");

module.exports = {
  async newsletter(ctx) {
    const body = ctx.request.body;

    strapi.services.mailchimp.template("newsletter-subscription", {
      to: body.email,
    });

    await strapi.query("contact").create({
      contact: body.email,
      context: "newsletter",
      metadata: {
        email: body.email,
      },
    });

    ctx.send({ ok: true });
  },

  async waitlist(ctx) {
    const body = ctx.request.body;

    strapi.services.mailchimp.template("waitlist-subscription", {
      to: [{ name: body.name, email: body.email }],
    });

    await strapi.query("contact").create({
      contact: body.email,
      context: "waitlist",
      metadata: {
        name: body.name,
        email: body.email,
        comment: body.comment,
        subscribe: body.subscribe,
        marketing: body.marketing,
      },
    });

    ctx.send({ ok: true });
  },
};
