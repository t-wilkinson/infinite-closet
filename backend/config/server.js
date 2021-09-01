module.exports = ({ env }) => ({
  cron: {
    enabled: true,
  },
  gzip: {
    enabled: true,
    options: {
      br: false,
    },
  },
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  proxy: true,
  url:
    process.env.NODE_ENV === 'production'
      ? `https://${env('BACKEND_DOMAIN', 'api.infinitecloset.co.uk')}`
      : `http://${env('BACKEND_DOMAIN', 'api.infinitecloset.co.uk')}`,
  admin: {
    host: env('HOST', '0.0.0.0'),
    autoOpen: false,
    url: '/admin',
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'ec27516c3ddbb82286803e7d5308c81b'),
    },
  },
  watchIgnoreFiles: ['**/tests/**'],
})
