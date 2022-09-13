"use strict"
const fetch = require('node-fetch')
const https = require('https')

const config = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // TODO: potentially dangerous
  }),
  apiKey: "d43706bd0f19596c75d3a9eea472477d",
  apiUrl: 'https://bloomino.co.uk',
  endpoints: {
    authenticate: "/notification/RecognitionNotificationUsers/authenticate",
    doRecognition: "/api/RecognitionService/doRecognitionWithApiKey",
    doRequest: "/api/RecognitionService",
  },
  users: {
    production: {
      login: 'infinite-closet',
      password: '9yH6D6NGnBp0ECHhU03vSRqJ',
    },
    development: {
      login: 'infinite-closet-testing',
      password: 'nRvdGm21ZtdvZtKpcfcb0ha6',
    },
    bloomino: {
      login: 'bloomino-notifier',
      password: 'blo549.pwduu',
    }
  }
}

module.exports = {
  config,
  async authenticate() {
    let req = {
      method: 'POST',
      agent: config.httpsAgent,
      headers: {
        // XApiKey: config.apiKey,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config.users.bloomino)
    }
    const res = await fetch(`${config.apiUrl}${config.endpoints.authenticate}`, req)
    const body = await res.json()
    return body.jwtToken
  }
}
