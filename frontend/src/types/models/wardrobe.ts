import { StrapiUser } from './user';

/**
 * Model definition for Wardrobe
 */
export interface StrapiWardrobe {
  id: string;
  name?: string;
  slug?: string;
  user?: StrapiUser;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}