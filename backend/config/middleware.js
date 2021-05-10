module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:1337",

        "https://" + process.env.PRODUCTION_DOMAIN,
        "https://api." + process.env.PRODUCTION_DOMAIN,
        "https://admin." + process.env.PRODUCTION_DOMAIN,

        "https://dev." + process.env.PRODUCTION_DOMAIN,
        "https://api.dev." + process.env.PRODUCTION_DOMAIN,
        "https://admin.dev." + process.env.PRODUCTION_DOMAIN,
      ],
    },
  },
};
