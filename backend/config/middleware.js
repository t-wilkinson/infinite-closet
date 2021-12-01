module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'http://127.0.0.1',
        'http://localhost',
        'http://ic.com',
        'http://api.ic.com',
        'http://admin.ic.com',
        'https://' + process.env.FRONTEND_DOMAIN,
        'https://api.' + process.env.FRONTEND_DOMAIN,
        'https://admin.' + process.env.FRONTEND_DOMAIN,
      ],
    },
    body: {
      enabled: true,
      multipart: true,
    }
  },
}
