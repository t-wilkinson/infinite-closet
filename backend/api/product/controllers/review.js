'use strict'

module.exports = {
  async add(ctx) {
    const { slug } = ctx.params
    const { user } = ctx.state
    let review = ctx.request.body
    const product = await strapi.query('product').findOne({ slug }, [])
    if (isNaN(review.rating) || review.rating < 0 || review.rating > 5) {
      return ctx.send({error: 'Rating must be between 1-5'}, 404)
    }

    try {
      review = await strapi.services.review.addReview({
        product,
        user,
        review,
        images: ctx.request.files,
      })
      return ctx.send({ review })
    } catch (e) {
      strapi.log.error('Failed to add product review:', e.stack)
      return ctx.send({}, 404)
    }
  },

  async productReviews(ctx) {
    const { slug } = ctx.params
    const { user } = ctx.state
    const product = await strapi.query('product').findOne({ slug }, [])
    const reviews = await strapi
      .query('review')
      .find({ 'order.product': product.id }, [
        'order',
        'order.product',
        'order.user',
        'images',
      ])

    ctx.send({
      reviews,
      fit: strapi.services.review.fit(reviews),
      rating: strapi.services.review.rating(reviews),
      canReview: await strapi.services.review.canUserReview({ product, user }),
    })
  },
}
