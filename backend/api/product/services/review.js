'use strict'

const { toId } = require('../../../utils')

async function userReviews(user) {
  return await strapi.query('review').find({ user: toId(user) }, [])
}

async function productReviews(product) {
  return await strapi.query('review').find({ product: toId(product) }, [])
}

/**
 * Users are limited in what products they can review
 */
function canReview(productId, userReviews, orderedProducts) {
  const filterProducts = (objects, id) =>
    objects.filter((obj) => toId(obj.product) === id)

  // Can't review same product more than once
  const productReviews = filterProducts(userReviews, productId)
  if (productReviews.length > 0) {
    return false
  }

  // User can only review products they have ordered
  const relevantProducts = orderedProducts.filter(product => toId(product) === productId)
  if (relevantProducts.length === 0) {
    return false
  }

  return true
}

async function addReview(user, review, productId) {
  const userId = toId(user)
  const orderedProducts = await strapi.query('order').find({ user: toId(user) })
  const userCanReview = canReview(
    productId,
    await userReviews(user),
    orderedProducts
  )
  if (userCanReview) {
    await strapi.query('review').create({
      ...review,
      user: userId,
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
  userReviews,
  canReview,
  addReview,

  productReviews,
  rating,
  fit,
}
