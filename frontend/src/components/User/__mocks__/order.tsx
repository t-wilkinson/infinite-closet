import { StrapiOrder } from '@/utils/models'
import { StrapiCartItem } from '../Cart'
import { product } from '@/Products/__mocks__/product'

export const order: StrapiOrder = {
  id: '10',
  status: 'cart',
  message: {},
  size: 'M',
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
  order,
  valid: true,
  totalPrice: 100,
  available: 1,
}

export const mockCart: StrapiCartItem[] = [cartItem]

export default order
