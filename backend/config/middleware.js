module.exports = {
  settings: {
    parser: {
      enabled: true,
      includeUnparsed: true,
    },
    cors: {
      enabled: true,
      origin: [
        'http://127.0.0.1',
        'http://localhost',
        'http://ic.com',
        'http://api.ic.com',
        'http://admin.ic.com',
        'http://' + process.env.FRONTEND_DOMAIN,
        'http://' + process.env.FRONTEND_DOMAIN,
        'http://localhost:8000',
        'http://localhost:1338',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'https://' + process.env.FRONTEND_DOMAIN,
        'https://api.' + process.env.FRONTEND_DOMAIN,
        'https://admin.' + process.env.FRONTEND_DOMAIN,
      ],
    },
    body: {
      enabled: true,
      multipart: true,
    },
  },
}
