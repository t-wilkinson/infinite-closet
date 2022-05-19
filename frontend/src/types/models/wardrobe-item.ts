import { StrapiProduct } from './product';
import { StrapiUser } from './user';
import { StrapiWardrobe } from './wardrobe';

/**
 * Model definition for Wardrobe Item
 */
export interface StrapiWardrobeItem {
  id: string;
  product?: StrapiProduct;
  wardrobe?: StrapiWardrobe;
  user?: StrapiUser;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}