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
    provider: 'google-workspace',
    providerOptions: {
      subject: 'info@infinitecloset.co.uk',
    },
    settings: {
      from: 'Infinite Closet <info@infinitecloset.co.uk>',
      replyTo: 'Infinite Closet <info@infinitecloset.co.uk>',
      testAddress: 'info+test@infinitecloset.co.uk',
      subject: 'Infinite Closet',
    },
  },
});
