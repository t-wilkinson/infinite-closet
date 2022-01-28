'use strict'
const { day, splitName } = require('../../utils')

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    await strapi.plugins['orders'].services.lifecycle.forwardAll()
    await strapi.services.contact.updateContactList()
  },

  '0 7 * * *': async () => {
    // Send out gift-card emails
    const today = day()
    const giftCards = await strapi.query('gift-card').find({ })
    for (const giftCard of giftCards) {
      if (!day(giftCard.deliveryDate).isSame(today, 'day')) {
        continue
      }
      const { firstName } = splitName(giftCard.recipientName)
      strapi.services.template_email.giftCard({
        firstName,
        email: giftCard.recipientEmail,
        giftCard,
      })
    }
  }

}
