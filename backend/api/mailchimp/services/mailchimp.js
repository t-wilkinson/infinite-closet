'use strict'

const mailchimp = require('@mailchimp/mailchimp_transactional')(
  process.env.MAILCHIMP_TOKEN
)
const emailTemplates = require('email-templates')

module.exports = mailchimp

const default_message = {
  merge_language: 'handlebars',
  from_email: 'info@infinitecloset.co.uk',
  from_name: 'Infinite Closet',
  subject: 'Infinite Closet',
  inline_css: true,
}

// message.to expects [{email, name, type}], not [email]
const normalizeTo = (to) => {
  const res = []
  if (typeof to === 'string') {
    res.push({ email: to })
  } else {
    for (const email in to) {
      if (typeof email === 'string') {
        res.push({ email })
      } else {
        res.push(email)
      }
    }
  }
  return res
}

const normalizeVars = (merge_vars) => {
  if (Array.isArray(merge_vars)) {
    return merge_vars
  } else {
    return Object.entries(merge_vars).map(([k, v]) => ({
      name: k,
      content: v,
    }))
  }
}

const normalizeMessage = (message) => {
  let msg = { ...default_message, ...message }

  msg.to = normalizeTo(message.to)
  if ('global_merge_vars' in message) {
    msg.global_merge_vars = normalizeVars(message.global_merge_vars)
  }
  return msg
}

module.exports = {
  async send(message) {
    return await mailchimp.messages.send({
      message: normalizeMessage(message),
    })
  },

  async template(template_name, message) {
    return await mailchimp.messages.sendTemplate({
      template_name,
      template_content: [],
      message: normalizeMessage(message),
    })
  },
}
