const email = require('../../providers/strapi-provider-email-google-workspace/lib')

describe('Email', () => {
  it.each([
    ['test@example.com', 'test@example.com'],
    ['test@example.com', {email: 'test@example.com'}],
    ['Bob <test@example.com>', {name: 'Bob', email: 'test@example.com'}],
    [undefined, 12345],
    [undefined, undefined],
    ['Will <test1@example.com>, Bob <test2@example.com>',
      [
        {name: 'Will', email: 'test1@example.com'},
        {name: 'Bob', email: 'test2@example.com'},
      ]
    ],
  ])('Correctly parses %s', (expects, address) => {
    expect(email.normalizeAddress(address)).toBe(expects)
  })
})

describe('Email creation', () => {
  it.each([
    ['from', 'From'],
    ['replyTo', 'Reply-To'],
    ['inReplyTo', 'In-Reply-To'],
    ['messageID', 'Message-ID'],
  ])('Converts to camelCase to email standard Kebab-Case %s->%s', (js, standard) => {
    expect(email.kebabize(js)).toBe(standard)
  })

  it('Correctly formats email body', () => {
    const options = {
      to: 'test@example.com',
      from: 'test@infinitecloset.co.uk',
      html: '<h1>Hello</h1>',
    }

    const str = email.makeBody(options)
    const expects =
      `Content-Type: text/html; charset="UTF-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
To: test@example.com
From: test@infinitecloset.co.uk

<h1>Hello</h1>`

    expect(str).toBe(expects)
  })
})
