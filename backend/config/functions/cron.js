"use strict";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
module.exports = {
  "0 0 0 * * *": () => {
    const orders = strapi.query("order", "orders").find({ status: "shipping" });
    for (const order of orders) {
      const range = strapi.plugins["orders"].services.order.toRange(order);
      const valid = strapi.plugins["orders"].services.order.dateValid(
        range.cleaning,
        true
      );
      if (valid) {
        strapi
          .query("order", "orders")
          .update({ id: order.id }, { status: "cleaning" });
        strapi.plugins["orders"].services.hived.ship(order);
      }
    }
  },
};
