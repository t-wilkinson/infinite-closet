const domain = 'infinitecloset.co.uk'
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withPWA = require('next-pwa')
// const withImages = require('next-images')

// const StylelintPlugin = require('stylelint-webpack-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = withPlugins([withPWA, [withBundleAnalyzer]], {
  webpack: (config, {}) => {
    config.cache = {
      type: 'filesystem',
    }

    // config.plugins.push(new StylelintPlugin({ files: '**/*.css', cache: true }))
    // config.plugins.push(new ESLintPlugin({ cache: true }))
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
    disable: process.env.NODE_ENV !== 'production',
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
    minimumCacheTTL: 60 * 60,
    deviceSizes: [1024, 1920, 2048, 3840],
    domains: [
      'ic.com',
      'api.ic.com',
      'admin.ic.com',
      'dev.' + domain,
      'api.dev.' + domain,
      domain,
      'api.' + domain,
    ],
  },
})
