import React from 'react'
import { Input } from '@/Form'
import useFields from '@/Form/useFields'

export const Order = ({ data }) => {
  return (
    <div className="items-center max-w-screen-xl h-full">
      <div className="w-full">
        <Addresses addresses={data.addresses} />
        <PaymentMethods paymentMethods={data.paymentMethods} />
        <Summary cart={data.cart} />
      </div>
      <Cart cart={data.cart} />
    </div>
  )
}
export default Order

const Cart = ({ cart }) => {
  return (
    <div>
      {cart.map((cartItem) => (
        <> </>
      ))}
    </div>
  )
}

const Addresses = ({ addresses }) => {
  if (addresses.length === 0) {
    return <AddAddress />
  }
  return <div></div>
}

const AddAddress = (props) => {
  const fields = useFields({
    firstName: {},
    lastName: {},
    address: {},
    apt: { label: 'Apt / Unit / Suite (Optional)' },
    city: {},
    state: {},
    zipCode: { label: 'ZIP Code' },
    mobileNumber: {},
  })

  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(fields).map((field) => (
        <Input key={field} {...fields[field]} />
      ))}
    </div>
  )
}

const PaymentMethods = ({ paymentMethods }) => {
  return <> </>
}

const AddPaymentMethod = () => {
  const fields = useFields({
    firstName: {},
    lastName: {},
    address: {},
    apt: { label: 'Apt / Unit / Suite (Optional)' },
    city: {},
    state: {},
    zipCode: { label: 'ZIP Code' },
    mobileNumber: {},
  })

  return (
    <div className="grid grid-flow-row grid-cols-2 w-full gap-x-4">
      {Object.keys(fields).map((field) => (
        <Input key={field} {...fields[field]} />
      ))}
    </div>
  )
}

const Summary = ({ cart }) => {
  return <> </>
}
