module.exports = ({ env }) => {
  return {
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
      provider: 'test-google-workspace',
      providerOptions: {
        subject: 'info+test@infinitecloset.co.uk',
      },
      settings: {
        from: 'Infinite Closet Test <info+test@infinitecloset.co.uk>',
        replyTo: 'Infinite Closet Test <info+test@infinitecloset.co.uk>',
        testAddress: 'info+test@infinitecloset.co.uk',
        subject: 'Infinite Closet',
      },
    },
  }
}

