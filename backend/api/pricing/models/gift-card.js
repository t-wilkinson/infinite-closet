'use strict'

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      if (!data.code) {
        const code = strapi.services.giftcard.generateRandomCode()
        data.code = code
        return data
      }
      return data
    },
  },
}
