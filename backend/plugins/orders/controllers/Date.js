"use strict";

module.exports = {
  async range(ctx) {
    const query = ctx.request.query;
    const { date, length } = query;
    const range = strapi.plugins["orders"].services.date.range({
      date,
      rentalLength: length,
    });

    ctx.send({ range });
  },

  async datesValid(ctx) {
    const body = ctx.request.body;

    let validDates = {};
    for (const date of body.dates) {
      validDates[date] = strapi.plugins["orders"].services.date.valid(date);
    }

    ctx.send({ valid: validDates });
  },

  async dateValid(ctx) {
    const params = ctx.request.params;
    const isValid = strapi.plugins["orders"].services.date.valid(params.date);

    ctx.send({ valid: isValid });
  },
};
