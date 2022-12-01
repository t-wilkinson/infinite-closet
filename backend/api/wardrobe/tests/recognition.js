/**
 * @group api
 * @group wardrobe/recognition
 */
'use strict'
const fetch = require('node-fetch')
const fs = require('fs')
const mime = require('mime-types')

describe('Recognition', () => {
    jest.setTimeout(10000)
  test('uploading image', async () => {
    const item = {
      images: [{
        url: "https://i.pinimg.com/736x/6e/84/c8/6e84c8af94ea9d6475ed92ea5bca0c91.jpg",
        path: "test/hi"
      }]
    }

    const images = await Promise.allSettled(Object.values(item.images).map(async (image) => {
      const filePath = `/tmp/infinite-closet-${process.env.NODE_ENV}/${image.path.toLowerCase().replace(/[^a-z]/g, '')}`

      const res = await fetch(image.url)
      const fileStream = fs.createWriteStream(filePath)
      await new Promise((resolve, reject) => {
        res.body.pipe(fileStream)
        res.body.on('error', reject)
        fileStream.on('finish', resolve)
      })
      const stats = fs.statSync(filePath)

      return {
        size: stats.size,
        path: filePath,
        name: image.path,
        type: mime.lookup(filePath),
      }
    }))
      // .then(promises => promises.filter(res => res.status === 'fulfilled' && res.value).map(res => res.value))

    console.log(images)
  })
})
