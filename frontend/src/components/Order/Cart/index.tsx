import React from 'react'
import { useSelector } from '@/utils/store'

import { EditCartItem } from './EditCartItem'
import { CartItem } from './CartItem'

export { CartItem } from './CartItem'
export { EditCartItem }
export * from './types'
export * from './api'

export const Cart = () => {
  const cart = useSelector((state) => state.orders.checkoutCart)

  return (
    <div className="w-full space-y-2">
      {cart.map((item) => {
        return <CartItem key={item.order.id} {...item} />
      })}
    </div>
  )
}
