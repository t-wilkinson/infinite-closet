# Product reviews
Allow users to review products and show relevant reviews on the product page. Reviews should give users an idea of the value of a product.

## Context
We need data

## Implementation
- Add /products/top-rated url
- Sort products by rating (requires refactor of controllers.product)
- Upload photo

**Product**
- rating(product.reviews[])
- fit(product.reviews[])
- sortByRating(products[].reviews[])
- reviews(product) -> product.reviews[]

**User**
- age
- weight
- body_type
- modify(user_id, {age, weight, body_type})

**Review**
- user_id
- product_id
- fit :: small | true | large
- rating :: 1-5 stars
- heading
- message
- images
- sort(reviews[], sort_by)
- filter(reviews[], filters)
- userReviews(user_id)
- canReview(review_id, user_id)
    - Users can only review products they've ordered
    - Users can only add one review per product
- addReview(review)
    - canReview()

## Alternatives

## Concerns
### Testing
- canReview constraints
- Sanity check adding reviews
