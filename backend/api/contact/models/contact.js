'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      strapi.services.mailchimp.marketing.lists
        .addListMember(strapi.services.mailchimp.config.ids('list'), {
          email_address: result.email,
          status: result.subscribed ? 'subscribed' : 'unsubscribed',
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
