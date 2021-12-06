/**
 * Accept multiple formats for email address
 */
function parseEmail(addr) {
  const toDev = (email) => {
    const res = email !== 'info@infinitecloset.co.uk'
      ? email
      : process.env.NODE_ENV === 'production'
      ? email
      : 'info+test@infinitecloset.co.uk'
    return res
  }

  switch (Object.prototype.toString.call(addr)) {
    case '[object Array]':
      addr = addr.map(parseEmail).filter((v) => v)
      if (addr.length === 0) {
        return undefined
      }
      return addr.join(', ')
    case '[object String]':
      return toDev(addr)
    case '[object Object]':
      if (addr.email && addr.name) {
        return `${addr.name} <${toDev(addr.email)}>`
      }
      return addr.email
    default:
      return undefined
  }
}

const emailFields = [
  'from',
  'replyTo',
  'to',
  'cc',
  'bcc',
  'subject',
  'text',
  'html',
  'attachments',
]

const kebabize = (str) => {
  str = str.replace(/([A-Z]+)/g, '-$1')
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function makeBody(options) {
  const toEmailField = (f) =>
    options[f] ? `${kebabize(f)}: ${options[f]}\n` : ''

  var str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    ...['to', 'from', 'replyTo', 'cc', 'bcc', 'subject'].map(toEmailField),
    '\n',
    options.html,
  ].join('')

  return str
}

function encodeMail(str) {
  var encodedMail = Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return encodedMail
}

module.exports = {
  encodeMail,
  kebabize,
  parseEmail,
  emailFields,
  makeBody,
}
