import React from 'react'
import { Container } from '../layout'

export const ReviewRequest = () => {
  return (
    <Container
      title="Don't forget to leave a review"
      href="/user/order-history"
      button="Review Your Items"
    >
      <span>
        Your feedback helps us learn how we can improve! Write a product
        review for one or more of your rental items and recieve a £5 promo
        code for your next order.
      </span>
    </Container>
  )
}

export default ReviewRequest
