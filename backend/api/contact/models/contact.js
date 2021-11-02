'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      console.log(result)
      // TODO: test this once
      if (process.env.NODE_ENV === 'production') {
        const res = await strapi.services.mailchimp.lists.addListMember({
          email_address: result.email,
          status: result.subscribed ? 'subscribed' : 'unsubscribed',
        })
        console.log(res)
      }
    },
  },
}
