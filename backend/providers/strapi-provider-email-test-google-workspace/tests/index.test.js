const email = require('../lib')

it.each([
  ['from', 'From'],
  ['replyTo', 'Reply-To'],
  ['inReplyTo', 'In-Reply-To'],
  ['messageID', 'Message-ID'],
])('maps %s->%s, the email standard fields', (js, standard) => {
  expect(email.kebabize(js)).toBe(standard)
})

it('Correctly generates email', () => {
  const options = {
    to: 'test@example.com',
    from: 'test@infinitecloset.co.uk',
    html: '<h1>Hello</h1>',
  }

  expect(email.makeBody(options)).toBe(`Content-Type: text/html; charset="UTF-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
To: test@example.com
From: test@infinitecloset.co.uk

<h1>Hello</h1>`)
})

describe('Parse email address', () => {
  it.each([
    ['test@example.com', 'test@example.com'],
    ['test@example.com', { email: 'test@example.com' }],
    ['Bob <test@example.com>', { name: 'Bob', email: 'test@example.com' }],
    [undefined, 12345],
    [undefined, undefined],
    [
      'Will <test1@example.com>, Bob <test2@example.com>',
      [
        { name: 'Will', email: 'test1@example.com' },
        { name: 'Bob', email: 'test2@example.com' },
      ],
    ],
  ])('as %s', (expects, address) => {
    expect(email.parseEmail(address)).toBe(expects)
  })
})
