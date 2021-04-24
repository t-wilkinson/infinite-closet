"use strict";

/**
 * A set of functions called "actions" for `test`
 */

module.exports = {
  run: async (ctx, next) => {
    strapi.plugins["email"].services.email
      .send({
        to: "trey.wilkinson@infinitecloset.co.uk",
        subject: "Hello",
        html: "<h1>Hi</h1>",
      })
      .catch(() => {});

    try {
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
};
