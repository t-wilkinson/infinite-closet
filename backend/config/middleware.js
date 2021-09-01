module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'http://localhost',
        'http://frontend',
        'http://backend',
        'https://' + process.env.FRONTEND_DOMAIN,
        'https://api.' + process.env.FRONTEND_DOMAIN,
        'https://admin.' + process.env.FRONTEND_DOMAIN,
      ],
    },
  },
}
