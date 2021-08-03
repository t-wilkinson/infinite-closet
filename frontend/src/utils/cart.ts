import * as storage from '@/utils/storage'

type Order = any
type Cart = { [key: string]: Order }

export const get = (): Cart => {
  return storage.get('cart') || {}
}

export const getList = (): Cart => Object.values(get())

export const getByUser = (id: string = undefined): Cart => {
  if (!id) {
    return getList().filter((order) => !order.user)
  } else {
    return getList().filter((order) => order.user === id)
  }
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

export const count = (id: string): number => {
  return getByUser(id).length
}

// this is essentially an upsert
export const insert = (order: Order) => {
  let cart = get()
  cart[toKey(order)] = order
  set(cart)
}

export const insertAll = (orders: Order[]) => {
  orders.forEach((order) => {
    insert(order)
  })
}

export const remove = (order: Order) => {
  let cart = get()
  delete cart[toKey(order)]
}

export const removeAll = (orders: Order[]) => {
  orders.forEach((order) => remove(order))
}

export const init = () => {
  set({})
  storage.set('cart-used', false) // this is the correct order
}

export const isUsed = () => {
  return storage.get('cart-used')
}
