import { StrapiContact } from './contact';
import { StrapiCoupon } from './coupon';
import { StrapiGiftCard } from './gift-card';

/**
 * Model definition for Purchase
 */
export interface StrapiPurchase {
  id: string;
  status?: "success" | "refunded";
  paymentIntent?: string;
  paymentMethod?: string;
  charge?: number;
  coupon?: StrapiCoupon;
  giftCard?: StrapiGiftCard;
  giftCardDiscount?: number;
  contact?: StrapiContact;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}