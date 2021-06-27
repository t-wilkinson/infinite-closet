module.exports = ({ env }) => ({
  cron: {
    enabled: true,
  },
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  proxy: true,
  url: `https://api.${process.env.FRONTEND_DOMAIN}`,
  admin: {
    host: env("HOST", "0.0.0.0"),
    autoOpen: false,
    url: "/admin",
    auth: {
      secret: env("ADMIN_JWT_SECRET", "ec27516c3ddbb82286803e7d5308c81b"),
    },
  },
});
