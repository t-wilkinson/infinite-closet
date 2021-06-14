import { loadStripe } from '@stripe/stripe-js'
import { CardElement, Elements } from '@stripe/react-stripe-js'

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export const PaymentWrapper = ({ children }) => (
  <Elements stripe={promise} children={children} />
)

const cardStyle = {
  style: {
    base: {
      color: '#000',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#5f6368',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

export const PaymentCard = ({ handleChange }) => (
  <div className="justify-center border border-gray rounded-sm h-12 p-2">
    <CardElement
      id="card-element"
      options={cardStyle}
      onChange={handleChange}
    />
  </div>
)
