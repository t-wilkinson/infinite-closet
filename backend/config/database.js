module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'db'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'infinite-closet-dev'),
        username: env('DATABASE_USERNAME', 'test'),
        password: env('DATABASE_PASSWORD', 'test'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {},
    },
  },
})
