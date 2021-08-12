'use strict'
const path = require('path')
const { google } = require('googleapis')
const _ = require('lodash')
const emailTemplates = require('email-templates')

const kebabize = (str) => {
  str = str.replace(/([A-Z])/g, '$1')
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

  var encodedMail = Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return encodedMail
}

const gmail = {
  init(options) {
    const JWT = google.auth.JWT
    const authClient = new JWT({
      keyFile: path.resolve(__dirname, 'credentials.json'),
      scopes: [
        'https://mail.google.com',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      subject: options.subject,
    })
    authClient.authorize()

    return {
      auth: authClient,
      send(options) {
        const raw = makeBody(options)
        const gmail = google.gmail({ version: 'v1', auth: this.auth })

        return gmail.users.messages
          .send({
            auth: this.auth,
            userId: 'me',
            resource: { raw },
          })
          .catch((err) => console.error(err))
      },
    }
  },
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

function normalizeAddress(addr) {
  if (!addr) {
    return undefined
  } else if (typeof addr === 'string') {
    return addr
  } else {
    if (addr.email && addr.name) {
      return `${addr.name} <${addr.email}>`
    } else {
      return addr.email
    }
  }
}

async function templateEmail(client, settings, options) {
  const emailOptions = {
    ..._.pick(options, emailFields),
    to: normalizeAddress(options.to),
    cc: normalizeAddress(options.cc),
    bcc: normalizeAddress(options.bcc),
    from: normalizeAddress(options.from || settings.from),
    subject: options.subject || settings.subject,
    html: await emailTemplates(options.template, options.data || {}),
  }

  return await client.send(emailOptions)
}

async function sendEmail(client, settings, options) {
  const emailOptions = {
    ..._.pick(options, emailFields),
    to: normalizeAddress(options.to),
    cc: normalizeAddress(options.cc),
    bcc: normalizeAddress(options.bcc),
    from: options.from || settings.from,
    replyTo: options.replyTo || settings.replyTo,
    html: options.html || options.text,
  }
  return await client.send(emailOptions)
}

module.exports = {
  provider: 'google-workspace',
  name: 'Google Workspace',
  init: (providerOptions = {}, settings = {}) => {
    const client = gmail.init(providerOptions)

    return {
      send(options) {
        if (options.template) {
          templateEmail(client, settings, options)
        } else {
          sendEmail(client, settings, options)
        }
      },
    }
  },
}
