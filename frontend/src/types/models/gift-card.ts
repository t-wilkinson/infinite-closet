import { StrapiUser } from './user';

/**
 * Model definition for Gift Card
 */
export interface StrapiGiftCard {
  id: string;
  value: number;
  code?: string;
  paymentIntent?: string;
  owner?: StrapiUser;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}