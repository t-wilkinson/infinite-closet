"use strict";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
module.exports = {
  "0 0 * * *": async () => {
    const orders = await strapi
      .query("order", "orders")
      .find({ status: "shipping" });
    for (const order of orders) {
      const range = strapi.plugins["orders"].services.date.range(order);
      const date = dayjs(range.rentalOver).tz("Europe/London");
      const today = dayjs().tz("Europe/London");

      if (date.isSame(today, "day")) {
        strapi.log.info("cleaning order %o", order.id);
        strapi
          .query("order", "orders")
          .update({ id: order.id }, { status: "cleaning" });
        strapi.plugins["orders"].services.hived.ship(order);
      }
    }
  },
};
