module.exports = {
  presets: [
    [
      'next/babel',
      {
        '@babel/preset-env': {
          targets: {
            browsers: ['>0.3%', 'not dead'],
            corejs: { version: 3, proposals: true },
          },
          useBuiltIns: 'entry',
        },
      },
    ],
  ],
  plugins: [],
}
