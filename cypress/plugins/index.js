/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const cp = require('child_process')
const axios = require('axios')

function db(input) {
  return cp.spawnSync('./scripts/exec-psql', ['local'], {
    input: Array.isArray(input) ? input.join(';\n') : input + ';',
  })
}

console.log(process.env)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    async 'db:clear:users'() {
      await db('DELETE FROM "users-permissions_user"')
      await axios.post('http://api.ic.com/auth/local/register', {
        firstName: 'Infinite',
        lastName: 'Closet',
        email: 'info+test@infinitecloset.co.uk',
        password: 'asdfasdf!',
        subscribed: false,
      })
      return null
    },
  })
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}
