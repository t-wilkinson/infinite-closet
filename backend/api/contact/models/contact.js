'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      if (process.env.NODE_ENV === 'production') {
        strapi.services.mailchimp.marketing.lists
          .addListMember(strapi.services.mailchimp.marketing.contactsListId, {
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
      }
    },
  },
}
