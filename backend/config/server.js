console.log('hi')
module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  proxy: true,
  admin: {
    autoOpen: false,
    auth: {
      secret: env("ADMIN_JWT_SECRET", "ec27516c3ddbb82286803e7d5308c81b"),
    },
  },
});
