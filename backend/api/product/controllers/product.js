const _ = require("lodash");
const models = require("../../../data/data.js").models;

class DefaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
                typeof defaultInit === "function"
                  ? new defaultInit().valueOf()
                  : defaultInit),
      }
    );
  }
}

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

const productFilters = [
  "designers",
  "fits",
  "colors",
  "occasions",
  "weather",
  "categories",
  "styles",
];

const toPrivate = (key) => key + "_";

const toRaw = (_where) => {
  const filterSlugs = _.pick(_where, productFilters);
  let values = [];
  let query = [];

  const addSlug = (filter, slug) => {
    if (filter === "designers") {
      values.push("designers.slug");
    } else {
      values.push(toPrivate(filter));
    }
    values.push(`%${slug}%`);
  };

  // we to form a query as follows (notice we AND category filters but OR all others):
  // (category1 AND ...) AND (color1 OR ...) AND (occasion1 OR ...) AND ...
  for (const [filter, slugs] of Object.entries(filterSlugs)) {
    // slugs is either a single string or list of strings
    if (typeof slugs === "string") {
      addSlug(filter, slugs);
      query.push("?? like ?");
    } else {
      const q = [];
      for (const slug of slugs) {
        addSlug(filter, slug);
        q.push("?? like ?");
      }
      if (filter === "categories") {
        query.push(q.join(" AND "));
      } else {
        query.push("( " + q.join(" OR ") + " )");
      }
    }
  }

  return [query.join(" AND "), values];
};

module.exports = {
  async query(ctx) {
    const query =
      process.env.NODE_ENV === "production"
        ? ctx.query
        : { ...ctx.query, ...{ _publicationState: "preview" } };

    const [_paging, _where] = partitionObject(query, ([k, _]) =>
      ["start", "limit", "sort"].includes(k)
    );

    let results;
    const knex = strapi.connections.default;

    // TODO: handle paging in SQL
    results = await knex
      .select(
        "products.*",
        knex.raw("to_json(upload_file.*) as image"),
        knex.raw("to_json(designers.*) as designer")
      )
      .rank("rank", "upload_file_morph.order", "products.id")
      .from("products")
      .join("upload_file_morph", "products.id", "upload_file_morph.related_id")
      .join("upload_file", "upload_file_morph.upload_file_id", "upload_file.id")
      .join("designers", "products.designer", "designers.id")
      .orderBy(..._paging.sort.split(":"))
      .whereRaw(...toRaw(_where));

    /* results contains many duplicate products.
     * we want to remove these duplicates
     */
    let products = [];
    let keys = {}; // maps product.id to location in `products`
    const key = (product) => keys[product.id];

    for (const product of results) {
      if (!(product.id in keys)) {
        // initialize product.id in keys
        keys[product.id] = products.length;
        products.push(product);

        // TODO: efficiency: should we query the designer here to remove querying duplicates?
        // initialize image list and product to products
        product.images = [product.image];
        delete product.image;
        products[key(product)] = product;
      } else {
        products[key(product)].images.push(product.image);
      }
    }

    // here we find all filters in products under only the category filter
    results = await knex
      .select("products.*")
      .from("products")
      .whereRaw(...toRaw({ categories: _where.categories }));

    let filterSlugs = new DefaultDict(Set);
    for (const product of results) {
      for (const filter of productFilters) {
        if (filter in models) {
          for (const slug of product[toPrivate(filter)].split(",")) {
            if (!(slug === "")) {
              filterSlugs[filter].add(slug);
            }
          }
        } else if (filter === "designers") {
          filterSlugs[filter].add(product.designer);
        } else {
          filterSlugs[filter].add(product[filter]);
        }
      }
    }

    // query for unique filters found which match _where
    // TODO: don't show filters that would result in 0 products showing up
    let filters = new DefaultDict({});
    for (const [filter, slugs] of Object.entries(filterSlugs)) {
      if (filter in models) {
        // prettier-ignore
        filters[filter] = await knex
          .select(`${filter}.*`)
          .distinct(`${filter}.id`) // TODO: is distinct the most efficient way to handle this?
          .from(filter)
          .join(`products__${filter}`, `${filter}.id`, `products__${filter}.product_id`)
          .join('products', `products__${filter}.product_id`, 'products.id')
          .whereRaw(
            Array(slugs.size).fill(`${filter}.slug = ?`).join(" OR "),
            Array.from(slugs)
          );
      } else if (filter === "designers") {
        // prettier-ignore
        filters[filter] = await knex
          .select(`${filter}.*`)
          .from(filter)
          .whereRaw(
            Array(slugs.size).fill(`${filter}.id = ?`).join(" OR "),
            Array.from(slugs)
          );
      } else {
        strapi.log.warn(
          "controllers:product:query: the query query for %s is not implemented",
          filter
        );
      }
    }

    const start = parseInt(_paging.start) || 0;
    const limit = parseInt(_paging.limit) || 20;
    const end = start + limit;

    ctx.send({
      products: products.slice(start, end),
      count: products.length,
      filters,
    });
  },
};
