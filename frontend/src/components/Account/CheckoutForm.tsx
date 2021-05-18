import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './CheckoutForm.module.css'
import { getURL } from '@/utils/api'
import { StrapiUser } from '@/utils/models'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

import { Submit } from '@/Form'

const cardStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#32325d',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

export const CheckoutForm = ({
  user,
  state,
  dispatch,
}: {
  user: StrapiUser
  address: any
}) => {
  const stripe = useStripe()
  const elements = useElements()

  const handleChange = async (event) => {
    if (event.error) {
      dispatch({type: 'payment-failure', payload: event.error})
    }
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    dispatch({type: 'payment-processing'})

    stripe
    .createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        phone: user.phoneNumber,
      },
    })

    .then(res => {
      if (res.error) { throw res.error }
      else {
        return axios.post(
          '/stripe/payment_intents',
          {
            paymentMethod: res.paymentMethod.id,
            cart: user.cart.map((item) => item.id),
          },
          {withCredentials: true},
        )
      }
    })

    .then(res => {
      return stripe.confirmCardPayment(res.data.paymentIntent.client_secret)
    })

    .then(res => {
      if (res.error) { throw res.error }
      else {
        dispatch({type: "payment-succeeded", payload: res.paymentIntent.status})
        axios.post( // we can safely expect this to succeed
          '/orders',
          {
            address: state.address.id,
            paymentIntent: res.paymentIntent.id,
            shippingClass: state.shippingClass,
            cart: user.cart.map((item) => item.id),
          },
          {withCredentials: true}
        )
      }
    })

    .catch(err => {
      dispatch({type: 'payment-failed', payload: err})
      if (!err.error) { // not a stripe error, print it to console to debug
        console.error(err)
      }
    })
  }

  return (
    <div className="max-w-sm w-full">
      <form id="payment-form" onSubmit={onSubmit}>
        <div className="border border-gray rounded-sm p-2">
          <CardElement
            id="card-element"
            options={cardStyle}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <Submit
            disabled={["disabled", "processing", "succeeded"].includes(state.paymentStatus)}
          >
            <span id="button-text">
              {state.paymentStatus === "processing" ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                'Pay now'
              )}
            </span>
          </Submit>
        </div>

        {/* Show any error that happens when processing the payment */}
        {state.error && (
          <div className="card-error" role="alert">
            {state.error}
          </div>
        )}
        {/* Show a success message upon completion */}
        <p className={state.paymentStatus === "succeeded" ? 'result-message' : 'result-message hidden'}>
          Payment succeeded, see the result in your
          <a href={`https://dashboard.stripe.com/test/payments`}>
            {' '}
            Stripe dashboard.
          </a>{' '}
          Refresh the page to pay again.
        </p>
      </form>
    </div>
  )
}

export default CheckoutForm
