'use strict'

module.exports = {
  lifecycles: {
    async afterCreate(result) {
      console.log(result)
      const subscribed = result.metadata && result.metadata.subscribe
      if (process.env.NODE_ENV === 'production') {
        const res = await strapi.services.mailchimp.lists.addListMember({
          email_address: result.contact,
          status: subscribed ? 'subscribed' : 'unsubscribed',
        })
        console.log(res)
      }
    },
  },
}
