/**
 * @group api
 * @group wardrobe
 */

'use strict'
const request = require('supertest')
const { grantPrivileges } = require('../helpers/strapi')

// describe('Wardrobe', () => {
//   it.todo('doesn\'t show private wardrobes to different user', () => {
//   })
// })

describe('test', () => {
  beforeAll(async () => {
    await grantPrivileges(2, [
      'permissions.application.controllers.recognition.recognitionNotificationUsers',
    ])
  })

  it('test', async () => {
    const config = strapi.services.bloomino.config
    const req = await request(strapi.server)
      .post('/notification/RecognitionNotificationUsers/authenticate')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(config.users[process.env.NODE_ENV])
    console.log(req)
  })
})
