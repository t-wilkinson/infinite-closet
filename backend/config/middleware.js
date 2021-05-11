domain = "infinitecloset.co.uk";

module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:1337",

        "https://" + domain,
        "https://api." + domain,
        "https://admin." + domain,

        "https://dev." + domain,
        "https://api.dev." + domain,
        "https://admin.dev." + domain,
      ],
    },
  },
};
