// const domain = 'infinitecloset.co.uk'
const withPWA = require('next-pwa')
// const StylelintPlugin = require('stylelint-webpack-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = withPWA({
  webpack: (config, {}) => {
    config.cache = {
      type: 'filesystem',
    }

    // config.plugins.push(new ESLintPlugin({ cache: true }))
    // config.plugins.push(new StylelintPlugin({ files: '**/*.css', cache: true }))
    config.module.rules.push({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheCompression: false,
        cacheDirectory: true,
      },
    })

    return config
  },
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
    domains: [
      // 'localhost',
      // 'infinitecloset.treywilkinson.com',
      // 'api.infinitecloset.treywilkinson.com',
      // 'localhost',
      // 'api.dev.' + domain,
      // 'dev.' + domain,
      // 'api.' + domain,
      'localhost',
      process.env.NEXT_PUBLIC_FRONTEND.replace(/^\w+:\/\//, ''),
      process.env.NEXT_PUBLIC_BACKEND.replace(/^\w+:\/\//, ''),
    ],
  },
})
