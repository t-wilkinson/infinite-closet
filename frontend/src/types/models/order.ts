import { StrapiAddress } from './address';
import { StrapiCheckout } from './checkout';
import { StrapiContact } from './contact';
import { StrapiProduct } from './product';
import { StrapiReview } from './review';
import { StrapiShipment } from './shipment';
import { StrapiUser } from './user';

/**
 * Model definition for Order
 */
export interface StrapiOrder {
  id: string;
  status: "cart" | "list" | "shipping" | "completed" | "dropped";
  size: string;
  expectedStart?: string;
  insurance?: boolean;
  rentalLength?: "short" | "long";
  trackingId?: string;
  product?: StrapiProduct;
  user?: StrapiUser;
  contact?: StrapiContact;
  review?: StrapiReview;
  address?: StrapiAddress;
  shipment?: StrapiShipment;
  checkout?: StrapiCheckout;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}