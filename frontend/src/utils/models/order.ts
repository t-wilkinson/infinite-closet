import { StrapiAddress } from './address';
import { StrapiCoupon } from './coupon';
import { StrapiProduct } from './product';
import { StrapiUser } from './user';

/**
 * Model definition for Order
 */
export interface StrapiOrder {
  id: string;
  status: "cart" | "list" | "planning" | "shipping" | "cleaning" | "completed" | "dropped" | "error";
  message?: { [key: string]: any };
  size: string;
  startDate?: Date;
  shippingDate?: string;
  rentalLength?: "short" | "long";
  address?: StrapiAddress;
  paymentMethod?: string;
  paymentIntent?: string;
  shipment?: string;
  product?: StrapiProduct;
  user?: StrapiUser;
  insurance?: boolean;
  coupon?: StrapiCoupon;
  created_by: string;
  updated_at: string;
  published_at: string;
}