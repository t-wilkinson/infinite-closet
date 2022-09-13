import { config } from '../api/recognition/services/bloomino.js'
import fetch from 'node-fetch'
import https from 'https'

const requestId = '23c3e310-15b2-4297-8d2a-f568d74b9135'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // TODO: potentially dangerous
})

const actions = {
  async request() {
    const req = {
      agent: httpsAgent,
      method: 'GET',
      headers: {
        XApiKey: config.apiKey,
        Accept: '*/*',
        // "Authorization": `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    }

    const res = await fetch(
      `${config.apiUrl}${config.endpoints.doRequest}/${requestId}`,
      req
    )
    console.log(res)
    console.log(res.headers)
    console.log(res.body)
    console.log(await res.text())
  },

  async authenticate() {
    let req = {
      method: 'POST',
      agent: httpsAgent,
      headers: {
        XApiKey: config.apiKey,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({login: 'infinite-closet-test', password: 'nRvdGm21ZtdvZtKpcfcb0ha6'})
    }
    let res = await fetch(
      `${config.apiUrl}${config.endpoints.authenticate}`,
      req
    )
    let body = await res.json()
    console.log(body)
    body.jwtToken
    req = {}
  },
}

async function run() {
  await actions[process.argv[2]]()
}

await run()
