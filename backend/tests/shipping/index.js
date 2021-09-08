// const request = require('supertest')
// const { createOrder } = require('../orders/factory')
// const { createUser } = require('../user/factory')
// const { jwt } = require('./../helpers/strapi')

require('./timing')
it.todo('Cleaning')

// describe('Shipping service', () => {
//   let order
//   let user

//   beforeAll(async () => {
//     user = await createUser(strapi)
//     //   beforeAll(async (done) => {
//     //     user = await userFactory.createUser(strapi)
//     //     await grantPrivilege(1, 'permissions.application.controllers.hello.hi') // 1 is default role for new confirmed users
//     //     done()
//     //   })
//     order = await createOrder(strapi, {
//       startDate: new Date().toJSON(),
//     })
//   })

//   it('ships order', async () => {
//     const token = await jwt(user.id)

//     request(strapi.server)
//       .post(`/orders/ship/${order.id}`)
//       .set('Accept', 'application/json')
//       .set('Content-Type', 'application/json')
//       .set('Authorization', 'Bearer ' + token)
//       .send({
//         order,
//       })
//       .expect('Content-Type', /json/)
//       .expect(200)
//   })
// })
