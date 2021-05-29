"use strict";

const models = require("../../../data/data.js").models;

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {
      for (const [filter, model] of Object.entries(models)) {
        if (filter in data) {
          const values = await strapi
            .query(model)
            .find({ id_in: data[filter] });
          const slugs = values.map((v) => v.slug).join(",");
          data[`${filter}_`] = slugs;
        }
      }
    },
  },
};
