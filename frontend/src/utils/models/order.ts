import { StrapiAddress } from './address';
import { StrapiCart Item } from './cart-item';

/**
 * Model definition for Order
 */
export interface StrapiOrder {
  id: string;
  paymentIntent: string;
  cartItems: StrapiCart Item[];
  status?: "planning" | "shipping" | "shipped";
  address?: StrapiAddress;
  shipping?: string;
  shippingClass?: "one_day" | "next_day" | "two_day";
  created_by: string;
}