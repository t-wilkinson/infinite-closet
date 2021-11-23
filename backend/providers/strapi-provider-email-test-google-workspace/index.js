'use strict'
const _ = require('lodash')
const emailTemplates = require('email-templates')
const {
  makeBody,
  emailFields,
  parseEmail,
} = require('../strapi-provider-email-google-workspace/lib')

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
  provider: 'test-google-workspace',
  name: 'Test Google Workspace',
  init: (providerOptions = {}, settings = {}) => {
    const client = {
      async send(options) {
        return makeBody(options)
      },
    }

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
