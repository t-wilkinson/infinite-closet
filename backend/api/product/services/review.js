'use strict'

const { toId } = require('../../../utils')

async function getUserReviews({ product, user }) {
  return await strapi
    .query('review')
    .find({ 'order.product': toId(product), 'order.user': toId(user) }, [])
}

async function getUserOrders({ product, user }) {
  return await strapi
    .query('order', 'orders')
    .find({ product: toId(product), user: toId(user) }, [])
}

/**
 * Users existing reviews/orders pertaining to a certain product.id
 * limit whether or not they can review
 */
function canReview({ reviews, orders }) {
  // Can't review same product more than once
  if (reviews.length > 0) {
    return false
  }

  // User can only review products they have ordered
  if (orders.length === 0) {
    return false
  }

  return true
}

async function canUserReview({ product, user }) {
  if (!product || !user) {
    return false
  }

  const orders = await getUserOrders({ product, user })
  const reviews = await getUserReviews({ product, user })
  if (canReview({ orders, reviews })) {
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

    return await strapi.query('review').create({
      ...review,
      order: order.id,
      images: uploads,
    })
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
  canUserReview,
  canReview,
  addReview,
  rating,
  fit,
}
