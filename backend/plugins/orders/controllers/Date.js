'use strict';

module.exports = {
  async range(ctx) {
    const body = ctx.request.body;
    const range = strapi.plugins['orders'].services.date.range(body);
    ctx.send({ range });
  },

  async datesValid(ctx) {
    const body = ctx.request.body;

    let validDates = {};
    for (const date of body.dates) {
      validDates[date] = strapi.plugins['orders'].services.date.valid(
        date,
        body.quantity
      );
    }

    ctx.send({ valid: validDates });
  },
};
