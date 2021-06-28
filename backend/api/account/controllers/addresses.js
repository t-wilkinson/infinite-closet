"use strict";

module.exports = {
  async verify(ctx) {
    const { postcode } = ctx.params;
    const valid = await strapi.plugins["orders"].services.hived.verify(
      postcode
    );
    ctx.send({
      valid,
    });
  },
};
