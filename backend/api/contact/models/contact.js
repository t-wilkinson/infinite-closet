'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      if (process.env.NODE_ENV === 'test') {
        return
      }

      const { email } = result
      const hash = strapi.services.contact.toHash(email)
      strapi.services.mailchimp.marketing.lists
        .setListMember(strapi.services.mailchimp.config.ids('list'), hash, {
          email_address: email,
          status_if_new: result.subscribed ? 'subscribed' : 'unsubscribed',
        })
        .then((res) => {
          if (res.status === 404) {
            strapi.log.error(
              'mailchimp create contact response=%o result=%o',
              res,
              result
            )
          }
        })
        .catch((err) =>
          strapi.log.error('mailchimp failure creating contact error=%o', err)
        )
    },
  },
}
