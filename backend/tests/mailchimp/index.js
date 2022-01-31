/**
 * @group mailchimp
 */

it('syncs', async () => {
  const p = strapi.services.mailchimp.sync.product
  const c = strapi.services.mailchimp.sync.cart

  const carts = await c.getLocalItems()
  const productIds = new Set(
    Object.values(carts).reduce((ids, orders) => {
      return ids.concat(orders.map((order) => order.product.id.toString()))
    }, [])
  )

  let products = await p.getLocalItems()
  for (const key in products) {
    if (!productIds.has(key)) {
      delete products[key]
    }
  }

  await strapi.services.mailchimp.sync.all(p.sync, products, await p.getMailchimpItems())
  await strapi.services.mailchimp.sync.all(c.sync, carts, await c.getMailchimpItems())
})
