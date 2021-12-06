import { StrapiAddress } from './address';
import { StrapiCoupon } from './coupon';
import { StrapiProduct } from './product';
import { StrapiReview } from './review';
import { StrapiUser } from './user';

/**
 * Model definition for Order
 */
export interface StrapiOrder {
  id: string;
  status: "cart" | "list" | "planning" | "shipping" | "cleaning" | "completed" | "dropped" | "error";
  product?: StrapiProduct;
  user?: StrapiUser;
  review?: StrapiReview;
  details?: string;
  message?: { [key: string]: any };
  size: string;
  startDate?: Date;
  shippingDate?: string;
  rentalLength?: "short" | "long";
  address?: StrapiAddress;
  paymentMethod?: string;
  paymentIntent?: string;
  shipment?: string;
  insurance?: boolean;
  coupon?: StrapiCoupon;
  charge?: number;
  fullName?: string;
  nickName?: string;
  email?: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}