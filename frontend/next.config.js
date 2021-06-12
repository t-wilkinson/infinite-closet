const withPWA = require('next-pwa')
const domain = 'infinitecloset.co.uk'

module.exports = withPWA({
  typescript: {
    ignoreBuildErrors: true,
  }, 
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    // dest: 'public',
    mode: 'production',
    register: true,
    sw: '/sw.js',
  },
  i18n: {
    locales: ['en-GB', 'en-US'],
    defaultLocale: 'en-GB',
  },
  images: {
    // TODO: use domain from env var
    domains: [
      'infinitecloset.treywilkinson.com',
      'api.infinitecloset.treywilkinson.com',
      'localhost',
      'api.dev.' + domain,
      'dev.' + domain,
      'api.' + domain,
      domain,
    ],
  },
})
