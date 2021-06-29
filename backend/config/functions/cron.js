"use strict";

// [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
module.exports = {
  "0 4 * * *": async () => {
    const orders = await strapi
      .query("order", "orders")
      .find({ status: "shipping" });
    await strapi.plugins["orders"].services.order.sendToCleaners(orders);
  },
};
