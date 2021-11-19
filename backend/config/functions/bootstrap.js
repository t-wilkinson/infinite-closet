'use strict'

// const fs = require('fs')
const models = require('../../data/data.js').models
require('../../utils')

// const { categories } = require('../../data/data')

const setDefaultPermissions = async () => {
  const permissions_applications = await strapi
    .query('permission', 'users-permissions')
    .find({})
  await Promise.all(
    permissions_applications.map((p) =>
      strapi.query('permission', 'users-permissions').update(
        {
          id: p.id,
        },
        {
          enabled: true,
        }
      )
    )
  )
}

const populatePrivateFields = () => {
  const today = new Date().toJSON()
  return strapi
    .query('product')
    .find(
      {},
      Object.keys(models).map((filter) => `${filter}`)
    )
    .then((products) =>
      products.map((product) => {
        let data = { id: product.id }
        if (process.env.NODE_ENV !== 'production') {
          data.published_at = today
        }
        for (const filter of Object.keys(models)) {
          let slugs
          if (filter === 'sizes') {
            slugs = product[filter].map((v) => v.innerSize || v.size).join(',')
          } else {
            slugs = product[filter].map((v) => v.slug).join(',')
          }
          data[`${filter}_`] = slugs
        }
        strapi.query('product').update({ id: product.id }, data)
      })
    )
}

function registerRoles() {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Manage',
      uid: 'manage',
      pluginName: 'orders',
    },
  ]

  const { actionProvider } = strapi.admin.services.permission
  actionProvider.register(actions)
}

module.exports = async () => {
  await populatePrivateFields()
  await registerRoles()

  if (process.env.NODE_ENV !== 'production') {
    await setDefaultPermissions()
  }
}

// const isFirstRun = async () => {
//   const pluginStore = strapi.store({
//     environment: strapi.config.environment,
//     type: "type",
//     name: "setup",
//   });
//   const initHasRun = await pluginStore.get({
//     key: "initHasRun",
//   });
//   await pluginStore.set({
//     key: "initHasRun",
//     value: true,
//   });
//   return !initHasRun;
// };

// const createSeedData = async (files) => {
//   const getFilesizeInBytes = (filepath) => {
//     var stats = fs.statSync(filepath);
//     var fileSizeInBytes = stats["size"];
//     return fileSizeInBytes;
//   };

//   const handleFiles = (data) => {
//     var file = files.find((x) => x.includes(data.slug));
//     file = `./data/uploads/${file}`;

//     const size = getFilesizeInBytes(file);
//     const array = file.split(".");
//     const ext = array[array.length - 1];
//     const mimeType = `image/.${ext}`;
//     const image = {
//       path: file,
//       name: `${data.slug}.${ext}`,
//       size,
//       type: mimeType,
//     };
//     return image;
//   };

//   const categoriesPromises = categories.map(({ ...rest }) => {
//     return strapi.services.category.create({
//       ...rest,
//     });
//   });

//   await Promise.all(categoriesPromises);
// };
