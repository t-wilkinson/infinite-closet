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
  "sizes",
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

async function queryProducts(knex, _where, _paging) {
  // TODO: handle paging in SQL
  const sort = `products.${_paging.sort.replace(":", " ")}`;
  const results = await knex
    .select("products.id as id")
    .from("products")
    .join("designers", "products.designer", "designers.id")
    .orderByRaw(sort)
    .whereNotNull("products.published_at")
    .whereRaw(...toRaw(_where));

  const products = await Promise.all(
    results.map(({ id }) =>
      strapi.query("product").findOne({ id }, ["designer", "images", "sizes"])
    )
  );
  return products;
}

async function queryFilters(knex, _where) {
  // here we find all filters in products under only the category filter
  const results = await knex
    .select("products.*")
    .from("products")
    .whereNotNull("products.published_at")
    .whereRaw(...toRaw({ categories: _where.categories }));

  /* TODO: don't show filters that would result in 0 products showing up
   * for each filter, show slugs that would match at least one product, given all the other filters
   * product holds the key information to solve this
   * how do we structure filter relations to ensure this?
   */
  let filterSlugs = new DefaultDict(Set);
  for (const product of results) {
    for (const filter of productFilters) {
      if (filter in models) {
        const slugs = product[toPrivate(filter)];
        if (!slugs) {
          continue;
        }
        for (const slug of slugs.split(",")) {
          filterSlugs[filter].add(slug);
        }
      } else if (filter === "designers") {
        filterSlugs[filter].add(product.designer);
      } else {
        filterSlugs[filter].add(product[filter]);
      }
    }
  }

  // slugs contain only filters that match product categories
  // get all filters that match these slugs
  let filters = new DefaultDict({});
  for (const [filter, slugs] of Object.entries(filterSlugs)) {
    if (filter in models) {
      if (filter === "sizes") {
        // prettier-ignore
        let sizes = await knex
          .select(`components_custom_sizes.* as sizes`)
          .from("components_custom_sizes")
          .distinctOn("components_custom_sizes.size")
          .whereRaw(
            Array(slugs.size).fill(`components_custom_sizes.size = ?`).join(" OR "),
            Array.from(slugs)
          );

        sizes = sizes.reduce((acc, size) => {
          if (size.sizeRange) {
            for (const value of strapi.services.size.range(size)) {
              acc.add(value);
            }
          } else {
            acc.add(size.size);
          }
          return acc;
        }, new Set());
        sizes = Array.from(sizes).map(strapi.services.size.normalize);
        filters[filter] = sizes;
      } else {
        filters[filter] = await knex
          .select(`${filter}.*`)
          .distinct(`${filter}.id`)
          .from(filter)
          .whereRaw(
            Array(slugs.size).fill(`${filter}.slug = ?`).join(" OR "),
            Array.from(slugs)
          );
      }
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

  return filters;
}

async function queryCategories(query) {
  const queryCategories =
    typeof query.categories === "string"
      ? [query.categories]
      : query.categories;
  const unorderedCategories = await strapi.query("category").find({
    slug_in: query.categories,
  });
  let categories = [];
  for (const slug of queryCategories) {
    category: for (const category of unorderedCategories) {
      if (slug === category.slug) {
        categories.push(category);
        break category;
      }
    }
  }
  return categories;
}

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 20;

module.exports = {
  // TODO: there are plenty of ways to speed this up *when* it bottlenecks
  async query(ctx) {
    const query = ctx.query;

    const [_paging, _where] = partitionObject(query, ([k, _]) =>
      ["start", "limit", "sort"].includes(k)
    );

    // TODO: can be sped up by a lot. use the results of `queryProducts` for the other two
    const knex = strapi.connections.default;
    const [products, filters, categories] = await Promise.all([
      queryProducts(knex, _where, _paging),
      queryFilters(knex, _where),
      queryCategories(query),
    ]);

    const start = parseInt(_paging.start) || DEFAULT_PAGE;
    const limit = parseInt(_paging.limit) || DEFAULT_PAGE_SIZE;
    const end = start + limit;

    ctx.send({
      products: products.slice(start, end),
      count: products.length,
      filters,
      categories,
    });
  },

  async routes(ctx) {
    const categories = await strapi.query("category").find({
      slug_in: ["clothing"],
    });

    let routes = {};
    for (const category of categories) {
      routes[category.slug] = category;
    }

    const occasions = await strapi.query("occasion").find({});

    ctx.send({
      routes,
      occasions,
    });
  },

  async shopItem(ctx) {
    const slug = ctx.params.slug;
    const product = await strapi.query("product").findOne({ slug });
    ctx.send(product);
  },

  async sizeChart(ctx) {
    let sizeChart = await strapi.query("size-chart").find();
    sizeChart = sizeChart.map((chart) =>
      Object.entries(chart).reduce((acc, [k, v]) => {
        acc[strapi.services.size.normalize(k)] = v;
        return acc;
      }, {})
    );

    const sizeEnum = strapi.services.size
      .enum()
      .map(strapi.services.size.normalize);

    ctx.send({
      chart: sizeChart,
      sizeEnum,
      measurements: ["hips", "waist", "bust"],
    });
  },
};
