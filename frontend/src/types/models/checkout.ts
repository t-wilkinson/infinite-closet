import { StrapiAddress } from './address';
import { StrapiContact } from './contact';
import { StrapiOrder } from './order';
import { StrapiPurchase } from './purchase';
import { StrapiUser } from './user';

/**
 * Model definition for Checkout
 */
export interface StrapiCheckout {
  id: string;
  orders: StrapiOrder[];
  address?: StrapiAddress;
  purchase?: StrapiPurchase;
  user?: StrapiUser;
  contact?: StrapiContact;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}