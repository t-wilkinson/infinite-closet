'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      if (process.env.NODE_ENV === 'production') {
        const res = await strapi.services.mailchimp.lists.addListMember(
          strapi.services.mailchimp.contactsListId,
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
