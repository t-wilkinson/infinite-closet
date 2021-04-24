module.exports = ({ env }) => ({
  email: {
    provider: "google-workspace",
    providerOptions: {
      // apiKey: env("SENDGRID_API_KEY"),
      subject: "info@infinitecloset.co.uk",
    },
    settings: {
      defaultFrom: "Infinite Closet <info@infinitecloset.co.uk>",
      defaultReplyTo: "Infinite Closet <info@infinitecloset.co.uk>",
      testAddress: "trey.wilkinson@infinitecloset.co.uk",
    },
  },
});
