'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      strapi.log.debug(
        'created contact',
        result,
        strapi.services.mailchimp.marketing.contactsListId
      )
      if (process.env.NODE_ENV === 'production') {
        const res = await strapi.services.mailchimp.marketing.lists.addListMember(
          strapi.services.mailchimp.marketing.contactsListId,
          {
            email_address: result.email,
            status: result.subscribed ? 'subscribed' : 'unsubscribed',
          }
        )
        strapi.log.debug('mailchimp create contact', res)
      }
    },
  },
}
