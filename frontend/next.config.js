// const withPWA = require('next-pwa')
const domain = 'infinitecloset.co.uk'

// module.exports = withPWA({
//   pwa: {
//     disable: process.env.NODE_ENV === 'development',
//     // dest: 'public',
//     register: true,
//     sw: '/sw.js',
//   },
//   workbox: {
//     mode: 'production',
//   },
module.exports = {
  pwa: {
    disable: true,
  },
  i18n: {
    locales: ['en-GB', 'en-US'],
    defaultLocale: 'en-GB',
  },
  images: {
    domains: [
      'infinitecloset.treywilkinson.com',
      'api.infinitecloset.treywilkinson.com',
      'localhost',
      'api.dev.' + domain,
      'dev.' + domain,
      'api.' + domain,
      'app',
      domain,
    ],
  },
}
