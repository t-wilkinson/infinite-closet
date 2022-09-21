"use strict"
const fetch = require('node-fetch')
const fs = require('fs')
const models = require('../../../data/data.js').models
const { removeNullValues, toId } = require('../../../utils')
// const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')

function base64Encode(file) {
  return fs.readFileSync(file, {encoding: 'base64'})
}

module.exports = {
  async availableProductAttributes(ctx) {
    let filters = {}
    for (const filter in models) {
      if (['sizes'].includes(filter)) {
        continue
      }
      filters[filter] = await strapi.query(models[filter]).find()
    }
    filters.designer = await strapi.query('designer').find()
    ctx.send(filters)
  },

  /**
   * The client will send data to this endpoint.
   * We then use Bloomino integration to find the product information.
   */
  async createProduct(ctx) {
    const user = ctx.state.user
    const config = strapi.services.bloomino.config

    try {
      const images = ctx.request.files
      let req
      let res
      let body

      const jwtToken = await strapi.services.bloomino.authenticate()

      req = {
        body: JSON.stringify({
          data: Object.values(images).map((image, i) =>
            ({
              dataId: `${i}`,
              mimeType: image.type,
              data: base64Encode(image.path),
            })
          ),
          userId: 'bloomino',
          userEmail: 'bloomino@bloomino.co.uk',
        }),
        agent: config.httpsAgent,
        method: "POST",
        headers: {
          "XApiKey": config.apiKey,
          'Accept': '*/*',
          'Authorization': `Bearer ${Buffer.from(jwtToken).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }

      res = await fetch(`${config.apiUrl}/${config.endpoints.doRecognition}`, req)
      body = await res.json()
      const notification = await strapi.query('bloomino-notification').create({ requestId: body.requestId, code: body.code, message: body.message, user: toId(user) })
      console.log('bloomino-notification', notification)

      return ctx.send(null)
    } catch (e) {
      console.log(e.message)
      console.log(e.stack)
      console.log(e)

      return ctx.badRequest(null)
    }
  },

  /**
   * Bloomino will send the product information to this endpoint
   */
  async recognitionNotificationService(ctx) {
    const body = ctx.request.body
    const { originalRequestId, productItems } = body
    console.log('productItems', JSON.stringify(productItems, null, 4))

    // If bloomino-notification is not found, it is invalid
    const bloominoNotification = await strapi.query('bloomino-notification').findOne({ requestId: originalRequestId })
    if (!bloominoNotification) {
      return ctx.badRequest({
        status: 0,
        // detail: "Notification could not be found in database",
      })
    }

    // Create product for each product item
    for await (const item of productItems) {
      // retailer, brand, category, currency, price, colour, size, images
      let designer = null
      if (item.brand) {
        designer = await strapi.query('designer').findOne({ name: item.brand })
        if (!designer) {
          // designer = await strapi.query('designer').create({
          //   name: item.brand,
          // })
        }
      }

      let props = {
        name: item.name,
        details: item.description,
        designer: toId(designer),
        retailPrice: item.price,
        currency: item.currency
      }

      const product = await strapi.query('product').create(
        removeNullValues(props)
      )
      await strapi
        .query('wardrobe-item')
        .create({
          user: toId(bloominoNotification.user),
          wardrobe: null,
          product: toId(product),
        })
    }

    return ctx.send({
      status: "OK",
      description: "Received notification.",
    })
  },

  /**
   * Not sure why this is necessary
   * Bloomino api will contact with endpoint with login information provided by us
   */
  async recognitionNotificationUsers(ctx) {
    const body = ctx.request.body
    const config = strapi.services.bloomino.config
    const validateUser = (env) => process.env.NODE_ENV === env && body.login === config.users[env].login && body.password === config.users[env].password
    if (!validateUser('production') && !validateUser('development')) {
      return ctx.badRequest(null)
    }

    try {
      const token = jwt.sign({user: body.login}, 'privatekey')
      return ctx.send({
        jwtToken: token
      })
    } catch (e) {
      console.error(e)
    }
  },
}
