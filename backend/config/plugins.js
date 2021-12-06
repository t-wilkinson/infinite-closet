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
      from: {name: 'Infinite Closet', email: 'info@infinitecloset.co.uk'},
      replyTo: {name: 'Infinite Closet', email: 'info@infinitecloset.co.uk'},
      testAddress: {name: 'Infinite Closet', email: 'info+test@infinitecloset.co.uk'},
      subject: 'Infinite Closet',
    },
  },
})
