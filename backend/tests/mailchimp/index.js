/**
 * @group mailchimp
 */

describe('Mailchimp', () => {
  let ids
  let mailchimp

  beforeAll(async () => {
    ids = strapi.services.mailchimp.config.ids
    mailchimp = strapi.services.mailchimp
  })

  it('integration works', async () => {
    await Promise.all([
      mailchimp.marketing.lists.getList(ids('list', 'production')),
      mailchimp.marketing.lists.getList(ids('list', 'development')),
      mailchimp.marketing.lists.getList(ids('list', 'test')),
    ])
  })

  it.only('production has cart information', async () => {
    const carts = await mailchimp.marketing.ecommerce.getStoreCarts(ids('store', 'production'))
    console.log(carts)
  })

  // it('syncs', async () => {
  //   const p = strapi.services.mailchimp.sync.product
  //   const c = strapi.services.mailchimp.sync.cart

  //   const carts = await c.getLocalItems()
  //   const productIds = new Set(
  //     Object.values(carts).reduce((ids, orders) => {
  //       return ids.concat(orders.map((order) => order.product.id.toString()))
  //     }, [])
  //   )

  //   let products = await p.getLocalItems()
  //   for (const key in products) {
  //     if (!productIds.has(key)) {
  //       delete products[key]
  //     }
  //   }

  //   await strapi.services.mailchimp.sync.all(p.sync, products, await p.getMailchimpItems())
  //   await strapi.services.mailchimp.sync.all(c.sync, carts, await c.getMailchimpItems())
  // })
})
