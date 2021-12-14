'use strict'

module.exports = {
  async canReview(ctx) {
    const { user } = ctx.state
    const { slug } = ctx.params
    try {
      const product = await strapi.query('product').findOne({ slug }, [])
      const canReview = await strapi.services.review.canUserReview({product, user})
      return ctx.send({canReview})
    } catch (e) {
      return ctx.send({canReview: false, error: e.message})
    }
  },

  async add(ctx) {
    const { slug } = ctx.params
    const { user } = ctx.state
    let review = ctx.request.body
    const product = await strapi.query('product').findOne({ slug }, [])
    if (isNaN(review.rating) || review.rating < 0 || review.rating > 5) {
      return ctx.send({ error: 'Rating must be between 1-5' }, 404)
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
      return ctx.send(null, 404)
    }
  },

  async productReviews(ctx) {
    const { slug } = ctx.params
    const { user } = ctx.state
    const product = await strapi.query('product').findOne({ slug }, [])
    const orders = await strapi
      .query('order', 'orders')
      .find({ product: product.id, review_null: false }, [
        'product',
        'user',
        'review',
        'review.images',
      ])

    const reviews = strapi.services.review.orderReviews(orders)
    ctx.send({
      orders,
      fit: strapi.services.review.fit(reviews),
      rating: strapi.services.review.rating(reviews),
      canReview: await strapi.services.review.canUserReview({ product, user }),
    })
  },
}
