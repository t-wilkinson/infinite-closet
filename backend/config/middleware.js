domain = "infinitecloset.co.uk";

module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://0.0.0.0:3000",
        "http://0.0.0.0:1337",
        "http://0.0.0.0:8000",

        "http://localhost:3000",
        "http://localhost:1337",

        "http://localhost:3001",
        "http://localhost:1338",
        "http://localhost:8000",

        "https://localhost",

        "https://" + domain,
        "https://api." + domain,
        "https://admin." + domain,

        "https://dev." + domain,
        "https://api.dev." + domain,
        "https://admin.dev." + domain,

        `https://api.${process.env.FRONTEND_DOMAIN}`,
        `https://admin.${process.env.FRONTEND_DOMAIN}`,
        `https://${process.env.FRONTEND_DOMAIN}`,
      ],
    },
  },
};
