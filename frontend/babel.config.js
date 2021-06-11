module.exports = {
  moduleIds: true,
  getModuleId: (name) => name.replace('@/', 'src/'),
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  // plugins: [
  //   [
  //     'module-resolver',
  //     {
  //       extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs'],
  //       alias: {
  //         '^@/([A-Z].*)': 'src/components/\\1',
  //         '^@/(.*)': 'src/\\1',
  //       },
  //     },
  //   ],
  // ],
}
