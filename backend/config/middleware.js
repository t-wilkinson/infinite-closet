domain = "infinitecloset.co.uk";

module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:1337",

        "http://localhost:3001",
        "http://localhost:1338",
        "http://localhost:8000",

        "https://" + domain,
        "https://api." + domain,
        "https://admin." + domain,

        "https://dev." + domain,
        "https://api.dev." + domain,
        "https://admin.dev." + domain,

        "http://api.infinitecloset.treywilkinson.com",
        "http://infinitecloset.treywilkinson.com",
      ],
    },
  },
};
