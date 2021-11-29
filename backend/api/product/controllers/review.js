'use strict'

module.exports = {
  async add(ctx) {
    const { user } = ctx.state
    const { slug } = ctx.params
    const { review } = ctx.body

    try {
      const product = await strapi.query('product').findOne({ slug }, [])
      await strapi.services.review.addReview(user, review, product.id)
      return ctx.send({})
    } catch (e) {
      strapi.log.error('Failed to add product review.', e.stack)
      return ctx.send({}, 404)
    }
  },

  async productReviews(ctx) {
    const { slug } = ctx.params
    const product = await strapi.query('product').findOne({ slug }, [])
    const reviews = await strapi
      .query('review')
      .find({ 'order.product': product.id }, ['user', 'images'])
    ctx.send({
      reviews,
      fit: strapi.services.review.fit(reviews),
      rating: strapi.services.review.rating(reviews),
    })
  },
}
