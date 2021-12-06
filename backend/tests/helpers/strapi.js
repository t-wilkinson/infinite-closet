'use strict'
const Strapi = require('strapi')
const http = require('http')
const request = require('supertest')

let instance
jest.setTimeout(15000)

/**
 * Setups strapi for futher testing
 */
async function setupStrapi() {
  if (!instance) {
    /** the follwing code in copied from `./node_modules/strapi/lib/Strapi.js` */
    await Strapi().load()
    instance = strapi // strapi is global now
    await instance.app
      .use(instance.router.routes()) // populate KOA routes
      .use(instance.router.allowedMethods()) // populate KOA methods

    instance.server = http.createServer(instance.app.callback())
  }
  return instance
}

/**
 * Returns valid JWT token for authenticated
 * @param {String | number} idOrEmail, either user id, or email
 */
const jwt = async (idOrEmail) =>
  strapi.plugins['users-permissions'].services.jwt.issue({
    [Number.isInteger(idOrEmail) ? 'id' : 'email']: idOrEmail,
  })

/**
 * Grants database `permissions` table that role can access an endpoint/controllers
 *
 * @param {int} roleID, 1 Autentihected, 2 Public, etc
 * @param {string} value, in form or dot string eg `"permissions.users-permissions.controllers.auth.changepassword"`
 * @param {boolean} enabled, default true
 * @param {string} policy, default ''
 */
const grantPrivilege = async (
  roleID = 1,
  value,
  enabled = true,
  policy = ''
) => {
  const updateObj = value
    .split('.')
    .reduceRight((obj, next) => ({ [next]: obj }), { enabled, policy })

  return await strapi.plugins[
    'users-permissions'
  ].services.userspermissions.updateRole(roleID, updateObj)
}

/** Updates database `permissions` that role can access an endpoint
 * @see grantPrivilege
 */

const grantPrivileges = async (roleID = 1, values = []) => {
  await Promise.all(values.map((val) => grantPrivilege(roleID, val)))
}

/**
 * Updates the core of strapi
 * @param {*} pluginName
 * @param {*} key
 * @param {*} newValues
 * @param {*} environment
 */
const updatePluginStore = async (
  pluginName,
  key,
  newValues,
  environment = ''
) => {
  const pluginStore = strapi.store({
    environment: environment,
    type: 'plugin',
    name: pluginName,
  })

  const oldValues = await pluginStore.get({ key })
  const newValue = Object.assign({}, oldValues, newValues)

  return pluginStore.set({ key: key, value: newValue })
}

/**
 * Get plugin settings from store
 * @param {*} pluginName
 * @param {*} key
 * @param {*} environment
 */
const getPluginStore = (pluginName, key, environment = '') => {
  const pluginStore = strapi.store({
    environment: environment,
    type: 'plugin',
    name: pluginName,
  })

  return pluginStore.get({ key })
}

/**
 * Check if response error contains error with given ID
 * @param {string} errorId ID of given error
 * @param {object} response Response object from strapi controller
 * @example
 *
 * const response =  {"statusCode":400,"error":"Bad Request","message":[{"messages":[{"id":"Auth.form.error.confirmed","message":"Your account email is not confirmed"}]}],"data":[{"messages":[{"id":"Auth.form.error.confirmed","message":"Your account email is not confirmed"}]}]}
 * responseHasError("Auth.form.error.confirmed", response) // true
 */
const responseHasError = (errorId, response) => {
  if (
    response &&
    response.message &&
    Array.isArray(response.message) &&
    response.message.find(
      (entry) =>
        entry.messages &&
        Array.isArray(entry.messages) &&
        entry.messages.find((msg) => msg.id && msg.id === errorId)
    )
  ) {
    return true
  }
  return false
}

function parseCookies(req) {
  var cookies = req.get('Set-Cookie')
  if (!cookies) {
    return {}
  }

  return cookies.reduce((obj, c) => {
    var n = c.split('=')
    obj[n[0].trim()] = n[1].split('; ')[0].trim()
    return obj
  }, {})
}

function requestMethod(url, method) {
  let req = request(strapi.server)
  switch (method) {
    case 'POST':
      req = req.post(url)
      break
    case 'GET':
      req = req.get(url)
      break
    case 'PUT':
      req = req.put(url)
      break
    case 'DELETE':
      req = req.delete(url)
      break
  }
  return req
}

function jsonRequest(url, { body, method = 'POST' }) {
  return requestMethod(url, method)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(body)
    .expect('Content-Type', /json/)
}

function jsonRequestAuth(url, { body, user, method = 'POST' }) {
  const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
    id: user.id,
  })

  return requestMethod(url, method)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + jwt)
    .send(body)
    .expect('Content-Type', /json/)
}

module.exports = {
  setupStrapi,
  jwt,
  grantPrivilege,
  grantPrivileges,
  updatePluginStore,
  getPluginStore,
  responseHasError,
  parseCookies,
  jsonRequest,
  jsonRequestAuth,
}
