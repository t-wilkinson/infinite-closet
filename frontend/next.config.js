const domain = 'infinitecloset.co.uk'

module.exports = {
  i18n: {
    locales: ['en-US', 'en-GB'],
    defaultLocale: 'en-GB',
  },
  images: {
    domains: [
      'localhost',
      'api.dev.' + domain,
      'dev.' + domain,
      'api.' + domain,
      domain,
    ],
  },
}
