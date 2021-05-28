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
    const query =
      process.env.NODE_ENV === "production"
        ? ctx.query
        : { ...ctx.query, ...{ _publicationState: "preview" } };

    const [_paging, _where] = partitionObject(query, ([k, _]) =>
      ["_start", "_limit", "_sort"].includes(k)
    );
    let products;

    // TODO: how do we AND filter all categories
    // TODO: write a custom query

    console.log(query);
    // const products = await strapi.query("product").find({
    //   _start: "1",
    //   _limit: "12",
    //   _where: [
    //     { "categories.slug": "jumpsuit" },
    //     { "categories.slug": "clothing" },
    //   ],
    // });

    const knex = strapi.connections.default;
    products = await knex("products")
      .where("products.hiddenCategories", "like", "%clothing%")
      .andWhere("products.hiddenCategories", "like", "%jumpsuit%");
    // .whereNot("cities.published_at", null)
    // .join("chefs", "restaurants.id", "chefs.restaurant_id")
    // .select("restaurants.name as restaurant")

    console.log(products);

    products = await strapi.query("product").find(query);
    const allMatchingProducts = await strapi.query("product").find(ctx._where);
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

    const availableFilters = allMatchingProducts.reduce(
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
