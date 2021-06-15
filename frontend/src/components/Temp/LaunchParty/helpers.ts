export function handleServerResponse(response, stripe, dispatch) {
  if (response.error) {
    // Show error from server on payment form
    dispatch({ type: 'payment-failed', payload: 'Unable to process payment' })
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    stripe
      .handleCardAction(response.payment_intent_client_secret)
      .then((res) => handleStripeJsResult(res, stripe, dispatch))
  } else {
    dispatch({ type: 'payment-succeeded' })
  }
}

export function handleStripeJsResult(result, stripe, dispatch) {
  if (result.error) {
    dispatch({ type: 'payment-failed', payload: result.error })
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    axios
      .post('/launch-party/join', {
        paymentIntent: result.paymentIntent.id,
      })
      .then((res) => handleServerResponse(res.data, stripe, dispatch))
  }
}
