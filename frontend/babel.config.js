module.exports = {
  presets: [
    [
      'next/babel',
      {
        '@babel/preset-env': {
          targets: {
            browsers: ['>0.03%'],
            corejs: { version: 3, proposals: true },
          },
          useBuiltIns: 'entry',
        },
      },
    ],
  ],
  plugins: [],
}
