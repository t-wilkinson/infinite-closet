module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'http://localhost',
        'http://localhost:8000',
        'http://localhost:1337',
        'http://localhost:80',
        'http://localhost:3001',
        'http://frontend',
        'http://backend',
        'http://frontend.local',
        'http://backend.local',
        'http://ic.local',
        'http://api.ic.local',
        'http://admin.ic.local',
        'https://' + process.env.FRONTEND_DOMAIN,
        'https://api.' + process.env.FRONTEND_DOMAIN,
        'https://admin.' + process.env.FRONTEND_DOMAIN,
      ],
    },
  },
}
