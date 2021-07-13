module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'https://' + process.env.FRONTEND_DOMAIN,
        'https://api.' + process.env.FRONTEND_DOMAIN,
        'https://admin.' + process.env.FRONTEND_DOMAIN,
      ],
    },
  },
}
