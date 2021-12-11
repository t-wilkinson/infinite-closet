import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export const PaymentWrapper = ({ children }) => (
  <Elements stripe={promise} children={children} />
)
