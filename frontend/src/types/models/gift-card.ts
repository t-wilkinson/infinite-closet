import { StrapiPurchase } from './custom/purchase';
import { StrapiUser } from './user';

/**
 * Model definition for Gift Card
 */
export interface StrapiGiftCard {
  id: string;
  amount: number;
  code: string;
  used?: boolean;
  purchases: StrapiPurchase[];
  owner?: StrapiUser;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}