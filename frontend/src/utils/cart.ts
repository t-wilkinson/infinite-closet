import * as storage from '@/utils/storage'

type Order = any
type Cart = Order[]

export const get = (): Cart => {
  return storage.get('cart') || []
}

export const getByUser = (id: string): Cart => {
  return get().filter((order) => order.user === id)
}

export const set = (cart: Cart) => {
  storage.set('cart', cart)
  storage.set('cart-used', true)
}

export const toKey = (order: Order) => {
  if (!order) {
    return
  }

  let productID: number
  if (order.product === undefined) {
    productID = undefined
  } else if (order.product.id !== undefined) {
    productID = order.product.id
  } else {
    productID = order.product
  }
  return `${order.size}_${productID}`
}

export const count = (): number => {
  return get().length
}

export const push = (order: Order) => {
  let cart = get()
  cart.push(order)
  set(cart)
}

export const append = (orders: Order[]) => {
  let cart = get()
  set(cart.concat(orders))
}

export const pop = (order: Order) => {
  let cart = get()
  set(cart.filter((v) => toKey(v) !== toKey(order)))
}

export const popEach = (orders: Order[]) => {
  orders.forEach((order) => pop(order))
}

export const init = () => {
  set([])
  storage.set('cart-used', false) // this is the correct order
}

export const isUsed = () => {
  return storage.get('cart-used')
}
