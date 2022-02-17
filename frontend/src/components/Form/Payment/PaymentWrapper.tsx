import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export const PaymentWrapper = ({ children, clientSecret=undefined}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'flat',
      // fonts: ['Lato'],
      // labels: 'floating',
      variables: {
        colorPrimary: '#ad9253',
        colorText: '#000000',
        colorDanger: '#ff3f22',
        borderRadius: '0.125rem',
        // borderColor: '#5f6368',
        spacingUnit: '0px',
        fontFamily: 'Lato, system-ui, sans-serif',
      },
    },
  } as any

  return <Elements stripe={promise} children={children} options={options}/>
}
