import { StrapiOrder } from '@/utils/models'
import { StrapiCartItem } from '../Cart'
import { product } from '@/Products/__mocks__/product'

export const order: StrapiOrder = {
  id: '',
  status: 'cart',
  message: {},
  size: '',
  startDate: new Date('2020-06-01'),
  shippingDate: '',
  rentalLength: 'short',
  address: null,
  paymentMethod: '',
  paymentIntent: '',
  shipment: '',
  // TODO
  product,
  user: null,
  insurance: false,
  created_by: '',
  updated_at: '',
  published_at: '',
}

export const cartItem: StrapiCartItem = {
  ...order,
  itemInsurance: false,
  valid: true,
  price: 100,
  available: 1,
}

export default order
