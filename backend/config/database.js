module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 54321),
        database: env("DATABASE_NAME", "infinite-closet-dev"),
        username: env("DATABASE_USERNAME", "test"),
        password: env("DATABASE_PASSWORD", "test"),
        ssl: env.bool("DATABASE_SSL", false),
      },
      options: {},
    },
  },
});
