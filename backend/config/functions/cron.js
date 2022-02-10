'use strict'
const { day, splitName } = require('../../utils')

// 0[SECOND (optional)] 1[MINUTE] 2[HOUR] 3[DAY OF MONTH] 4[MONTH OF YEAR] 5[DAY OF WEEK]
module.exports = {
  '0 2 * * *': async () => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    strapi.log.info('Forwarding lifecycles')
    strapi.plugins['orders'].services.lifecycle.forwardAll()
  },

  // Sync mailchimp
  '0 * * * *': async () => {
    if (process.env.NODE_ENV === 'production') {
      strapi.log.info('Syncing mailchimp')
      strapi.services.mailchimp.helpers.sync()
    }
  },

  '0 7 * * *': async () => {
    strapi.log.info('Sending gift card emails')
    // Send out gift-card emails
    const today = day()
    const giftCards = await strapi.query('gift-card').find({ })
    for (const giftCard of giftCards) {
      if (!giftCard.deliveryDate || !giftCard.recipientEmail) {
        continue
      }
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
