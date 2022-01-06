'use strict'

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    await strapi.plugins['orders'].services.lifecycle.forwardAll()
    await strapi.services.contact.updateContactList()
  },
}
