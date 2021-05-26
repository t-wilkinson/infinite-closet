const { sanitizeEntity } = require("strapi-utils");

const partitionObject = (object, predicate) =>
  Object.entries(object).reduce(
    ([left, right], item) => {
      if (predicate(item)) {
        left[item[0]] = item[1];
      } else {
        right[item[0]] = item[1];
      }
      return [left, right];
    },
    [{}, {}]
  );

module.exports = {
  // TODO: add slug of each filter to hidden string of product on update
  // lifecycle.beforeUpdate
  // add hidden field to privateAttributes
  // TODO: this is highly inefficient
  async query(ctx) {
    const [_paging, _where] = partitionObject(ctx.query, ([k, _]) =>
      ["_start", "_limit", "_sort"].includes(k)
    );
    const products = await strapi.query("product").find(ctx.query);
    const matchingProducts = await strapi.query("product").find(ctx._where);
    const count = await strapi.query("product").count(_where); // TODO: BUG: strapi overcounts relations

    const productFilters = [
      "designer",
      "fits",
      "colors",
      "occasions",
      "weather",
      "categories",
      "styles",
    ];

    const availableFilters = matchingProducts.reduce(
      (filters, product) => {
        for (const filter in filters) {
          const productFilter = product[filter];
          if (Array.isArray(productFilter)) {
            for (const item of productFilter) {
              if (!(item.slug in filters[filter])) {
                filters[filter][item.slug] = item;
              }
            }
          } else {
            // is object
            filters[filter][productFilter.slug] = productFilter;
          }
        }
        return filters;
      },
      productFilters.reduce((acc, filter) => ((acc[filter] = {}), acc), {})
    );

    ctx.send({
      products,
      count,
      filters: availableFilters,
    });
  },
};
