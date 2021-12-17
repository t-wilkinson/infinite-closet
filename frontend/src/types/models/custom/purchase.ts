import { StrapiOrder } from '../order';

/**
 * Model definition for Purchase
 */
export interface StrapiPurchase {
  id: string;
  order?: StrapiOrder;
  amount?: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}