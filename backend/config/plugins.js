module.exports = ({ env }) => ({
  upload: {
    breakpoints: {
      xlarge: 1920,
      large: 1000,
      medium: 750,
      small: 500,
      xsmall: 64,
    },
  },
  email: {
    provider: "google-workspace",
    providerOptions: {
      // apiKey: env("SENDGRID_API_KEY"),
      subject: "info@infinitecloset.co.uk",
    },
    settings: {
      defaultFrom: "Infinite Closet <info@infinitecloset.co.uk>",
      defaultReplyTo: "Infinite Closet <info@infinitecloset.co.uk>",
      testAddress: "info+test@infinitecloset.co.uk",
    },
  },
});
