"use strict"
const fetch = require('node-fetch')
const fs = require('fs')
const models = require('../../../data/data.js').models
const { removeNullValues, toId, slugify } = require('../../../utils')
const jwt = require('jsonwebtoken')
const mime = require('mime-types')

function base64Encode(file) {
  return fs.readFileSync(file, {encoding: 'base64'})
}

module.exports = {
  async availableProductAttributes(ctx) {
    const user = ctx.state.user

    const customUserDesigners = await strapi
      .query('product')
      .find({user: toId(user)}, [])
      .then(products =>
        Array.from(new Set(products.map(product => product.customUserDesigner)))
          .filter(v => v)
          .map(name => ({
            name,
            slug: name.toLowerCase()
          }))
      )
    const designerNames = await strapi.query('designer').find()
      .then(designers => designers.map(designer => ({
        name: designer.name,
        slug: designer.slug
      })))

    let attributes = {
      filters: {},
      designers: [
        ...designerNames,
        ...customUserDesigners,
      ],
      wardrobes: [
        ...await strapi.query('wardrobe').find({
          user: toId(user),
        }),
        { name: 'My wardrobe', slug: 'my-wardrobe' }
      ]
    }

    for (const filter in models) {
      if (['sizes'].includes(filter)) {
        continue
      }
      attributes.filters[filter] = await strapi.query(models[filter]).find()
    }

    ctx.send(attributes)
  },

  async uploadProduct(ctx) {
    const user = ctx.state.user
    const product = await strapi.services.wardrobe.createProduct(ctx.request, user)

    await strapi
      .query('wardrobe-item')
      .create({
        user: toId(user),
        wardrobe: null,
        product: toId(product),
      })

    ctx.send(null)
  },

  /**
   * The client will send data to this endpoint.
   * We then use Bloomino integration to find the product information.
   */
  async uploadReceipt(ctx) {
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
          userId: user.username,
          userEmail: user.email,
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

      res = await fetch(`${config.apiUrl}${config.endpoints.doRecognition}`, req)
      body = await res.json()
      const notification = await strapi.query('bloomino-notification').create({
        requestId: body.requestId, code: body.code, message: body.message, user: toId(user)
      })
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
    if (!bloominoNotification && originalRequestId !== 'QSmWDCON3UyGFgWUspFSSguy8') {
      return ctx.badRequest({
        status: 0,
        detail: "Bloomino request ID could not be found in database.",
      })
    }

    try {
      // Create product for each product item
      for await (const item of productItems) {
        console.log('processing: ', item.name)
        // retailer, brand, category, currency, price, colour, size, images
        let customDesignerName = item.brand || ''

        // bko/... is the path images have from bloomino
        const bloominoImagePath = '/tmp/bko'

        if (!fs.existsSync(bloominoImagePath)) {
          fs.mkdirSync(bloominoImagePath)
        }

        const settled = Promise.allSettled(Object.values(item.images).map(async (image) => {
          const filePath = `/tmp/${image.path}` // only trust path if from bloomino

          const res = await fetch(image.url, {
            agent: strapi.services.bloomino.config.httpsAgent,
          })
          const fileStream = fs.createWriteStream(filePath)
          await new Promise((resolve, reject) => {
            res.body.pipe(fileStream)
            res.body.on('error', reject)
            fileStream.on('finish', resolve)
          })
          const stats = fs.statSync(filePath)
          console.log('image url', image.url)

          return {
            size: stats.size,
            path: filePath,
            name: image.path,
            type: mime.lookup(filePath),
          }
        }))
        console.log(settled)
        const images = await settled
          .then(promises => promises.filter(res => res.status === 'fulfilled' && res.value).map(res => res.value))

        const productImages = await strapi.plugins['upload'].services.upload.upload({
          data: {},
          files: images,
        })

        let props = {
          name: item.name.replace(/[0-9]+/g, '').replace(/-/g, ' '),
          slug: slugify(item.name),
          details: item.description,
          customDesignerName,
          retailPrice: item.price,
          currency: item.currency,
          user: toId(bloominoNotification.user),
          images: productImages,
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
    } catch (e) {
      console.error(e)
      console.error(e.message)
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
