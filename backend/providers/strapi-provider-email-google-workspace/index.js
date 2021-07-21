'use strict'
const path = require('path')
const { google } = require('googleapis')
const _ = require('lodash')
const emailTemplates = require('email-templates')

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ',
    to,
    '\n',
    'from: ',
    from,
    '\n',
    'subject: ',
    subject,
    '\n\n',
    message,
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
      send({ to, from, subject, html }) {
        const raw = makeBody(to, from, subject, html)
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
  if (typeof addr === 'string') {
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
    to: normalizeAddress(options.to),
    from: normalizeAddress(options.from || settings.from),
    subject: options.subject || settings.subject,
    html: await emailTemplates(options.template, options.data || {}),
  }

  return await client.send(emailOptions)
}

async function sendEmail(client, settings, options) {
  const emailOptions = {
    ..._.pick(options, emailFields),
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
