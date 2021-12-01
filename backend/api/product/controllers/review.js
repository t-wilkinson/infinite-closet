'use strict'

module.exports = {
  async add(ctx) {
    const { order_id } = ctx.params
    const review = ctx.request.body

    try {
      const order = await strapi
        .query('order', 'orders')
        .findOne({ id: order_id }, [])
      if (!order) {
        throw new Error("Order doesn't exist")
      }

      await strapi.services.review.addReview(review, order, ctx.request.files)
      return ctx.send({})
    } catch (e) {
      strapi.log.error('Failed to add product review:', e.stack)
      return ctx.send({}, 404)
    }
  },

  async productReviews(ctx) {
    const { slug } = ctx.params
    const product = await strapi.query('product').findOne({ slug }, [])
    const reviews = await strapi
      .query('review')
      .find({ 'order.product': product.id }, ['order', 'images'])
    ctx.send({
      reviews,
      fit: strapi.services.review.fit(reviews),
      rating: strapi.services.review.rating(reviews),
    })
  },
}
