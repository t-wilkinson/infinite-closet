'use strict'

const { toId } = require('../../../utils')

/**
 * A users existing orders and reviews of a product
 * limit whether or not they can review
 */
function canReview(orders) {
  // User can only review products they have ordered
  if (orders.length === 0) {
    return false
  }

  const reviews = orderReviews(orders)
  // Can't review same product more than once
  if (reviews.length > 0) {
    return false
  }

  return true
}

function orderReviews(orders) {
  return orders.map(order => order.review).filter(v => v)
}

async function getUserOrders({ product, user }) {
  return await strapi
    .query('order', 'orders')
    .find({ product: toId(product), user: toId(user), status: 'completed'}, ['review'])
}

async function canUserReview({ product, user }) {
  if (!product || !user) {
    return false
  }

  const orders = await getUserOrders({ product, user })
  strapi.log.debug('review orders', orders)
  if (canReview(orders)) {
    return orders[0] // Should only have one order
  } else {
    return false
  }
}

async function addReview({ product, user, review, images=[] }) {
  const userCanReview = await canUserReview({ product, user })

  if (userCanReview) {
    const order = userCanReview
    const uploads = await strapi.plugins.upload.services.upload.upload({
      data: {},
      files: Object.values(images).map((image) => ({
        path: image.path,
        name: image.name,
        type: image.type,
        size: image.size,
      })),
    })

    review = await strapi.query('review').create({
      ...review,
      images: uploads,
    })
    await strapi.query('order', 'orders').update({id: order.id}, {review: review.id})
    return review
  } else {
    throw new Error('User is unable to review.')
  }
}

function rating(reviews) {
  return reviews.reduce((acc, { rating }) => acc + rating, 0) / reviews.length
}

function fit(reviews) {
  const count = reviews.reduce(
    (acc, { fit }) => {
      acc[fit] = acc[fit] + 1
      return acc
    },
    {
      small: 0,
      true: 0,
      large: 0,
    }
  )

  // small <-> true <-> large
  // I'm imagining small and large are pulling in opposite directions
  // I can't think of a better way of doing this
  const dif = count.large - count.small
  if (count.true > Math.abs(dif)) {
    return 'true'
  } else if (count.large > count.small) {
    return 'large'
  } else if (count.small > count.large) {
    return 'small'
  } else {
    // there aren't any fits
    return 'true'
  }
}

module.exports = {
  orderReviews,
  canUserReview,
  canReview,
  addReview,
  rating,
  fit,
}
