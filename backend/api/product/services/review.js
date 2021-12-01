'use strict'

const { toId } = require('../../../utils')

async function getUserReviews({ user, product }) {
  return await strapi
    .query('review')
    .find({ 'order.product': product, 'order.user': user }, [])
}

async function getUserOrders({ user, product }) {
  return await strapi.query('order', 'orders').find({ product, user }, [])
}

/**
 * Users existing reviews/orders pertaining to a certain product.id
 * limit whether or not they can review
 */
function canUserReview({ reviews, orders }) {
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

function canReview(productId, userReviews, orderedProducts) {
  const filterProducts = (objects, id) =>
    objects.filter((obj) => toId(obj.product) === id)

  // Can't review same product more than once
  const productReviews = filterProducts(userReviews, productId)

  // User can only review products they have ordered
  const relevantProducts = orderedProducts.filter(
    (product) => toId(product) === productId
  )

  return canUserReview({ reviews: productReviews, orders: relevantProducts })
}

async function addReview(review, order, images) {
  const userCanReview = canUserReview({
    orders: await getUserOrders(order),
    reviews: await getUserReviews(order),
  })

  if (userCanReview) {
    const imageIds = await Promise.all(Object.values(images).map(async (image) => {
      const upload = await strapi.plugins.upload.services.upload.upload({
        data:{},
        files: {
          path: image.path,
          name: image.name,
          type: image.type,
          size: image.size,
        },
      })
      return upload.id
    }))
    console.log(imageIds)

    await strapi.query('review').create({
      ...review,
      order: order.id,
      images: imageIds,
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
