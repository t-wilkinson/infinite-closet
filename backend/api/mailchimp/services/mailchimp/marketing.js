'use strict'
const mailchimp = require('@mailchimp/mailchimp_marketing')

mailchimp.setConfig({
  apiKey: '7689fa4da0c6233b920f5b9079ee4f81-us19',
  server: 'us19', // TODO: should change this to london but I can't find any nearby (https://status.mailchimp.com/)
})

module.exports = mailchimp
