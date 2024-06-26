const watchIgnoreFiles = ['**/*.md', '**/__tests__/**', '**/tests/**']

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
  url: env.bool('LOCAL')
    ? `http://${env('BACKEND_DOMAIN')}`
    : `https://${env('BACKEND_DOMAIN', 'api.infinitecloset.co.uk')}`,
  admin: {
    host: env('HOST', '0.0.0.0'),
    autoOpen: false,
    url: '/admin',
    watchIgnoreFiles,
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
  watchIgnoreFiles,
})
