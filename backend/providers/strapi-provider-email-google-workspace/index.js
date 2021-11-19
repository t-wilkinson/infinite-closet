'use strict'
const path = require('path')
const { google } = require('googleapis')
const _ = require('lodash')
const emailTemplates = require('email-templates')
const { encodeMail, makeBody, emailFields, parseEmail } = require('./lib')

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
        const raw = encodeMail(makeBody(options))
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

async function templateEmail(client, settings, options) {
  const emailOptions = {
    ..._.pick(options, emailFields),
    to: parseEmail(options.to),
    cc: parseEmail(options.cc),
    bcc: parseEmail(options.bcc),
    from: parseEmail(options.from || settings.from),
    subject: options.subject || settings.subject,
    html: await emailTemplates(options.template, options.data || {}),
  }

  return await client.send(emailOptions)
}

async function sendEmail(client, settings, options) {
  const emailOptions = {
    ..._.pick(options, emailFields),
    to: parseEmail(options.to),
    cc: parseEmail(options.cc),
    bcc: parseEmail(options.bcc),
    from: parseEmail(options.from || settings.from),
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
          return templateEmail(client, settings, options)
        } else {
          return sendEmail(client, settings, options)
        }
      },
    }
  },
}
